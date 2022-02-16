const { deployToNetwork } = require("../scripts/helpers");

module.exports = async (tezos, network) => {
  const init = require("./storage/pool_storage");
  const deploy = deployToNetwork(network);
  const contractAddress = await deploy(tezos, "pool", { init });
  console.log(`Pool contract address: ${contractAddress}`);
};