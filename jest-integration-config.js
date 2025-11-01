const config = require("./jest.config.ts");

module.exports = {
  ...config,
  testMatch: ["**/*.test.ts"],
};
