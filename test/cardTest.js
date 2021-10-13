const { expect } = require("chai");
const { ethers } = require("hardhat");

const CARD_OWNER = "0xDc023310975A459cAe37D5609f48bAE77bC191dA";
const CARD_ADDRESS = "0x329Fd5E0d9aAd262b13CA07C87d001bec716ED39";
const RECIPIENT = "0xcA2dC2bfAe935ec2B7199F900a41A64Db04a619e";
const ALT_RECIPIENT = "0x2ffDFda4CB958A0eEa3040c0D18c17bAAF53D7B4";

const LMC = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const LMC_1 = "0xb6a4f494bb9435e5c342ce043e6d6061854f7591";

const AMOUNT = 10;

// Deployed addresses
const IMPLEMENTATION = "0x2a9C6cE0Ea851F07546f54c9D73e48FcC31f6BDF";
const CREATE_PROXIES = "0x5cE169cCC1815C09c953dB783dd423ec95C6B064";
const BATCH_CALLER = "0x7218b3D1514C06d067D7aDfDf880e95aFd5AE34a";

let card;
let proxyArr;
let lmcSigner;
let cardWithSigner;
let batchCallerWithSigner;

describe("Mint with test contracts", function () {
  it("Impersonates LonaMisa", async function () {
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [LMC_1],
    });
    await network.provider.send("hardhat_setBalance", [
      LMC_1,
      "0x100000000000000000",
    ]);
    lmcSigner = await ethers.provider.getSigner(LMC_1);
  });

  it("Deploys card", async function () {
    const Card = await ethers.getContractFactory("Card");
    card = await Card.deploy();
    await card.deployed();
    const cardWithSigner = await card.connect(lmcSigner);
  });

  it("Sets publicMax", async function () {
    await cardWithSigner.setPublicMax(5000);
    const publicMax = await card.publicMax();
    expect(publicMax).to.eq(new ethers.BigNumber.from(5000));
  });

  it("Deploys implementation", async function () {
    const Implementation = await ethers.getContractFactory("Implementation");
    const implementation = await Implementation.deploy();
    await implementation.deployed();
  });

  it("Deploys Proxies", async function () {
    const CreateProxies = await ethers.getContractFactory("CreateProxies");
    const createProxies = await CreateProxies.deploy();
    await createProxies.deployed();
    await createProxies.createProxies(AMOUNT);
    proxyArr = await createProxies.getProxies();
  }).timeout(200000);

  it("Deploys BatchCaller", async function () {
    const BatchCaller = await ethers.getContractFactory("BatchCaller");
    const batchCaller = await BatchCaller.deploy();
    await batchCaller.deployed();
    batchCallerWithSigner = await batchCaller.connect(lmcSigner);
  });

  it("Mints cards with all proxies", async function () {
    console.log("Minting with these: ", proxyArr);
    await batchCallerWithSigner.batchMint(proxyArr);
    const balance = await card.balanceOf(RECIPIENT);
    console.log("Final Balance: ", balance);
  }).timeout(2000000);
});

describe("Mint with deployed contracts", function () {
  it("Impersonates Contract Owner", async function () {
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [CARD_OWNER],
    });
    await network.provider.send("hardhat_setBalance", [
      CARD_OWNER,
      "0x100000000000000000",
    ]);
    cardSigner = await ethers.provider.getSigner(CARD_OWNER);
  });

  it("Increases PublicMax", async function () {
    const Card = await ethers.getContractFactory("Card");
    card = await Card.attach(CARD_ADDRESS);
    const cardWithSigner = await card.connect(cardSigner);
    await cardWithSigner.setPublicMax(5000);
    const publicMax = await card.publicMax();
    expect(publicMax).to.eq(new ethers.BigNumber.from(5000));
  });

  it("Impersonates LonaMisa", async function () {
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [LMC],
    });
    await network.provider.send("hardhat_setBalance", [
      LMC,
      "0x100000000000000000",
    ]);
    lmcSigner = await ethers.provider.getSigner(LMC);
  });

  it("Attaches contracts", async function () {
    const Implementation = await ethers.getContractFactory("Implementation");
    implementation = await Implementation.attach(IMPLEMENTATION);
    const CreateProxies = await ethers.getContractFactory("CreateProxies");
    createProxies = await CreateProxies.attach(CREATE_PROXIES);
    const BatchCaller = await ethers.getContractFactory("BatchCaller");
    batchCaller = await BatchCaller.attach(BATCH_CALLER);

    proxyArr = await createProxies.getProxies();
    batchCallerWithSigner = await batchCaller.connect(lmcSigner);
  });

  it("Mints cards", async function () {
    console.log("Minting with these: ", proxyArr);
    await batchCallerWithSigner.batchMint(proxyArr);
    const balance = await card.balanceOf(RECIPIENT);
    console.log("Final Balance: ", balance);
  }).timeout(2000000);
});
