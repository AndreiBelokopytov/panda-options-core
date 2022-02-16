require("dotenv").config();

const { execSync } = require("child_process");
const fs = require("fs");
const { TezosToolkit } = require("@taquito/taquito");
const { InMemorySigner } = require("@taquito/signer");
const { confirmOperation } = require("./confirmation");
const unparse = require('yargs-unparser');
const env = require("../env");

const getFileNameParts = fileName => {
  const dotIndex = fileName.lastIndexOf(".");
  const name = fileName.slice(0, dotIndex);
  const extension = fileName.slice(dotIndex + 1);
  return [name, extension];
}

const getContractsList = () => {
  return fs
    .readdirSync(env.contractsDir)
    .filter(file => /\.(re|m|js)?ligo$/.test(file));
};

const getMigrationsList = () => {
  return fs
    .readdirSync(env.migrationsDir)
    .filter(file => file.endsWith(".js"))
    .map(file => file.slice(0, file.length - 3));
};

const compile = async (contract) => {
  const contracts = !contract ? getContractsList() : [contract];
  const { michelsonFormat, syntax, protocol, version: compilerVersion } = env.compiler
  const ligoArguments = unparse({
    "michelson-format": michelsonFormat,
    syntax,
    protocol
  }).filter(el => el !== undefined);
  contracts.forEach(contract => {
    const [contractName] = getFileNameParts(contract);
    let michelson;
    try {
      michelson = execSync(
        `ligo compile contract $PWD/${env.contractsDir}/${contract} ${ligoArguments.join(" ")}`,
        { maxBuffer: 1024 * 4000 },
      ).toString();
    } catch (e) {
      console.log(e);
    }

    if (michelsonFormat == "json") {
      const artifacts = JSON.stringify(
        {
          michelson: JSON.parse(michelson),
          networks: {},
          compiler: "ligo:" + compilerVersion,
        },
        null,
        2,
      );
      if (!fs.existsSync(env.buildsDir)) {
        fs.mkdirSync(env.buildsDir);
      }
      fs.writeFileSync(`${env.buildsDir}/${contractName}.json`, artifacts);
    } else {
      fs.writeFileSync(`${env.contractsDir}/${contractName}.tz`, michelson);
    }
  });
};

const deployToNetwork = network => async (tezos, contract, props) => {
  const artifacts = JSON.parse(
    fs.readFileSync(`${env.buildsDir}/${contract}.json`),
  );
  const operation = await tezos.contract
    .originate({
      code: artifacts.michelson,
      ...props,
    })
  await confirmOperation(tezos, operation.hash);
  artifacts.networks[network] = { [contract]: operation.contractAddress };

  if (!fs.existsSync(env.buildsDir)) {
    fs.mkdirSync(env.buildsDir);
  }

  fs.writeFileSync(
    `${env.buildsDir}/${contract}.json`,
    JSON.stringify(artifacts, null, 2),
  );

  return operation.contractAddress;
};

const runMigrations = async argv => {
  try {
    const migrations = getMigrationsList();

    const network = argv.network;

    const networkConfig = env.networks[network];

    const tezos = new TezosToolkit(networkConfig.rpc);

    tezos.setProvider({
      config: {
        confirmationPollingTimeoutSecond: env.confirmationPollingTimeoutSecond,
      },
      signer: await InMemorySigner.fromSecretKey(networkConfig.secretKey),
    });

    for (const migration of migrations) {
      const execMigration = require(`../${env.migrationsDir}/${migration}.js`);

      await execMigration(tezos, network);
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  getContractsList,
  getMigrationsList,
  compile,
  deployToNetwork,
  runMigrations,
  env,
};
