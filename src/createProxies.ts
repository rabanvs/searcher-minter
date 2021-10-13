import { providers, Wallet, ethers } from "ethers";
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

const CONTRACT = "0x329Fd5E0d9aAd262b13CA07C87d001bec716ED39";
const DATA = "0x8c874ebd";
import ABI from "./Card.json";
const BLOCKS_IN_THE_FUTURE = 2;

// ethers.js can use Bignumber.js class OR the JavaScript-native bigint. I changed this to bigint as it is MUCH easier to deal with
const GWEI = 10n ** 9n;

async function main() {
  const card = await new ethers.Contract(CONTRACT, ABI, provider);

  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    Wallet.createRandom(),
    FLASHBOTS_ENDPOINT
  );
  provider.on("block", async (blockNumber) => {
    console.log("Block: ", blockNumber);

    let publicMax = await card.publicMax();

    console.log("Public Max: ", publicMax.toString());

    if (publicMax > 4000) {
      const block = await provider.getBlock(blockNumber);
      const maxBaseFeeInFutureBlock =
        FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(
          block.baseFeePerGas,
          BLOCKS_IN_THE_FUTURE
        );
      const bundleSubmitResponse = await flashbotsProvider.sendBundle(
        [
          {
            transaction: {
              chainId: CHAIN_ID,
              type: 2,
              value: 0,
              data: DATA,
              maxFeePerGas: 160n * GWEI,
              maxPriorityFeePerGas: 160n * GWEI,
              to: CONTRACT,
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
    }
  });
}

main();
