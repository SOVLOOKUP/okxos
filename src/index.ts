import { z } from "zod";
import { Chain, api, apiInput } from "./api";
import { APIConfig, OKXClient } from "./client";
export { Chain };
const em: { [key: string]: "GET" | "POST" } = {};

api._def.options.map((i) => {
  const zt = i._def.shape();
  em[zt.endpoint._def.value] = zt.method._def.value;
});

type APIWithRes = z.infer<typeof api>;
type API = z.infer<typeof apiInput>;
type GetRes<T extends API["endpoint"]> = (APIWithRes & {
  endpoint: T;
})["response"];

export const SDK = (apiConfig: APIConfig) => {
  const client = OKXClient(apiConfig);

  return async <I extends API>(input: I) => {
    const { endpoint, params } = apiInput.parse(input);
    return await client<GetRes<I["endpoint"]>>({
      endpoint,
      params,
      method: em[input.endpoint],
    });
  };
};
