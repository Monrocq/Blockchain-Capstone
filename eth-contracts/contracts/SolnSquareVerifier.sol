pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

import "./verifier.sol";
import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract renamedVerifier is Verifier {
    function verifyTx(Verifier.Proof calldata proof, uint256[1] calldata input)
        external
        returns (bool);
}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token {
    renamedVerifier verifier;
    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address addr;
    }

    // TODO define an array of the above struct
    Solution[] private solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(uint256 => Solution) private submitted;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(
        uint256 indexed index,
        address indexed addr,
        bool submitted
    );

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(address addr) public onlyOwner {
        solutions.push(Solution(solutions.length, addr));
        emit SolutionAdded(solutions.length, addr, false);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    struct Checker {
        renamedVerifier.Proof proof;
        uint256[1] input;
    }

    //  - make sure you handle metadata as well as tokenSuplly
    function mint(
        address to,
        string memory tokenURI,
        Checker memory checker
    ) public {
        require(
            verifier.verifyTx(checker.proof, checker.input),
            "Wrong verification"
        );
        //  - make sure the solution is unique (has not been used before)
        require(
            submitted[checker.input[0]].addr == address(0),
            "This solution has already been used"
        );
        super.mint(to, totalSupply(), tokenURI);
    }
}
