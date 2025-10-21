import { v4 } from "uuid";
import UserAgent from 'user-agents';
import { createHash, randomBytes } from "crypto";
import { Wallet } from "ethers";

const userAgent = new UserAgent();
const textEncoder = new TextEncoder();
/**
 * Base64Url编码函数
 */
function base64UrlEncode(str: string): string {
    return Buffer.from(str)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

export interface Device {
    devid: string;
    agent: string;
}

export function genDevice(): Device {
    return { devid: v4(), agent: userAgent.toString() };
}

let _traceId: string | undefined;

export async function getTraceId(): Promise<string> {
    if (_traceId === undefined) {
        _traceId = (await fetch("https://web3.okx.com/zh-hans/build/dev-portal")).headers.get("x-okfe-serverless-traceid") ?? "";
    }
    return _traceId;
}

// 生成加密密钥头
export async function calculateOkVerifyHeaders({
    token,
    body,
    url,
    now,
    device,
    traceid
}: {
    url: string;
    body: object;
    device?: Device;
    token?: string;
    now?: number;
    traceid?: string;
}) {
    // 使用默认值简化代码
    traceid = traceid ?? await getTraceId();
    now = now ?? Date.now();
    token = token ?? v4();
    device = device ?? genDevice();
    const requestTimestamp = (now - 6).toString();

    // 计算 token 的 SHA-256 哈希值
    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        textEncoder.encode(token)
    );

    // 将哈希值转换为十六进制字符串
    const hashArray = new Uint8Array(hashBuffer);
    let hashHex = "";
    for (let i = 0; i < hashArray.length; i++) {
        const byte = hashArray[i];
        hashHex += byte.toString(16).padStart(2, "0");
    }

    // 计算时间相关参数
    const timestampInSeconds = Math.floor(now / 1000);
    const l = Math.floor((timestampInSeconds / 600) % 32);
    const f = Math.floor((timestampInSeconds / 3600) % 32);

    // 生成 r 字符串
    let r = "";
    for (let p = 0; p < 32; p++) {
        const index = (l + (f + p) * p) % 32;
        r += hashHex[index];
    }

    // 编码密钥数据
    const keyData = textEncoder.encode(r);

    // 导入 HMAC 密钥
    const hmacKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        {
            name: "HMAC",
            hash: "SHA-256",
        },
        false,
        ["sign"]
    );

    // 准备要签名的数据
    const jsbody = JSON.stringify(body);
    const content = url + jsbody;
    const dataToSign = textEncoder.encode(content);

    // 进行签名
    const signedData = await crypto.subtle.sign("HMAC", hmacKey, dataToSign);

    // 生成签名的 Base64 编码
    let signature = "";
    const signedArray = new Uint8Array(signedData);
    for (let i = 0; i < signedArray.length; i++) {
        signature += String.fromCharCode(signedArray[i]);
    }
    signature = btoa(signature);

    // fp-token

    function generateDeviceFingerprint(): string {
        // 实际应用中，这会收集各种设备和浏览器信息
        const fingerprintData = {
            userAgent: device?.agent,
            screenSize: '1920x1080',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator?.language || 'zh-CN',
            userAgentData: navigator?.platform || 'Win32',
            random: Math.random().toString(36).slice(2)
        };

        // 生成指纹哈希
        const hash = createHash('sha256');
        hash.update(JSON.stringify(fingerprintData));
        return hash.digest('base64');
    }

    async function generateJwtToken(): Promise<string> {
        // JWT头部
        const header = {
            kid: '168338', // 密钥ID
            alg: 'ES256'   // 使用ES256算法
        };

        const cpk = randomBytes(64).toString('base64')
        // JWT载荷
        const payload = {
            iat: Math.floor(Date.now() / 1000), // 发行时间戳
            effp: generateDeviceFingerprint(),  // 设备指纹
            did: device?.devid,                      // 设备唯一标识
            cpk       // 挑战公钥
        };

        // Base64Url编码头部和载荷
        const encodedHeader = base64UrlEncode(JSON.stringify(header));
        const encodedPayload = base64UrlEncode(JSON.stringify(payload));

        // 组合头部和载荷
        const unsignedToken = `${encodedHeader}.${encodedPayload}`;

        // 使用已导入的 HMAC 密钥（hmacKey）进行 ES256 签名
        const signatureBytes = await crypto.subtle.sign("HMAC", hmacKey, textEncoder.encode(unsignedToken));
        // 将签名结果转为 Base64Url
        const signature = base64UrlEncode(String.fromCharCode(...new Uint8Array(signatureBytes)));

        // 组合成完整的JWT
        return `${unsignedToken}.${signature}`;
    }

    const fptoken = await generateJwtToken();

    // 在真实场景中，这应该使用ECDSA私钥生成P1363格式的签名
    // 这里我们生成一个模拟的P1363格式签名：先对fptoken做HMAC-SHA256，再拼接32字节r和32字节s，形成64字节P1363格式
    const hmacSig = await crypto.subtle.sign("HMAC", hmacKey, textEncoder.encode(fptoken));
    const hmacBytes = new Uint8Array(hmacSig); // 32字节
    const p1363Bytes = new Uint8Array(64);
    p1363Bytes.set(hmacBytes, 0);      // r
    p1363Bytes.set(hmacBytes, 32);     // s
    const p1363Signature = p1363Bytes;
    const p1363SignatureBase64 = btoa(String.fromCharCode(...new Uint8Array(p1363Signature)));

    return {
        url: `https://web3.okx.com${url}?t=${requestTimestamp}`,
        header: {
            "User-Agent": device.agent,
            "Accept": "application/json",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Content-Type": "application/json",
            "App-Type": "web",
            "X-Utc": "8",
            "X-Locale": "zh_CN",
            "X-Zkdex-Env": "0",
            "X-Cdn": "https://web3.okx.com",
            "Ok-Verify-Token": token,
            "Ok-Timestamp": now.toString(),
            "Ok-Verify-Sign": signature,
            "X-Simulated-Trading": "undefined",
            "Devid": device.devid,
            "X-FpToken": fptoken,
            "X-FpToken-Signature": `{P1363}${p1363SignatureBase64}`,
            "X-Request-Timestamp": requestTimestamp,
            "X-Site-Info": "==QfxojI5RXa05WZiwiIMFkQPx0Rfh1SPJiOiUGZvNmIsICUKJiOi42bpdWZyJye",
            "X-Id-Group": `${traceid}-c-${Math.floor(Math.random() * 10) + 6}`,
            "Sec-GPC": "1",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Priority": "u=4"
        },
        body: jsbody,
        device,
        traceid
    };
}

const siyao = "6667e51a8c46b129922256e3b44f98ed215ae9162cb3efc0a4f4f560d9b60af1"
const wallet = new Wallet(siyao);
const addr = wallet.address;

const reqcontent =
    await calculateOkVerifyHeaders({
        url: "/priapi/v1/ak/address/verify",
        body: {
            "address": addr,
            "chainIndex": 1,
            "xClientOrigin": ""
        }
    })

// 获取需要签名的消息
const res = await fetch(reqcontent.url, {
    headers: reqcontent.header,
    method: "POST",
    body: reqcontent.body
})

// 解析响应
const jsonres = await res.json()
// 签名
const sign = await wallet.signMessage(jsonres.data.signData)

const loginContent = await calculateOkVerifyHeaders({
    url: "/priapi/v1/ak/address/login",
    body: {
        "address": addr,
        "chainIndex": 1,
        "signStamp": sign,
        "xClientOrigin": ""
    },
    device: reqcontent.device,
    traceid: reqcontent.traceid
});

// 签名消息进行登录，获取akToken
const loginRes = await fetch(loginContent.url, {
    headers: loginContent.header,
    method: "POST",
    body: loginContent.body
});
const loginJson = await loginRes.json();
console.log('akToken:', loginJson.data.akToken);

