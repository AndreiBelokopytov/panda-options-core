const { Tezos, signerAlice, deploy } = require("./utils/cli");
const { strictEqual, ok, rejects } = require("assert");
const { BigNumber } = require("bignumber.js")

describe("Pool contract test", async function () {
  let contract;

  before(async () => {
    Tezos.setSignerProvider(signerAlice);
    const storage = require("./storage/pool_test_storage");

    const deployedContract = await deploy(Tezos, "pool", {init: storage});
    contract = await Tezos.contract.at(deployedContract);
  });

  describe("Sell option", async function () {
    const strike = 10000;
    const amount = 1;
    const period = 15;

    it("should create an option correctly", async function () {
      const op = await contract.methods.default(strike, amount, period).send();
      await op.confirmation();
      const storage = await contract.storage()
      const option = await storage.options.get(1);

      const expectedStrike = new BigNumber(strike);
      const expectedAmount = new BigNumber(amount);
      const expiration = new Date();
      expiration.setDate(expiration.getDate() + period);

      ok(expectedStrike.isEqualTo(option.strike));
      ok(expectedAmount.isEqualTo(option.amount));
      strictEqual(new Date(option.expiration).getDate(), expiration.getDate());
      ok(option.state.active !== undefined);
    });

    it("should revert if the period is less than 1 day", async function () {
      const invalidPeriod = 0;
      await rejects(contract.methods.default(strike, amount, invalidPeriod).send())
    });

    it("should revert if the period is more than 30 days", async function () {
      const invalidPeriod = 31;
      await rejects(contract.methods.default(strike, amount, invalidPeriod).send())
    });
  });
});
