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
  'wallet/webhook/subscriptions',
  'wallet/asset/token-balances-by-address',
  'wallet/asset/total-value-by-address',
  'wallet/utxo/utxos',
  'wallet/utxo/utxo-detail',
  'wallet/asset/all-token-balances-by-address',
  'wallet/security/approvals',
  'wallet/asset/total-value',
  'wallet/asset/wallet-all-token-balances',
  'wallet/post-transaction/transactions',
  'wallet/asset/token-balances',
  'wallet/post-transaction/transaction-detail-by-txhash',
  'wallet/post-transaction/transactions-by-address',
  'wallet/post-transaction/inscription-transaction-detail-by-txhash',
  'wallet/token/current-price',
  'wallet/asset/token-balances',
  'wallet/post-transaction/transaction-detail-by-txhash',
  'wallet/post-transaction/transactions-by-address',
  'wallet/post-transaction/inscription-transaction-detail-by-txhash',
  'wallet/token/current-price',
  'wallet/post-transaction/transaction-detail-by-txhash',
  'wallet/post-transaction/transactions-by-address',
  'wallet/post-transaction/inscription-transaction-detail-by-txhash',
  'wallet/token/current-price',
  'wallet/post-transaction/transactions-by-address',
  'wallet/post-transaction/inscription-transaction-detail-by-txhash',
  'wallet/token/current-price',
  'wallet/token/historical-price',
  'wallet/token/token-detail',
  'wallet/post-transaction/inscription-transaction-detail-by-txhash',
  'wallet/token/current-price',
  'wallet/token/historical-price',
  'wallet/token/token-detail',
  'wallet/token/current-price',
  'wallet/token/historical-price',
  'wallet/token/token-detail',
  'wallet/token/historical-price',
  'wallet/token/token-detail',
  'wallet/chain/supported-chains',
  'wallet/chain/supported-chains',
  'wallet/webhook/subscribe',
  'wallet/webhook/unsubscribe'
  'wallet/webhook/unsubscribe'
]
```