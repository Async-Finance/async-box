import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import "dotenv/config";
import { Wallet } from 'zksync-ethers';
// import { ContractFactory } from 'ethers';
// import auroraArtifact from '../artifacts-zk/contracts/Aurora.sol/Aurora.json';
// import claimArtifact from '../artifacts-zk/contracts/Claim.sol/Claim.json';

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
  return contract;
}

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the Aurora`);

  const wallet = new Wallet(process.env.SECRET_KEY || '');
  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);

  const aurora = await deploy(hre, wallet, deployer, "Aurora", [wallet.address]);
  // const auroraFactory = new ContractFactory(auroraArtifact.abi, auroraArtifact.bytecode, deployer.zkWallet);
  // const aurora = asyncBoxFactory.attach('async box address');
  const claim = await deploy(hre, wallet, deployer, "Claim", []);

  await (await claim.setToken(aurora.target)).wait();
  // const claimFactory = new ContractFactory(claimArtifact.abi, claimArtifact.bytecode, deployer.zkWallet);
  // const claim = claimFactory.attach('claim address');
  await (await claim.setStartTime(parseInt(String(new Date().getTime() / 1000)))).wait();
  await (await aurora.setWhitelist(claim.target, true)).wait();
  await (await aurora.setWhitelist(wallet.address, true)).wait();
  await (await aurora.transfer(claim, BigInt(90000) * BigInt(10 ** 18))).wait();
}
