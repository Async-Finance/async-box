import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition-ethers";
import "dotenv/config";

import "@matterlabs/hardhat-zksync-node";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";


const config: HardhatUserConfig = {
  solidity: {
    compilers: [{
      version: "0.8.20",
      settings: { optimizer: { enabled: true, runs: 200 } }
    }]
  },
  zksolc: {
    version: '1.3.13'
  },
  defaultNetwork: "zkLinkTestnet",
  networks: {
    MerlinTestnet: {
      url: 'https://testnet-rpc.merlinchain.io',
      accounts: [process.env.SECRET_KEY || ''],
    },
    zkLink: {
      url: "https://rpc.zklink.io",
      zksync: true,
      ethNetwork: "mainnet",
      verifyURL: "https://explorer.zklink.io/contracts_verification",
    },
    zkLinkTestnet: {
      url: "https://goerli.rpc.zklink.io",
      zksync: true,
      ethNetwork: "goerli",
      verifyURL: "https://goerli.explorer.zklink.io/contract_verification",
    },
  },
  etherscan: {
    apiKey: {
      MerlinTestnet: "merlintestnet"
    },
    customChains: [
      {
        network: "MerlinTestnet",
        chainId: 686868,
        urls: {
          apiURL: "https://testnet-scan.merlinchain.io/api",
          browserURL: "https://testnet-scan.merlinchain.io"
        }
      },
      {
        network: "zkLink",
        chainId: 810180,
        urls: {
          apiURL: "https://explorer.zklink.io/contracts/verify",
          browserURL: "https://explorer.zklink.io"
        }
      },
      {
        network: "zkLinkTestnet",
        chainId: 810182,
        urls: {
          apiURL: "https://goerli.explorer.zklink.io/contracts/verify",
          browserURL: "https://goerli.explorer.zklink.io"
        }
      }
    ]
  },
  sourcify: {
    enabled: true
  }
};

export default config;
