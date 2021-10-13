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

const BN_URL = "https://api.blocknative.com/gasprices/blockprices";

const options = {
  headers: {
    Authorization: process.env.BLOCKNATIVE_API_KEY,
  },
};

async function gas() {
  const data = await axios.get(BN_URL, {
    headers: { Authorization: process.env.BLOCKNATIVE_API_KEY },
  });

  var gasFees = data.data.blockPrices[0].estimatedPrices[0];
  MAX_FEE_GAS = BigInt(parseInt(gasFees.maxFeePerGas)) * GWEI;
  MAX_PRIORTY_FEE = BigInt(parseInt(gasFees.maxPriorityFeePerGas)) * GWEI;

  console.log("MaxFee: ", MAX_FEE_GAS);
  console.log("PriorityFee: ", MAX_PRIORTY_FEE);
}

const GWEI = 10n ** 9n;
const ETHER = 10n ** 18n;

const PRICE = 6666n / 100000n;
const AMOUNT = 10n;
let MAX_PRIORTY_FEE;
let MAX_FEE_GAS;
const GAS_LIMIT = 1800000n;

const ADDRESS = "0x1685133a98E1D4fC1fe8e25b7493D186c37B6B24";
const DATA =
  "0xa0712d68000000000000000000000000000000000000000000000000000000000000000a";

async function main() {
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    Wallet.createRandom(),
    FLASHBOTS_ENDPOINT
  );
  provider.on("block", async (blockNumber) => {
    console.log("Block: ", blockNumber);

    const data = await axios.get(BN_URL, {
      headers: { Authorization: process.env.BLOCKNATIVE_API_KEY },
    });

    var gasFees = data.data.blockPrices[0].estimatedPrices[0];
    MAX_FEE_GAS = BigInt(parseInt(gasFees.maxFeePerGas)) * GWEI;
    MAX_PRIORTY_FEE = BigInt(parseInt(gasFees.maxPriorityFeePerGas)) * GWEI;

    console.log("MaxFee: ", MAX_FEE_GAS);
    console.log("PriorityFee: ", MAX_PRIORTY_FEE);

    const bundleSubmitResponse = await flashbotsProvider.sendBundle(
      [
        {
          transaction: {
            chainId: CHAIN_ID,
            type: 2,
            value: ETHER * PRICE * AMOUNT,
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
            value: ETHER * PRICE * AMOUNT,
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
            value: ETHER * PRICE * AMOUNT,
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
