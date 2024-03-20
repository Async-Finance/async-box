// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Claim is Ownable {
    ERC20 public token;
    mapping (address => uint) public claimRecord;
    uint256 public startTime;
    uint256 public endTime;
    event ClaimEvent(address indexed to, uint256 value);

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
        emit ClaimEvent(msg.sender, 1 ** token.decimals());
    }

    function withdraw(address target) public onlyOwner {
        ERC20 _token = token;
        if (target != address(0)) {
            _token = ERC20(token);
        }
        uint256 _erc20_balance = _token.balanceOf(address(this));
        if (_erc20_balance > 0) {
            _token.transfer(msg.sender, _erc20_balance);
        }
    }
}