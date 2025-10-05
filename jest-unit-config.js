const baseConfig = require("./jest.config.ts");

module.exports = {
  ...baseConfig.default,
  testMatch: ["**/*.spec.ts"],
};
