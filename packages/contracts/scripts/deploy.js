const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // 1. Deploy AppToken
  const AppToken = await hre.ethers.getContractFactory("AppToken");
  const token = await AppToken.deploy(deployer.address);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("AppToken deployed to:", tokenAddress);

  // 2. Deploy RentHouse
  const RentHouse = await hre.ethers.getContractFactory("RentHouse");
  const rentHouse = await RentHouse.deploy();
  await rentHouse.waitForDeployment();
  const rentHouseAddress = await rentHouse.getAddress();
  console.log("RentHouse deployed to:", rentHouseAddress);

  // Setup export paths
  const sharedAbiDir = path.resolve(__dirname, "../../shared/abi");
  const sharedAddressDir = path.resolve(__dirname, "../../shared/addresses");

  if (!fs.existsSync(sharedAbiDir)) fs.mkdirSync(sharedAbiDir, { recursive: true });
  if (!fs.existsSync(sharedAddressDir)) fs.mkdirSync(sharedAddressDir, { recursive: true });

  // Export ABIs
  const tokenArtifact = await hre.artifacts.readArtifact("AppToken");
  const rentHouseArtifact = await hre.artifacts.readArtifact("RentHouse");

  fs.writeFileSync(
    path.join(sharedAbiDir, "AppToken.json"),
    JSON.stringify(tokenArtifact.abi, null, 2)
  );
  fs.writeFileSync(
    path.join(sharedAbiDir, "RentHouse.json"),
    JSON.stringify(rentHouseArtifact.abi, null, 2)
  );

  // Export Addresses
  const networkName = hre.network.name;
  fs.writeFileSync(
    path.join(sharedAddressDir, `${networkName}.json`),
    JSON.stringify({ 
      AppToken: tokenAddress,
      RentHouse: rentHouseAddress
    }, null, 2)
  );

  console.log(`ABI and addresses for ${networkName} exported to packages/shared`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

