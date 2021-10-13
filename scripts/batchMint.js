const { ethers } = require("hardhat");

async function main() {
  [owner] = await ethers.getSigners();

  let overrides = {
    gasPrice: 200000000000,
  };

  const CreateProxies = await ethers.getContractFactory("CreateProxies");
  const createProxies = await CreateProxies.attach(
    "0x5ce169ccc1815c09c953db783dd423ec95c6b064"
  );

  const proxyArr = await createProxies.getProxies();

  const BatchCaller = await ethers.getContractFactory("BatchCaller");
  const batchCaller = await BatchCaller.attach(
    "0xAd52fc290D37dD663eFdCcfc668b8496f0DEB56F"
  );

  await batchCaller.batchMint(proxyArr, overrides);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
