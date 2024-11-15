# OKX OS SDK

Type Full OKX OS SDK

https://www.okx.com/web3/build/docs/waas/okx-waas-what-is-waas

## Install

```
npm add okxos
```

## Usage

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

## Support Endpoints
```
[
  'wallet/asset/all-token-balances-by-address',
  'wallet/asset/token-balances',
  'wallet/asset/token-balances-by-address',
  'wallet/asset/total-value',
  'wallet/asset/total-value-by-address',
  'wallet/asset/wallet-all-token-balances',
  'wallet/chain/supported-chains',
  'wallet/post-transaction/inscription-transaction-detail-by-txhash',
  'wallet/post-transaction/transaction-detail-by-txhash',
  'wallet/post-transaction/transactions',
  'wallet/post-transaction/transactions-by-address',
  'wallet/security/approvals',
  'wallet/token/current-price',
  'wallet/token/historical-price',
  'wallet/token/token-detail',
  'wallet/utxo/utxo-detail',
  'wallet/utxo/utxos',
  'wallet/webhook/subscribe',
  'wallet/webhook/subscriptions',
  'wallet/webhook/unsubscribe'
]
```