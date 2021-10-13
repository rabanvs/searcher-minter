import { providers, Wallet, ethers } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
require("dotenv").config();
const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://eth-mainnet.alchemyapi.io/v2/kVXlidOVXmTr_wX4Y-1p4I1IaTm_4TF6"
  )
);

const CHAIN_ID = 1;
const provider = new providers.InfuraProvider(CHAIN_ID);

const FLASHBOTS_ENDPOINT = "https://relay.flashbots.net/";

if (process.env.WALLET_PRIVATE_KEY_DSD === undefined) {
  console.error("Please provide WALLET_PRIVATE_KEY env");
  process.exit(1);
}
const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY_DSD, provider);

// const CONTRACT = "0x329Fd5E0d9aAd262b13CA07C87d001bec716ED39";
const DATA =
  "0xd67b06c10000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000c0ba28a815d5d22dd27872734178d1637f2d4632000000000000000000000000024057bf6d0f450f2aa59946ea0ba6629d467bcc0000000000000000000000007fcabee04c1efa5ba6aae0492a32bf3186c931190000000000000000000000003d23e039e9c9f0d4a209ee34c5d81378bd32f007000000000000000000000000da70ca4c92fe7691389ef0ef7c37a7245fd39deb0000000000000000000000007271a284899960ac45b28341797122f2dd1228f2000000000000000000000000aae2d27c103c13808fc4c5089ce849a75f342e67000000000000000000000000ecb598a72854283716267fbc17db91d23bafbfa500000000000000000000000068ff2c74d7a36641ce82dbb1e404594187aa05f40000000000000000000000004d920806769b5f2af9b8c713f7c871d6246c7be3";
// import ABI from "../src/Card.json";
const BLOCKS_IN_THE_FUTURE = 2;

const CP_CONTRACT = "0x5cE169cCC1815C09c953dB783dd423ec95C6B064";

import CP_ABI from "../src/CreateProxies.json";

const BC_CONTRACT = "0xAd52fc290D37dD663eFdCcfc668b8496f0DEB56F";
const BC_ABI = "../src/BatchCaller.json";

const PROXY0_CONTRACT = "0xC0ba28A815D5D22DD27872734178d1637F2D4632";

// ethers.js can use Bignumber.js class OR the JavaScript-native bigint. I changed this to bigint as it is MUCH easier to deal with
const GWEI = 10n ** 9n;

async function main() {
  const createProxies = await new ethers.Contract(
    CP_CONTRACT,
    CP_ABI,
    provider
  );

  const proxyArr = await createProxies.getProxies();
  console.log(proxyArr);

  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    Wallet.createRandom(),
    FLASHBOTS_ENDPOINT
  );
  provider.on("block", async (blockNumber) => {
    console.log("Block: ", blockNumber);

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
            maxFeePerGas: 80n * GWEI,
            maxPriorityFeePerGas: 80n * GWEI,
            to: BC_CONTRACT,
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
