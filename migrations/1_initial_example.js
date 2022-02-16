const { deployToNetwork } = require("../scripts/helpers");
const exampleStorage = require("../storage/Example");

module.exports = async (tezos, network) => {
  const deploy = deployToNetwork(network);
  const contractAddress = await deploy(tezos, "example", { storage: exampleStorage });
  console.log(`Example contract address: ${contractAddress}`);
};
