import { providers, Wallet } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import axios from "axios";
require("dotenv").config();

const CHAIN_ID = 1;
const provider = new providers.InfuraProvider(CHAIN_ID);

const FLASHBOTS_ENDPOINT = "https://relay.flashbots.net/";

if (process.env.PK_LMC1 === undefined) {
  console.error("Please provide WALLET_PRIVATE_KEY env");
  process.exit(1);
}
const wallet = new Wallet(process.env.PK_LMC1, provider);

const GWEI = 10n ** 9n;
const ETHER = 10n ** 18n;

let MAX_PRIORTY_FEE = 5000n * GWEI;
let MAX_FEE_GAS = 5000n * GWEI;
const GAS_LIMIT = 300000n;

const ADDRESS = "0x7d9d3659dcfbea08a87777c52020bc672deece13";
const DATA = "0x1249c58b";

async function main() {
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    Wallet.createRandom(),
    FLASHBOTS_ENDPOINT
  );
  provider.on("block", async (blockNumber) => {
    console.log("Block: ", blockNumber);

    const bundleSubmitResponse = await flashbotsProvider.sendBundle(
      [
        {
          transaction: {
            chainId: CHAIN_ID,
            type: 2,
            // value: ETHER * PRICE * AMOUNT,
            data: DATA,
            maxFeePerGas: MAX_FEE_GAS,
            maxPriorityFeePerGas: MAX_PRIORTY_FEE,
            gasLimit: GAS_LIMIT,
            to: ADDRESS,
          },
          signer: wallet,
        },
        {
          transaction: {
            chainId: CHAIN_ID,
            type: 2,
            // value: ETHER * PRICE * AMOUNT,
            data: DATA,
            maxFeePerGas: MAX_FEE_GAS,
            maxPriorityFeePerGas: MAX_PRIORTY_FEE,
            gasLimit: GAS_LIMIT,
            to: ADDRESS,
          },
          signer: wallet,
        },
        {
          transaction: {
            chainId: CHAIN_ID,
            type: 2,
            // value: ETHER * PRICE * AMOUNT,
            data: DATA,
            maxFeePerGas: MAX_FEE_GAS,
            maxPriorityFeePerGas: MAX_PRIORTY_FEE,
            gasLimit: GAS_LIMIT,
            to: ADDRESS,
          },
          signer: wallet,
        },
        {
          transaction: {
            chainId: CHAIN_ID,
            type: 2,
            // value: ETHER * PRICE * AMOUNT,
            data: DATA,
            maxFeePerGas: MAX_FEE_GAS,
            maxPriorityFeePerGas: MAX_PRIORTY_FEE,
            gasLimit: GAS_LIMIT,
            to: ADDRESS,
          },
          signer: wallet,
        },
      ],
      blockNumber + 1
    );

    // By exiting this function (via return) when the type is detected as a "RelayResponseError", TypeScript recognizes bundleSubmitResponse must be a success type object (FlashbotsTransactionResponse) after the if block.
    if ("error" in bundleSubmitResponse) {
      console.warn(bundleSubmitResponse.error.message);
      return;
    }

    console.log(await bundleSubmitResponse.simulate());
  });
}

main();
