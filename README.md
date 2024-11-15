# OKX OS SDK

Type Full OKX OS SDK

https://www.okx.com/zh-hans/web3/build/docs/waas/okx-waas-what-is-waas

## install

```
npm add okxos
```

## usage

```ts
import { apiKey, apiSecret, apiPass, projectID } from "./secret.json";
import { SDK } from "okxos";

const client = SDK({
  apiKey,
  apiSecret,
  apiPass,
  projectID,
});

await client({
  endpoint: "wallet/chain/supported-chains",
})
```