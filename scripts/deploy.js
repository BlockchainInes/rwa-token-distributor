import { ethers } from "ethers";
import fs from "fs";

async function main() {
  const artifactPath = "./artifacts/contracts/RWADistributor.sol/RWADistributor.json";
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const testPrivateKey = "0x0000000000000000000000000000000000000000000000000000000000000001";
  const wallet = new ethers.Wallet(testPrivateKey);

  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
  const merkleRoot = "0x0000000000000000000000000000000000000000000000000000000000000000";

  console.log("Deploying RWADistributor...");

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  await factory.getDeployTransaction(tokenAddress, merkleRoot);
  
  const mockAddress = ethers.getCreateAddress({
    from: wallet.address,
    nonce: 0
  });

  console.log(mockAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});