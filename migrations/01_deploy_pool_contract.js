const { deployToNetwork } = require("../scripts/helpers");

module.exports = async (tezos, network) => {
  const storage = require("./storage/pool_storage");
  const deploy = deployToNetwork(network);
  const contractAddress = await deploy(tezos, "pool", { storage: storage[network] });
  console.log(`Pool contract address: ${contractAddress}`);
};