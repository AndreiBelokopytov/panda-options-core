const { MichelsonMap } = require("@taquito/taquito");

const normalizerStorage = MichelsonMap.fromLiteral({
  "XTZ-USD": [new Date().toISOString(), 3986387]
});

const poolStorage = {
  option_id: 0,
  option_kind: { call: Symbol() },
  options: new MichelsonMap()
};

module.exports = {
  normalizer: normalizerStorage,
  pool: poolStorage
};