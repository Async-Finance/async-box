import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import "dotenv/config";
import { Wallet } from 'zksync-ethers';

const deploy = async (hre: HardhatRuntimeEnvironment, wallet: Wallet, deployer: Deployer, contractName: string, args: any[]) => {
  const artifact = await deployer.loadArtifact(contractName);
  const fee = await deployer.estimateDeployFee(artifact, args);
  console.log("estimateDeployFee -> ", fee.toString());

  console.log(`Deploying ${artifact.contractName}...`);
  const contract = await deployer.deploy(artifact, args);

  // Show the contract info.
  const address = contract.target;
  console.log(`${artifact.contractName} was deployed to ${address}`);
  await hre.run("verify:verify", {
    address: address,
    contract: `contracts/${contractName}.sol:${contractName}`,
    constructorArguments: args,
  });
  return address;
}

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the AsyncBox`);

  const wallet = new Wallet(process.env.SECRET_KEY || '');
  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);

  const asyncBox = await deploy(hre, wallet, deployer, "AsyncBox", [wallet.address]);
  const CURRENT_TIME = parseInt(String(new Date().getTime() / 1000));
  const START_TIME = CURRENT_TIME
  const END_TIME = START_TIME + 2 * 86400
  await deploy(hre, wallet, deployer, "Claim", [asyncBox, START_TIME, END_TIME]);
}
