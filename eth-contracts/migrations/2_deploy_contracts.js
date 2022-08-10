// migrating the appropriate contracts
var SquareVerifier = artifacts.require("Verifier");
var ERC721Mintable = artifacts.require("CustomERC721Token");
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
var proof = require('../../zokrates/code/proof.json')

module.exports = async function(deployer, networks, accounts) {
  //deployer.deploy(SquareVerifier);
  //const contract = deployer.deploy(ERC721Mintable, "TestERC721Mintable", "TEM");
  await deployer.deploy(SolnSquareVerifier);
  const contract = await SolnSquareVerifier.deployed();
  for (let i = 0; i < 10; i++) {
    await contract.mint(accounts[0], i, {proof: proof.proof, inputs: proof.inputs});
  }
};
