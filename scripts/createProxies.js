const { ethers } = require("hardhat");

async function main() {
  [owner] = await ethers.getSigners();

  let overrides = {
    gasPrice: 65000000000,
  };

  const CreateProxies = await ethers.getContractFactory("CreateProxies");
  const createProxies = await CreateProxies.attach(
    "0x5ce169ccc1815c09c953db783dd423ec95c6b064"
  );

  await createProxies.createProxies(10);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
