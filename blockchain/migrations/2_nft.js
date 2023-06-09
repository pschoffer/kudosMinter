const KudosMinter = artifacts.require("KudosMinter");

module.exports = function (deployer) {
  deployer.deploy(KudosMinter);
};
