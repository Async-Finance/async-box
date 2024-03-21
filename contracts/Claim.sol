// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Claim is Ownable {
    address public token;
    mapping (address => uint) public claimRecord;
    uint256 public startTime;
    uint256 public endTime;
    event ClaimEvent(address indexed to, uint256 value);

    constructor() Ownable() {}

    function setToken(address _token) public onlyOwner {
        require(_token != address(0));
        token = _token;
    }

    function setStartTime(uint256 _startTime) public onlyOwner {
        startTime = _startTime;
    }

    function setEndTime(uint256 _endTime) public onlyOwner {
        endTime = _endTime;
    }

    function claim() public {
        require(token != address(0), "Set token first.");
        ERC20 _token = ERC20(token);
        uint256 _balance = _token.balanceOf(address(this));
        require(_balance > 0, "All token has been claimed.");
        require(claimRecord[msg.sender] != 1, "You have claimed.");
        require(startTime > 0, "Claim not started.");
        require(block.timestamp >= startTime, "Claim not started.");
        if (endTime > 0) {
            require(block.timestamp <= endTime, "Claim has ended.");
        }
        claimRecord[msg.sender] = 1;
        _token.transfer(msg.sender, 1 * 10 ** _token.decimals());
        emit ClaimEvent(msg.sender, 1 * 10 ** _token.decimals());
    }

    function withdraw(address target) public onlyOwner {
        ERC20 _token = ERC20(token);
        if (target != address(0)) {
            _token = ERC20(target);
        }
        uint256 _erc20_balance = _token.balanceOf(address(this));
        if (_erc20_balance > 0) {
            _token.transfer(msg.sender, _erc20_balance);
        }
    }
}