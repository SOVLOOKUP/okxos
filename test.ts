import { apiKey, apiSecret, apiPass, projectID } from "./secret.json";
import { SDK } from "./src";

const client = SDK({
  apiKey,
  apiSecret,
  apiPass,
  projectID,
});

console.log(
  await client({
    endpoint: "wallet/chain/supported-chains",
  })
);

console.log(
  await client({
    endpoint: "wallet/webhook/subscriptions",
  })
);
