var Soln = artifacts.require("SolnSquareVerifier");
var proof = require('../../zokrates/code/proof.json')

contract('TestSoln', accounts => {
  describe('Soln Tests', () => {
    beforeEach(async function() {
      this.contract = await Soln.new();
    })

    it('Test if a new solution can be added for contract - SolnSquareVerifier', async function () {
      const tx = await this.contract.addSolution(9)
      assert(tx.logs[0].event == 'SolutionAdded')
    })

    it('Test if an ERC721 token can be minted for contract - SolnSquareVerifier', async function () {
      const supplyInit = await this.contract.totalSupply();
      assert(parseInt(supplyInit) === 0, 'Total supply is not well init at 0 but at : '+supplyInit);
      await this.contract.mint(accounts[0], '1', {proof: proof.proof, inputs: proof.inputs});
      const supplyProcessed = await this.contract.totalSupply()
      assert(parseInt(supplyProcessed) === 1, 'Total supply has not been switched on 1');
    })
  })
})

// 
