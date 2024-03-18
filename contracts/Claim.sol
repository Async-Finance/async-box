// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Claim is Ownable {
    ERC20 public token;
    mapping (address => uint) public claimRecord;
    uint256 public startTime;
    uint256 public endTime;

    constructor(address _token, uint256 _startTime, uint256 _endTime) Ownable(msg.sender) {
        require(_token != address(0));
        token = ERC20(_token);
        startTime = _startTime;
        endTime = _endTime;
    }

    function claim() public {
        uint256 _balance = token.balanceOf(address(this));
        require(_balance > 0, "All token has been claimed.");
        require(claimRecord[msg.sender] != 1, "You have claimed.");
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Claim not active");
        claimRecord[msg.sender] = 1;
        token.transfer(msg.sender, 1 ** token.decimals());
    }

    function withdraw() public onlyOwner {
        uint256 _balance = token.balanceOf(address(this));
        require(_balance > 0, "All token has been claimed.");
        token.transfer(msg.sender, _balance);
    }
}