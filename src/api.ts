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

// token ==========================================================================================================
const TokenAddress = z
  .enum(["", "FBRC-20", "BRC-20", "Runes", "SRC-20"])
  .or(z.string());

// https://www.okx.com/web3/build/docs/waas/walletapi-api-get-current-pricelist
const CurrentPrice = z.object({
  endpoint: z.literal("wallet/token/current-price"),
  method: z.literal("POST"),
  params: z
    .array(
      z.object({
        chainIndex: z.nativeEnum(Chain),
        tokenAddress: TokenAddress,
      })
    )
    .min(1)
    .max(100),
  response: z.array(
    z.object({
      price: z.string(),
      time: z.string(),
      chainIndex: z.nativeEnum(Chain),
      tokenAddress: TokenAddress,
    })
  ),
});

// https://www.okx.com/web3/build/docs/waas/walletapi-api-token-detail
const TokenDetail = z.object({
  endpoint: z.literal("wallet/token/token-detail"),
  method: z.literal("GET"),
  params: z.object({
    chainIndex: z.nativeEnum(Chain),
    tokenAddress: TokenAddress,
  }),
  response: z.array(
    z.object({
      logoUrl: z.string().url(),
      officialWebsite: z.string().url(),
      tokenAddress: TokenAddress,
      chainIndex: z.nativeEnum(Chain),
      chainName: z.string(),
      symbol: z.string(),
      maxSupply: z.string(),
      totalSupply: z.string(),
      volume24h: z.string(),
      marketCap: z.string(),
      socialUrls: z.object({
        twitter: z.array(z.string().url()).optional(),
        facebook: z.array(z.string().url()).optional(),
        reddit: z.array(z.string().url()).optional(),
        messageboard: z.array(z.string().url()).optional(),
        chat: z.array(z.string().url()).optional(),
        github: z.array(z.string().url()).optional(),
        whitepaper: z.array(z.string().url()).optional(),
        announcement: z.array(z.string().url()).optional(),
      }),
    })
  ),
});

// https://www.okx.com/web3/build/docs/waas/walletapi-api-get-historical-price
const HistoricalPrice = z.object({
  endpoint: z.literal("wallet/token/historical-price"),
  method: z.literal("GET"),
  params: z.object({
    chainIndex: z.nativeEnum(Chain),
    tokenAddress: TokenAddress.optional(),
    limit: z.number().max(200).optional(),
    cursor: z.number().optional(),
    begin: z.string().optional(),
    end: z.string().optional(),
    period: z.enum(["1m", "5m", "30m", "1h", "1d"]).optional(),
  }),
  response: z.object({
    cursor: z.string(),
    prices: z.array(
      z.object({
        price: z.string(),
        time: z.string(),
      })
    ),
  }),
});

// address value ==========================================================================================================

// https://www.okx.com/web3/build/docs/waas/walletapi-api-specific-token-balance-by-address
const AddressTokenBalances = z.object({
  endpoint: z.literal("wallet/asset/token-balances-by-address"),
  method: z.literal("POST"),
  params: z.object({
    address: z.string(),
    tokenAddresses: z.array(
      z.object({
        chainIndex: z.nativeEnum(Chain),
        tokenAddress: TokenAddress,
      })
    ),
    filter: z.enum(["0", "1"]).optional(),
  }),
  response: z
    .array(
      z.object({
        tokenAssets: z.array(
          z.object({
            chainIndex: z.nativeEnum(Chain),
            tokenAddress: TokenAddress,
            symbol: z.string(),
            balance: z.string(),
            tokenPrice: z.string(),
            tokenType: z.enum(["1", "2"]),
            transferAmount: z.string(),
            availableAmount: z.string(),
            isRiskToken: z.boolean(),
          })
        ),
      })
    )
    .length(1),
});

// https://www.okx.com/web3/build/docs/waas/walletapi-api-total-token-value-address
const AddressTotalValue = z.object({
  endpoint: z.literal("wallet/asset/total-value-by-address"),
  method: z.literal("GET"),
  params: z.object({
    address: z.string(),
    chains: z.string(),
    assetType: z.enum(["0", "1", "2"]).optional(),
    excludeRiskToken: z.boolean().optional(),
  }),
  response: z
    .array(
      z.object({
        totalValue: z.string(),
      })
    )
    .length(1),
});

// https://www.okx.com/web3/build/docs/waas/walletapi-api-utxos
const Utxos = z.object({
  endpoint: z.literal("wallet/utxo/utxos"),
  method: z.literal("GET"),
  params: z.object({
    address: z.string(),
    chainIndex: z.nativeEnum(Chain),
    cursor: z.string().optional(),
    limit: z.number().max(100).optional(),
  }),
  response: z
    .array(
      z.object({
        cursor: z.string(),
        utxos: z.array(
          z.object({
            txHash: z.string(),
            voutIndex: z.string(),
            amount: z.string(),
            spendStatus: z.enum(["1", "2"]),
          })
        ),
      })
    )
    .length(1),
});

// https://www.okx.com/web3/build/docs/waas/walletapi-api-utxo-detail
const UtxosDetail = z.object({
  endpoint: z.literal("wallet/utxo/utxo-detail"),
  method: z.literal("GET"),
  params: z.object({
    txHash: z.string(),
    chainIndex: z.nativeEnum(Chain),
    voutIndex: z.string(),
  }),
  response: z
    .array(
      z.object({
        cursor: z.string(),
        utxos: z.array(
          z.object({
            address: z.string(),
            txhash: z.string(),
            voutIndex: z.string(),
            unresolved: z.array(z.any()),
            utxoStatus: z.enum(["pending", "confrimed", "Not found"]),
            btcAssets: z.array(
              z.object({
                protocol: z.enum(["1", "2", "3", "4", "5"]),
                tokenAmount: z.string(),
                eventType: z.string(),
                decimal: z.string(),
                symbol: z.string(),
                inscriptionNumber: z.string(),
                nftId: z.string(),
                nftOffset: z.string(),
              })
            ),
          })
        ),
      })
    )
    .length(1),
});

// https://www.okx.com/web3/build/docs/waas/walletapi-api-all-token-balances-by-address
const AddressAllToken = z.object({
  endpoint: z.literal("wallet/asset/all-token-balances-by-address"),
  method: z.literal("GET"),
  params: z.object({
    address: z.string(),
    chains: z.string(),
    filter: z.enum(["0", "1"]).optional(),
  }),
  response: z
    .array(
      z.object({
        tokenAssets: z.array(
          z.object({
            chainIndex: z.nativeEnum(Chain),
            tokenAddress: z.string(),
            symbol: z.string(),
            balance: z.string(),
            tokenPrice: z.string(),
            tokenType: z.enum(["1", "2"]),
            transferAmount: z.string(),
            availableAmount: z.string(),
            isRiskToken: z.boolean(),
          })
        ),
      })
    )
    .length(1),
});

// https://www.okx.com/web3/build/docs/waas/walletapi-api-get-approval-detail
const Approvals = z.object({
  endpoint: z.literal("wallet/security/approvals"),
  method: z.literal("POST"),
  params: z.object({
    addresses: z
      .array(
        z.object({
          chainIndex: z.nativeEnum(Chain),
          address: z.string(),
        })
      )
      .max(20),
    limit: z.string().optional(),
    cursor: z.string().optional(),
  }),
  response: z
    .array(
      z.object({
        chainIndex: z.nativeEnum(Chain),
        cursor: z.string(),
        approvalProjects: z.array(
          z.object({
            projectName: z.string(),
            projectIcon: z.string().url(),
            approveAddress: z.string(),
            tokens: z.array(
              z.object({
                imageUrl: z.string().url(),
                symbol: z.string(),
                tokenAddress: z.string(),
                approvalNum: z.string(),
                status: z.enum(["1", "2", "3"]),
              })
            ),
          })
        ),
      })
    )
    .length(1),
});

// account value ==========================================================================================================

// https://www.okx.com/web3/build/docs/waas/walletapi-api-total-token-value-account
const TotalValue = z.object({
  endpoint: z.literal("wallet/asset/total-value"),
  method: z.literal("GET"),
  params: z.object({
    accountId: z.string(),
    chains: z.string().optional(),
    assetType: z.enum(["0", "1", "2"]).optional(),
    excludeRiskToken: z.boolean().optional(),
  }),
  response: z
    .array(
      z.object({
        totalValue: z.string(),
      })
    )
    .length(1),
});

// https://www.okx.com/web3/build/docs/waas/walletapi-api-wallet-all-token-balances
const WalletAllToken = z.object({
  endpoint: z.literal("wallet/asset/wallet-all-token-balances"),
  method: z.literal("GET"),
  params: z.object({
    accountId: z.string(),
    chains: z.string().optional(),
    filter: z.enum(["0", "1"]).optional(),
  }),
  response: z
    .array(
      z.object({
        timeStamp: z.string(),
        tokenAssets: z.array(
          z.object({
            chainIndex: z.nativeEnum(Chain),
            tokenAddress: TokenAddress,
            address: z.string(),
            symbol: z.string(),
            balance: z.string(),
            tokenPrice: z.string(),
            tokenType: z.enum(["1", "2"]),
            isRiskToken: z.boolean(),
          })
        ),
      })
    )
    .length(1),
});

// https://www.okx.com/web3/build/docs/waas/walletapi-api-token-balances
const TokenBalances = z.object({
  endpoint: z.literal("wallet/asset/token-balances"),
  method: z.literal("POST"),
  params: z.object({
    accountId: z.string(),
    tokenAddresses: z.array(
      z.object({
        chainIndex: z.nativeEnum(Chain),
        tokenAddress: TokenAddress,
      })
    ),
  }),
  response: z
    .array(
      z.object({
        tokenAssets: z.array(
          z.object({
            chainIndex: z.nativeEnum(Chain),
            tokenAddress: TokenAddress,
            symbol: z.string(),
            balance: z.string(),
            tokenPrice: z.string(),
            tokenType: z.enum(["1", "2"]),
            isRiskToken: z.boolean(),
          })
        ),
      })
    )
    .length(1),
});

// tx history ==========================================================================================================
// https://www.okx.com/zh-hans/web3/build/docs/waas/walletapi-api-transactions-by-address
const AddressTransactions = z.object({
  endpoint: z.literal("wallet/post-transaction/transactions-by-address"),
  method: z.literal("GET"),
  params: z.object({
    address: z.string(),
    chains: z.string(),
    begin: z.string().optional(),
    end: z.string().optional(),
    cursor: z.string().optional(),
    limit: z.number().max(20).optional(),
  }),
  response: z
    .array(
      z.object({
        cursor: z.string(),
        transactionList: z.array(
          z.object({
            chainIndex: z.nativeEnum(Chain),
            txHash: z.string(),
            iType: z.enum(["1", "0", "2"]),
            methodId: z.string(),
            nonce: z.string(),
            txTime: z.string(),
            from: z.array(
              z.object({
                address: z.string(),
                amount: z.string(),
              })
            ),
            to: z.array(
              z.object({
                address: z.string(),
                amount: z.string(),
              })
            ),
            tokenAddress: z.string(),
            amount: z.string(),
            symbol: z.string(),
            txFee: z.string(),
            tag: z.string(),
            txStatus: z.enum(["success", "fail", "pending"]),
            hitBlacklist: z.boolean(),
          })
        ),
      })
    )
    .length(1),
});

// https://www.okx.com/zh-hans/web3/build/docs/waas/walletapi-api-transaction-list
const Transactions = z.object({
  endpoint: z.literal("wallet/post-transaction/transactions"),
  method: z.literal("GET"),
  params: z.object({
    accountId: z.string(),
    chainIndex: z.nativeEnum(Chain).optional(),
    tokenAddress: TokenAddress.optional(),
    limit: z.number().max(200).optional(),
    cursor: z.number().optional(),
    begin: z.string().optional(),
    end: z.string().optional(),
  }),
  response: z
    .array(
      z.object({
        cursor: z.string(),
        transactionList: z.array(
          z.object({
            chainIndex: z.nativeEnum(Chain),
            txHash: z.string(),
            iType: z.enum(["1", "0", "2"]),
            methodId: z.string(),
            nonce: z.string(),
            txTime: z.string(),
            from: z.array(
              z.object({
                address: z.string(),
                amount: z.string(),
              })
            ),
            to: z.array(
              z.object({
                address: z.string(),
                amount: z.string(),
              })
            ),
            tokenAddress: z.string(),
            amount: z.string(),
            symbol: z.string(),
            txFee: z.string(),
            tag: z.string(),
            txStatus: z.enum(["success", "fail", "pending"]),
            hitBlacklist: z.boolean(),
          })
        ),
      })
    )
    .length(1),
});

// https://www.okx.com/zh-hans/web3/build/docs/waas/walletapi-api-transaction-detail-by-txhash
const TransactionsDetail = z.object({
  endpoint: z.literal("wallet/post-transaction/transaction-detail-by-txhash"),
  method: z.literal("GET"),
  params: z.object({
    chainIndex: z.nativeEnum(Chain),
    txHash: z.string(),
    iType: z.enum(["0", "1", "2"]).optional(),
  }),
  response: z
    .array(
      z.object({
        cursor: z.string(),
        transactionList: z.array(
          z.object({
            chainIndex: z.nativeEnum(Chain),
            height: z.string(),
            txTime: z.string(),
            txHash: z.string(),
            txStatus: z.enum(["success", "fail", "pending"]),
            gasLimit: z.string(),
            gasUsed: z.string(),
            gasPrice: z.string(),
            nonce: z.string(),
            amount: z.string(),
            symbol: z.string(),
            methodId: z.string(),
            fromDetails: z.array(
              z.object({
                address: z.string(),
                vinIndex: z.string(),
                preVoutIndex: z.string(),
                txhash: z.string(),
                isContract: z.boolean(),
                amount: z.string(),
              })
            ),
            toDetails: z.array(
              z.object({
                address: z.string(),
                voutIndex: z.string(),
                isContract: z.boolean(),
                amount: z.string(),
              })
            ),
            internalTransactionDetails: z.array(
              z.object({
                from: z.string(),
                to: z.string(),
                isFromContract: z.boolean(),
                isToContract: z.boolean(),
                amount: z.string(),
                txStatus: z.string(),
              })
            ),
            tokenTransferDetails: z.array(
              z.object({
                from: z.string(),
                to: z.string(),
                isFromContract: z.boolean(),
                isToContract: z.boolean(),
                tokenContractAddress: z.string(),
                symbol: z.string(),
                amount: z.string(),
              })
            ),
            l1OriginHash: z.string(),
          })
        ),
      })
    )
    .length(1),
});

// https://www.okx.com/zh-hans/web3/build/docs/waas/walletapi-api-inscription-transaction-detail-by-txhash
const InscriptionTransactionsDetail = z.object({
  endpoint: z.literal(
    "wallet/post-transaction/inscription-transaction-detail-by-txhash"
  ),
  method: z.literal("GET"),
  params: z.object({
    txHash: z.string(),
    chainIndex: z.nativeEnum(Chain).optional(),
    protocol: z.enum(["1", "2", "3", "4", "5"]).optional(),
    limit: z.number().max(100).optional(),
    cursor: z.number().optional(),
  }),
  response: z
    .array(
      z.object({
        cursor: z.string(),
        transactionDetails: z.array(
          z.object({
            txStatus: z.enum(["success", "fail"]),
            from: z.string(),
            to: z.string(),
            eventType: z.string(),
            protocol: z.string(),
            txHash: z.string(),
            blockHash: z.string(),
            height: z.string(),
            txTime: z.string(),
            amount: z.string(),
            symbol: z.string(),
            tokenInscriptionId: z.string(),
            inscriptionNumber: z.string(),
            outputIndex: z.string(),
          })
        ),
      })
    )
    .length(1),
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
// todo https://www.okx.com/zh-hans/web3/build/docs/waas/walletapi-api-intro-account-api
// todo https://www.okx.com/zh-hans/web3/build/docs/waas/walletapi-api-intro-transaction-api
const all = [
  AddressTokenBalances,
  AddressTotalValue,
  Utxos,
  UtxosDetail,
  AddressAllToken,
  Approvals,
  TotalValue,
  WalletAllToken,
  Transactions,
  TokenBalances,
  TransactionsDetail,
  AddressTransactions,
  InscriptionTransactionsDetail,
  CurrentPrice,
  HistoricalPrice,
  TokenDetail,
  SupportedChains,
  WebhookSub,
  WebhookUnsub,
  WebhookQuerySub,
];

const allInput = all.map((i) => i.pick({ endpoint: true, params: true }));
export const api = z.discriminatedUnion("endpoint", [all.pop()!, ...all]);
export const apiInput = z.discriminatedUnion("endpoint", [
  allInput.pop()!,
  ...allInput,
]);
