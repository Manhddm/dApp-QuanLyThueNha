const hre = require("hardhat");

async function main() {
  const address = "0x03b60977802fdB03E7BB9E52ade060f8753e9305";
  const provider = hre.ethers.provider;
  
  const abi2 = [
    "function roomCount() view returns (uint256)",
    "function contractCount() view returns (uint256)"
  ];
  const contract = new hre.ethers.Contract(address, abi2, provider);
  
  try {
    const c = await contract.contractCount();
    console.log("contractCount:", c.toString());
  } catch (e) {
    console.log("contractCount failed:", e.message);
  }

  try {
    const rc = await contract.roomCount();
    console.log("roomCount:", rc.toString());
  } catch (e) {
    console.log("roomCount failed:", e.message);
  }
}

main().catch(console.error);
