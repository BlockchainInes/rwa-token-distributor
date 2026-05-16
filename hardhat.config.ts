import "dotenv/config";

const config = {
  solidity: "0.8.20",
  networks: {
    mainnet: {
      type: "http",
      url: process.env.RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/placeholder",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

export default config;