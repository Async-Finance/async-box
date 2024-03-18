import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition-ethers";
import 'dotenv/config';


const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    MerlinTestnet: {
      url: 'https://testnet-rpc.merlinchain.io',
      accounts: [process.env.SECRET_KEY || ''],
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
      }
    ]
  },
  sourcify: {
    enabled: true
  }
};

export default config;
