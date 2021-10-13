const { ethers } = require("hardhat");

async function main() {
  [owner] = await ethers.getSigners();

  let overrides = {
    gasPrice: 75000000000,
  };

  const CreateProxies = await ethers.getContractFactory("CreateProxies");
  const createProxies = await CreateProxies.deploy();

  console.log({ createProxiesAddress: createProxies.address });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
