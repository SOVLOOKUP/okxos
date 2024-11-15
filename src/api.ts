import { z } from "zod";

// chains ==========================================================================================================

// https://www.okx.com/web3/build/docs/waas/walletapi-resources-supported-networks
export enum Chain {
  "BTC" = 0,
  "Ethereum" = 1,
  "Litecoin" = 2,
  "Dogecoin" = 3,
  "Dash" = 5,
  "Optimism" = 10,
  "Flare" = 14,
  "Cronos" = 25,
  "BNB Smart Chain" = 56,
  "Ethereum Classic" = 61,
  "OKTC" = 66,
  "Gnosis" = 100,
  "Polygon" = 137,
  "Bitcoin Cash" = 145,
  "Manta Pacific" = 169,
  "Tron" = 195,
  "X layer" = 196,
  "opBNB" = 204,
  "B^2 network" = 223,
  "Fantom" = 250,
  "Kroma" = 255,
  "KCC" = 321,
  "zkSync Era" = 324,
  "PulseChain" = 369,
  "Omega Network" = 408,
  "Endurance" = 648,
  "Conflux" = 1030,
  "Metis" = 1088,
  "Polygon zkEVM" = 1101,
  "Core" = 1116,
  "Moonbeam" = 1284,
  "Moonriver" = 1285,
  "Ronin" = 2020,
  "Rangers" = 2025,
  "Kava EVM" = 2222,
  "Merlin Chain" = 4200,
  "Mantle" = 5000,
  "Base" = 8453,
  "Immutable zkEVM" = 13371,
  "MODE_ETH" = 34443,
  "Arbitrum One" = 42161,
  "Arbitrum Nova" = 42170,
  "Celo" = 42220,
  "Avalanche C" = 43114,
  "Linea" = 59144,
  "Kaia network (Klaytn)" = 8217,
  "Blast" = 81457,
  "Chilizi" = 88888,
  "EthereumPoW" = 10001,
  "TAIKO_ETH" = 167000,
  "BITLAYER_BTC" = 200901,
  "Ethereum Fair(DIS chain)" = 513100,
  "BOB_ETH" = 60808,
  "Scroll" = 534352,
  "Sepolia" = 11155111,
  "Fractal Bitcoin Mainnet" = 70000061,
  "Solana" = 501,
  "SUI" = 784,
}

// https://www.okx.com/web3/build/docs/waas/walletapi-api-get-supported-blockchain
const SupportedChains = z.object({
  endpoint: z.literal("wallet/chain/supported-chains"),
  method: z.literal("GET"),
  params: z.undefined().optional(),
  response: z.array(
    z.object({
      name: z.string(),
      logoUrl: z.string(),
      shortName: z.string(),
      chainIndex: z.nativeEnum(Chain),
    })
  ),
});

// webhook ==========================================================================================================

const webhookDetail = z.object({
  url: z.string().url(),
  type: z.enum(["transaction", "block", "token_issuance", "fee_fluctuation"]),
  chainIndex: z.nativeEnum(Chain),
  name: z.string().optional(),
  feeChangeFilter: z
    .object({
      minChange: z.number().min(0.01).max(100),
      maxChange: z.number().min(0.01).max(100).optional(),
    })
    .optional(),
});

const webhookId = z.object({
  id: z.string(),
});

// https://www.okx.com/web3/build/docs/waas/walletapi-api-webhook-subscribe
const WebhookSub = z.object({
  endpoint: z.literal("wallet/webhook/subscribe"),
  method: z.literal("POST"),
  params: z.array(webhookDetail).min(1).max(20),
  response: z.array(webhookId),
});

// https://www.okx.com/web3/build/docs/waas/walletapi-api-webhook-unsubscribe
const WebhookUnsub = z.object({
  endpoint: z.literal("wallet/webhook/unsubscribe"),
  method: z.literal("GET"),
  params: z.array(webhookId).min(1).max(20),
  response: z.array(webhookId),
});

// https://www.okx.com/web3/build/docs/waas/walletapi-api-webhook-get-subscriptions
const WebhookQuerySub = z.object({
  endpoint: z.literal("wallet/webhook/subscriptions"),
  method: z.literal("GET"),
  params: z.undefined().optional(),
  response: z.array(webhookDetail),
});

// ==========================================================================================================
const all = [SupportedChains, WebhookSub, WebhookUnsub, WebhookQuerySub];

const allInput = all.map((i) => i.pick({ endpoint: true, params: true }));
export const api = z.discriminatedUnion("endpoint", [all.pop()!, ...all]);
export const apiInput = z.discriminatedUnion("endpoint", [
  allInput.pop()!,
  ...allInput,
]);
