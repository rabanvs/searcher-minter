const { ethers } = require("hardhat");

async function main() {
  [owner] = await ethers.getSigners();

  let overrides = {
    gasPrice: 75000000000,
  };

  const BatchCaller = await ethers.getContractFactory("BatchCaller");
  const batchCaller = await BatchCaller.deploy();

  console.log({ batchCallerAddress: batchCaller.address });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
