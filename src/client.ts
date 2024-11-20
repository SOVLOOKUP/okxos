import ky, { SearchParamsOption } from "ky";
import * as crypto from "@originjs/crypto-js-wasm"
import { stringify } from "qs";
const { HmacSHA256, SHA256, enc } = crypto["default"] as typeof crypto;
await SHA256.loadWasm();

const baseURL = "https://www.okx.com";
const prePath = "/api/v5/";

interface FailRes {
  code: "1";
  msg: string;
}

interface SuccRes<T> {
  code: "0";
  msg: string;
  data: T;
}

export type Res<T> = FailRes | SuccRes<T>;

const base = ky.create({
  prefixUrl: baseURL + prePath,
});

// 定义 API 凭证和项目 ID
export interface APIConfig {
  apiKey: string;
  apiSecret: string;
  apiPass: string;
  projectID: string;
}

function preHash(
  timestamp: string,
  method: string,
  requestPath: string,
  params: any
) {
  // 根据字符串和参数创建预签名
  let query_string = "";
  if (method === "GET" && params) {
    query_string = "?" + stringify(params);
  }
  if (method === "POST" && params) {
    query_string = JSON.stringify(params);
  }
  return timestamp + method + requestPath + query_string;
}

function createSignature(
  method: string,
  requestPath: string,
  params: any,
  apiSecret: string
) {
  requestPath = prePath + requestPath;
  // 获取 ISO 8601 格式时间戳
  const timestamp = new Date().toISOString();
  // 生成签名
  const message = preHash(timestamp, method, requestPath, params);
  const signature = sign(message, apiSecret);
  return { signature, timestamp };
}

function sign(message: string, apiSecret: string) {
  // 使用 HMAC-SHA256 对预签名字符串进行签名
  return HmacSHA256(message, apiSecret).toString(enc.Base64);
}

export type Endpoint = GetEndpoint | PostEndpoint;

export interface GetEndpoint {
  method: "GET";
  endpoint: string;
  params?: SearchParamsOption;
}

export interface PostEndpoint {
  method: "POST";
  endpoint: string;
  params: object;
}

export const OKXClient = (apiConfig: APIConfig) => {
  async function sendGetRequest<T>(requestPath: string, params: any) {
    // 生成签名
    const { signature, timestamp } = createSignature(
      "GET",
      requestPath,
      params,
      apiConfig["apiSecret"]
    );

    // 生成请求头
    const headers = {
      "OK-ACCESS-KEY": apiConfig["apiKey"],
      "OK-ACCESS-SIGN": signature,
      "OK-ACCESS-TIMESTAMP": timestamp,
      "OK-ACCESS-PASSPHRASE": apiConfig["apiPass"],
      "OK-ACCESS-PROJECT": apiConfig["projectID"], // 这仅适用于 WaaS APIs
    };

    return await base
      .get<Res<T>>(requestPath, {
        searchParams: params,
        headers,
      })
      .json();
  }

  async function sendPostRequest<T>(requestPath: string, params: object) {
    // 生成签名
    const { signature, timestamp } = createSignature(
      "POST",
      requestPath,
      params,
      apiConfig["apiSecret"]
    );

    // 生成请求头
    const headers = {
      "OK-ACCESS-KEY": apiConfig["apiKey"],
      "OK-ACCESS-SIGN": signature,
      "OK-ACCESS-TIMESTAMP": timestamp,
      "OK-ACCESS-PASSPHRASE": apiConfig["apiPass"],
      "OK-ACCESS-PROJECT": apiConfig["projectID"], // 这仅适用于 WaaS APIs
      "Content-Type": "application/json", // POST 请求需要加上这个头部
    };

    return await base
      .post<Res<T>>(requestPath, {
        body: JSON.stringify(params),
        headers,
      })
      .json();
  }

  return async <T extends any>(api: {
    endpoint: string;
    method: "GET" | "POST";
    params?: any;
  }) => {
    if (api.method == "GET") {
      return await sendGetRequest<T>(api.endpoint, api.params);
    } else {
      return await sendPostRequest<T>(api.endpoint, api.params!);
    }
  };
};
