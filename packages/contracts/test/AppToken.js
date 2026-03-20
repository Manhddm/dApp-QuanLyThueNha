const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AppToken", function () {
  it("Should mint initial supply to deployer", async function () {
    const [owner] = await ethers.getSigners();
    const AppToken = await ethers.getContractFactory("AppToken");
    const token = await AppToken.deploy(owner.address);
    await token.waitForDeployment();

    const balance = await token.balanceOf(owner.address);
    expect(balance).to.equal(ethers.parseUnits("1000000", 18));
  });
});
