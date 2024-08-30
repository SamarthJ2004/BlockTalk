// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BlockTalkToken is ERC20, Ownable(msg.sender) {
    event Mint(address indexed to, uint256 amount);

    constructor() ERC20("BlockTalk", "BTK") {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit Mint(to, amount);
    }
}