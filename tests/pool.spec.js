const { Tezos, deploy } = require("./utils/cli");
const { strictEqual, ok, rejects } = require("assert");
const { BigNumber } = require("bignumber.js");
const testStorage = require("./test_storage");

describe("Pool contract test", async function () {
  let pool;
  let normalizer;
  const asset = "XTZ-USD";

  before(async () => {
    const normalizerAddress = await deploy(Tezos, "normalizer_mock",
      { storage: testStorage.normalizer }
    );
    normalizer = await Tezos.contract.at(normalizerAddress);
    const poolAddress = await deploy(Tezos, "pool", { storage: {
      ...testStorage.pool,
      harbinger: {
        normalizer: normalizerAddress,
        asset
      }
    }});
    pool = await Tezos.contract.at(poolAddress);
  });

  describe("Sell option", async function () {
    const strike = 10000;
    const amount = 1;
    const period = 15;

    it("should create an option correctly", async function () {
      const op = await pool.methods.default(strike, amount, period).send();
      await op.confirmation();
      const storage = await pool.storage()
      const option = await storage.options.get(storage.option_id);

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
      await rejects(pool.methods.default(strike, amount, invalidPeriod).send())
    });

    it("should revert if the period is more than 30 days", async function () {
      const invalidPeriod = 31;
      await rejects(pool.methods.default(strike, amount, invalidPeriod).send())
    });

    it("should set the strike to current price if no strike price is given", async function () {
      const op = await pool.methods.default(undefined, amount, period).send();
      await op.confirmation();
      const storage = await pool.storage();
      const option = await storage.options.get(storage.option_id);

      const normalizerStorage = await normalizer.storage();
      const { 1: price } = await normalizerStorage.get(asset);
      ok(option.strike.isEqualTo(price));
    });
  });
});
