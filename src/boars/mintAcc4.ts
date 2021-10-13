import { providers, Wallet } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
require("dotenv").config();

const CHAIN_ID = 1;
const provider = new providers.InfuraProvider(CHAIN_ID);

const FLASHBOTS_ENDPOINT = "https://relay.flashbots.net/";

if (process.env.PK_LMC4 === undefined) {
  console.error("Please provide WALLET_PRIVATE_KEY env");
  process.exit(1);
}
const wallet = new Wallet(process.env.PK_LMC4, provider);

// ethers.js can use Bignumber.js class OR the JavaScript-native bigint. I changed this to bigint as it is MUCH easier to deal with
const GWEI = 10n ** 9n;
const ETHER = 10n ** 18n;

const PRICE = 40n;
const AMOUNT = 10n;
const GAS_LIMIT = 240n;

const ADDRESS = "0xA66CC78067fd1E6Aa3eEC4CcdFF88D81527F92c1";
const DATA =
  "0xb1d1c535000000000000000000000000000000000000000000000000000000000000000a";

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
            value: (ETHER / 1000n) * PRICE * AMOUNT,
            data: DATA,
            maxFeePerGas: GAS_LIMIT * GWEI,
            maxPriorityFeePerGas: GAS_LIMIT * GWEI,
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
