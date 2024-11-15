import { apiKey, apiSecret, apiPass, projectID } from "./secret.json";
import { Chain, SDK } from "./src";

const client = SDK({
  apiKey,
  apiSecret,
  apiPass,
  projectID,
});

// GET 请求示例
// console.log(
//   await client({
//     method: "POST",
//     endpoint: "wallet/account/create-wallet-account",
//     params: {
//       addresses: [
//         {
//           chainIndex: "1",
//           address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
//         }
//       ],
//     },
//   })
// );

// console.log(
//   JSON.stringify(
//     await client({
//       method: "GET",
//       endpoint: "wallet/account/accounts",
//     })
//   )
// );

// console.log(
//   await client({
//     method: "POST",
//     path: "wallet/webhook/subscribe",
//     params: [
//       {
//         chainIndex: "1",
//         url: "https://webhook.site/92ea85ff-03ed-417d-ab7d-52455ee85186",
//         type: 'transaction',
//       },
//     ],
//   })
// );
await client({
  endpoint: "wallet/webhook/subscribe",
  params: [
    {
      type: "transaction",
      chainIndex: Chain.SUI,
      url: "https://xxxxxx"
    }
  ],
});


// POST 请求示例
// console.log(
//   await client({
//     method: "POST",
//     path: "wallet/token/current-price",
//     params: [
//       {
//         chainIndex: "1",
//         tokenAddress: "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
//       },
//     ],
//   })
// );
