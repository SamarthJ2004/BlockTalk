// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./BlockTalkToken.sol";
import "./BlockTalk.sol";

contract BlockTalkNFT is ERC721, Ownable(msg.sender) {
    BlockTalkToken public token;
    BlockTalkContract public blockTalkContract;
    uint public nextTokenId;
    uint public constant TOKEN_COST = 100 * 1e18; // 100 BTK

    constructor(BlockTalkToken _token, BlockTalkContract _blockTalkContract) ERC721("BlockTalk NFT", "BTKNFT") {
        token = _token;
        blockTalkContract = _blockTalkContract;
    }

    function mintNFT() external {
        require(
            token.balanceOf(msg.sender) >= TOKEN_COST,
            "Not enough BTK tokens"
        );
        token.transferFrom(msg.sender, address(this), TOKEN_COST);

        // Update the user's total token balance in the BlockTalkContract
        blockTalkContract.updateUserTokenBalance(msg.sender, TOKEN_COST);

        _mint(msg.sender, nextTokenId);
        nextTokenId++;
    }
}