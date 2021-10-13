const { ethers } = require("hardhat");
const Web3 = require("web3");

async function main() {
  [owner] = await ethers.getSigners();

  let overrides = {
    gasPrice: 90000000000,
  };

  const Implementation = await ethers.getContractFactory("Implementation");
  const implementation = await Implementation.deploy(overrides);

  // // var provider = providers.getDefaultProvider();

  // const gasPrice = await owner.getGasPrice();
  // console.log(gasPrice.toString());
  // owner.getGasPrice().then(function (gasPrice) {
  //   gasPriceString = gasPrice.toString();
  //   console.log("Current gas price: " + gasPriceString);
  // });

  // console.log({ implementationAddress: implementation.address });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
