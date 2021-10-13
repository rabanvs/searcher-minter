import { providers, Wallet } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
require("dotenv").config();

const CHAIN_ID = 1;
const provider = new providers.InfuraProvider(CHAIN_ID);

const FLASHBOTS_ENDPOINT = "https://relay.flashbots.net/";

if (process.env.PK_LMC5 === undefined) {
  console.error("Please provide WALLET_PRIVATE_KEY env");
  process.exit(1);
}
const wallet = new Wallet(process.env.PK_LMC5, provider);

// ethers.js can use Bignumber.js class OR the JavaScript-native bigint. I changed this to bigint as it is MUCH easier to deal with
const GWEI = 10n ** 9n;
const ETHER = 10n ** 18n;

const PRICE = 75n;
const AMOUNT = 20n;
const MAX_FEE_GAS = 100n;
const GAS_LIMIT = 900000n;

const ADDRESS = "0x1C9C514bC1FC4548Db2B13702f6398EE5aE4BD05";
const DATA =
  "0x26c060690000000000000000000000000000000000000000000000000000000000000014";

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
            gasLimit: GAS_LIMIT,
            maxFeePerGas: MAX_FEE_GAS * GWEI,
            maxPriorityFeePerGas: MAX_FEE_GAS * GWEI,
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
