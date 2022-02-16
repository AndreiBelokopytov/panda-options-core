const { TezosToolkit } = require("@taquito/taquito");
const { InMemorySigner } = require("@taquito/signer");
const { alice } = require("../../scripts/sandbox/accounts");
const { bob } = require("../../scripts/sandbox/accounts");
const { deployToNetwork } = require("../../scripts/helpers");
const env = require("../../env");

const networkConfig = env.networks.localhost;
const rpc = networkConfig.rpc;
const Tezos = new TezosToolkit(rpc);

const signerAlice = new InMemorySigner(networkConfig.secretKey);
const signerBob = new InMemorySigner(bob.sk);

Tezos.setSignerProvider(signerAlice);

const deploy = deployToNetwork("localhost");

module.exports = { Tezos, signerAlice, signerBob, alice, deploy };
