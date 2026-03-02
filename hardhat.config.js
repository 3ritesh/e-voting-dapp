require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    polygon_mumbai: {
      url: process.env.NEXT_PUBLIC_POLYGON_MUMBAI_RPC || "https://rpc-mumbai.maticvigil.com",
      accounts: [PRIVATE_KEY],
    },
    sepolia: {
      url: process.env.NEXT_PUBLIC_SEPOLIA_RPC || "https://rpc.sepolia.org",
      accounts: [PRIVATE_KEY],
    },
  },
};
