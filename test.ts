import { apiKey, apiSecret, apiPass, projectID } from "./secret.json";
import { SDK } from "./src";

const client = SDK({
  apiKey,
  apiSecret,
  apiPass,
  projectID,
});

// console.log(
//   await client({
//     endpoint: "wallet/webhook/unsubscribe",
//     params: [{ id: "200207" }],
//   })
// );

// console.log(
//   await client({
//     endpoint: "wallet/webhook/subscribe",
//     params: [
//       {
//         type: "fee_fluctuation",
//         chainIndex: Chain.Ethereum,
//         url: "https://webhook.site/ff8fac2d-72df-40a4-ae39-6ee244657992",
//         name: "fee",
//         feeChangeFilter: {
//           minChange: 0.01
//         }
//       },
//     ],
//   })
// );


console.log(
  await client({
    endpoint: "wallet/webhook/subscribe",
    params: [{
      chainIndex: '1',
      url: "https://blockchain.metapoint.tech/okx",
       type: 'transaction'
    }]
  })
);

console.log(
  await client({
    endpoint: "wallet/webhook/subscriptions",
  }))


// console.log(
//   (await client({
//     endpoint: "wallet/account/accounts"
//   })).data.at(0).accounts
// )

console.log(
  (await client({
    endpoint: "wallet/account/account-detail",
    params: {
      accountId: "ecb312c2-e2ef-4dc2-9e35-d94bb0f2ad19"
    }
  })).data.at(0).addresses
)

// console.log(
//   await client({
//     endpoint: "wallet/account/create-wallet-account",
//     params: {
//       addresses: [
//         {
//           chainIndex: "1",
//           address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5"
//         }
//       ]
//     }
//   })
// )