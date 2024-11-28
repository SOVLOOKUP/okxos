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
    endpoint: "wallet/webhook/subscriptions",
  })
);
