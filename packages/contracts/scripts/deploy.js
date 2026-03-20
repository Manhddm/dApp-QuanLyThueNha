const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const AppToken = await hre.ethers.getContractFactory("AppToken");
  const token = await AppToken.deploy(deployer.address);
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("AppToken deployed to:", address);

  const artifact = await hre.artifacts.readArtifact("AppToken");

  const sharedAbiDir = path.resolve(__dirname, "../../shared/abi");
  const sharedAddressDir = path.resolve(__dirname, "../../shared/addresses");

  if (!fs.existsSync(sharedAbiDir)) fs.mkdirSync(sharedAbiDir, { recursive: true });
  if (!fs.existsSync(sharedAddressDir)) fs.mkdirSync(sharedAddressDir, { recursive: true });

  fs.writeFileSync(
    path.join(sharedAbiDir, "AppToken.json"),
    JSON.stringify(artifact.abi, null, 2)
  );

  const networkName = hre.network.name;
  fs.writeFileSync(
    path.join(sharedAddressDir, `${networkName}.json`),
    JSON.stringify({ AppToken: address }, null, 2)
  );

  console.log("ABI and address exported to packages/shared");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
