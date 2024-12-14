import { Wallet } from "ethers";

export const getToken = async (wallet: Wallet): Promise<string> => {
  const r = await fetch(
    `https://www.okx.com/priapi/v1/ak/address/verify?t=${Date.now()}`,
    {
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        address: wallet.address,
      }),
      method: "POST",
    }
  );

  const res = await r.json();
  const signData = res.data.signData;
  const signStamp = await wallet.signMessage(signData);

  const r2 = await fetch(
    `https://www.okx.com/priapi/v1/ak/address/login?t=${Date.now()}`,
    {
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        signStamp,
        address: wallet.address,
      }),
      method: "POST",
    }
  );
  const res2 = await r2.json();

  return res2.data.akToken;
};

export class OKXAdmin {
  wallet: Wallet;
  token: string;
  init = async (privateKey: string): Promise<OKXAdmin> => {
    this.wallet = new Wallet(privateKey);
    this.token = await getToken(this.wallet);
    return this;
  };

  projectList = async () => {
    const res = await fetch(
      `https://www.okx.com/priapi/v1/ak/apiKey/project/list?t=${Date.now()}`,
      {
        headers: {
          "content-type": "application/json",
          "X-Bu-Id": this.token,
        },
        body: JSON.stringify({
          address: this.wallet.address,
        }),
        method: "POST",
      }
    );
    const l = await res.json();
    return l.data as {
      id: number;
      projectName: string;
      projectCode: string;
      createAddress: string;
      createTime: number;
      updateTime: number;
      status: number;
      akCount: number;
      planType: number;
    }[];
  };

  addProject = async (projectName: string, projectDesc?: string) => {
    const res = await fetch(
      `https://www.okx.com/priapi/v1/ak/apiKey/project/add?t=${Date.now()}`,
      {
        headers: {
          "content-type": "application/json",
          "X-Bu-Id": this.token,
        },
        body: JSON.stringify({
          address: this.wallet.address,
          projectName,
          projectDesc,
        }),
        method: "POST",
      }
    );
    const l = await res.json();
    return l.data as {
      id: number;
      projectName: string;
      projectCode: string;
      projectDesc: string;
      createAddress: string;
      createTime: number;
      updateTime: number;
      createIp: string;
      countryCode: string;
    };
  };

  projectAPIKey = async (projectCode: string) => {
    const res = await fetch(
      `https://www.okx.com/priapi/v1/ak/apiKey/list?t=${Date.now()}`,
      {
        headers: {
          "content-type": "application/json",
          "X-Bu-Id": this.token,
        },
        body: JSON.stringify({
          address: this.wallet.address,
          projectCode,
        }),
        method: "POST",
      }
    );
    const l = await res.json();
    return l.data as {
      total: number;
      projectName: string;
      records: Array<{
        accessKeyName: string;
        accessKey: string;
      }>;
    };
  };

  createProjectAPIKey = async (
    projectCode: string,
    accessKeyName: string,
    passphrase: string
  ) => {
    const res = await fetch(
      `https://www.okx.com/priapi/v1/ak/apiKey/create?t=${Date.now()}`,
      {
        headers: {
          "content-type": "application/json",
          "X-Bu-Id": this.token,
        },
        body: JSON.stringify({
          address: this.wallet.address,
          accessKeyName,
          projectCode,
          passphrase,
          rePassphrase: passphrase,
        }),
        method: "POST",
      }
    );
    const l = await res.json();
    return l.data as {
      accessKeyName: string;
      accessKey: string;
      secretKey: string;
    };
  };

  deleteProjectAPIKey = async (accessKey: string, accessKeyName: string) => {
    const res = await fetch(
      `https://www.okx.com/priapi/v1/ak/apiKey/delete?t=${Date.now()}`,
      {
        headers: {
          "content-type": "application/json",
          "X-Bu-Id": this.token,
        },
        body: JSON.stringify({
          address: this.wallet.address,
          accessKey,
          accessKeyName,
        }),
        method: "POST",
      }
    );
    const l = await res.json();
    return l.data as boolean;
  };

  deleteProject = async (projectCode: string) => {
    const res = await fetch(
      `https://www.okx.com/priapi/v1/ak/apiKey/project/delete?t=${Date.now()}`,
      {
        headers: {
          "content-type": "application/json",
          "X-Bu-Id": this.token,
        },
        body: JSON.stringify({
          address: this.wallet.address,
          projectCode,
        }),
        method: "POST",
      }
    );
    const l = await res.json();
    return l.data as boolean;
  };
}

export const newOKXAdmin = async (privateKey: string) => {
  const admin = new OKXAdmin()
  return await admin.init(privateKey)
}