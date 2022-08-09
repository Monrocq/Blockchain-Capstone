var ERC721MintableComplete = artifacts.require('CustomERC721Token');
const { expectRevert } = require('@openzeppelin/test-helpers');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new("TestERC721Mintable", "TEM", {from: account_one});
            this.supply = 0;
            // TODO: mint multiple tokens
            await this.contract.mint(account_two, ++this.supply, "1")
        })

        it('should return total supply', async function () { 
            const totalSupply = await this.contract.totalSupply()
            assert(this.supply === parseInt(totalSupply), `${this.supply}/${totalSupply}`);
        })

        it('should get token balance', async function () { 
            const balance1 = await this.contract.balanceOf(account_one);
            const balance2 = await this.contract.balanceOf(account_two);
            assert(balance1 !== balance2, `${balance1}/${balance2}`);
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const uri = await this.contract.tokenURI(this.supply);
            assert(uri === "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1")
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_two, account_three, this.supply, {from: account_two});
            assert(await this.contract.ownerOf(this.supply) === account_three);
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new("TestERC721Mintable", "TEM", {from: account_one});
            this.supply = 0;
        })

        it('should fail when minting when address is not contract owner', async function () { 
            await expectRevert(this.contract.mint(account_two, ++this.supply, "1", {from: account_two}), "needs being called by the owner");
            const totalSupply = await this.contract.totalSupply();
            assert(this.supply != totalSupply);
        })

        it('should return contract owner', async function () { 
            const owner = await this.contract.owner();
            assert(owner === account_one);
        })

    });
})