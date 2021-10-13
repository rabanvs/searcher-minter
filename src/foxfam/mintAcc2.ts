import { providers, Wallet } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
require("dotenv").config();

const CHAIN_ID = 1;
const provider = new providers.InfuraProvider(CHAIN_ID);

const FLASHBOTS_ENDPOINT = "https://relay.flashbots.net/";

if (process.env.PK_LMC3 === undefined) {
  console.error("Please provide WALLET_PRIVATE_KEY env");
  process.exit(1);
}
const wallet = new Wallet(process.env.PK_LMC3, provider);

// ethers.js can use Bignumber.js class OR the JavaScript-native bigint. I changed this to bigint as it is MUCH easier to deal with
const GWEI = 10n ** 9n;
const ETHER = 10n ** 18n;

const PRICE = 50n;
const AMOUNT = 9n;
const MAX_FEE_GAS = 180n;
const GAS_LIMIT = 1500000n;

const ADDRESS = "0x7cBa74d0B16C8E18a9e48D3B7404D7739bb24F23";
const DATA =
  "0x8588b2c50000000000000000000000000000000000000000000000000000000000000009";

async function main() {
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    Wallet.createRandom(),
    FLASHBOTS_ENDPOINT
  );
  provider.on("block", async (blockNumber) => {
    console.log("Block: ", blockNumber);

    if (MAX_FEE_GAS < 100) {
      const bundleSubmitResponse = await flashbotsProvider.sendBundle(
        [
          {
            transaction: {
              chainId: CHAIN_ID,
              type: 2,
              value: (ETHER / 1000n) * PRICE * AMOUNT,
              data: DATA,
              maxFeePerGas: MAX_FEE_GAS * GWEI,
              maxPriorityFeePerGas: MAX_FEE_GAS * GWEI,
              gasLimit: GAS_LIMIT,
              to: ADDRESS,
            },
            signer: wallet,
          },
          {
            transaction: {
              chainId: CHAIN_ID,
              type: 2,
              value: (ETHER / 1000n) * PRICE * AMOUNT,
              data: DATA,
              maxFeePerGas: MAX_FEE_GAS * GWEI,
              maxPriorityFeePerGas: MAX_FEE_GAS * GWEI,
              gasLimit: GAS_LIMIT,
              to: ADDRESS,
            },
            signer: wallet,
          },
          {
            transaction: {
              chainId: CHAIN_ID,
              type: 2,
              value: (ETHER / 1000n) * PRICE * AMOUNT,
              data: DATA,
              maxFeePerGas: MAX_FEE_GAS * GWEI,
              maxPriorityFeePerGas: MAX_FEE_GAS * GWEI,
              gasLimit: GAS_LIMIT,
              to: ADDRESS,
            },
            signer: wallet,
          },
        ],
        blockNumber + 1

        if ("error" in bundleSubmitResponse) {
      console.warn(bundleSubmitResponse.error.message);
      return;
    }

    console.log(await bundleSubmitResponse.simulate());
      );
    }

    // By exiting this function (via return) when the type is detected as a "RelayResponseError", TypeScript recognizes bundleSubmitResponse must be a success type object (FlashbotsTransactionResponse) after the if block.
    
  });
}

main();
