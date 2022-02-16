require("dotenv").config();
const { alice } = require("./scripts/sandbox/accounts");

module.exports = {
  buildsDir: "builds",
  migrationsDir: "migrations",
  contractsDir: "contracts/main",
  compiler: {
    version: "0.35.0",
    michelsonFormat: "json",
    protocol: "hangzhou"
  },
  networks: {
    localhost: {
      rpc: "http://flextesa:20000",
      network_id: "*",
      secretKey: alice.sk,
    },
    hangzhounet: {
      rpc: "https://hangzhounet.api.tez.ie/",
      port: 443,
      network_id: "*",
      secretKey: alice.sk,
    },
    mainnet: {
      rpc: "https://mainnet.smartpy.io",
      network_id: "*",
      secretKey: alice.sk,
    },
  },
};
