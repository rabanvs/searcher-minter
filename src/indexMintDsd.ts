import { providers, Wallet } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
require("dotenv").config();

const CHAIN_ID = 1;
const provider = new providers.InfuraProvider(CHAIN_ID);

const FLASHBOTS_ENDPOINT = "https://relay.flashbots.net/";

if (process.env.WALLET_PRIVATE_KEY_DSD === undefined) {
  console.error("Please provide WALLET_PRIVATE_KEY env");
  process.exit(1);
}
const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY_DSD, provider);

// ethers.js can use Bignumber.js class OR the JavaScript-native bigint. I changed this to bigint as it is MUCH easier to deal with
const GWEI = 10n ** 9n;
const ETHER = 10n ** 18n;

const PRICE = 2n;
const AMOUNT = 3n;

const ADDRESS = "0x8Cd8155e1af6AD31dd9Eec2cEd37e04145aCFCb3";
const DATA =
  "0xf647a45a0000000000000000000000000000000000000000000000000000000000000003";

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
            value: (ETHER / 100n) * PRICE * AMOUNT,
            data: DATA,
            maxFeePerGas: 1150n * GWEI,
            maxPriorityFeePerGas: 1150n * GWEI,
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
