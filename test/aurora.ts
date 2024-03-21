import { assert } from 'chai';
import hre, { ignition } from 'hardhat';
import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { expect } from 'chai';
import { time } from '@nomicfoundation/hardhat-network-helpers';

describe("Aurora", function () {
  const AuroraModule = buildModule("Aurora", (m) => {
    const auroraOwner = m.getParameter("owner");
    const auroraContract = m.contract("Aurora", [auroraOwner]);
    return { auroraContract };
  });
  const claimModule = buildModule("Claim", (m) => {
    const claimContract = m.contract("Claim");

    return { claimContract };
  });

  it("Check claim", async function() {
    const _accounts = await hre.ethers.getSigners();
    const owner = _accounts[0];
    const claimer = _accounts[1];
    const lateClaimer = _accounts[2];
    const { auroraContract } = await ignition.deploy(AuroraModule, {
      parameters: {
        Aurora: {
          owner: await owner.getAddress(),
        }
      }
    });
    const { claimContract } = await ignition.deploy(claimModule);
    await auroraContract.setWhitelist(await owner.getAddress(), 1);
    await auroraContract.setWhitelist(await claimContract.getAddress(), 1);
    const _decimal = 18;
    const _totalSupply = 100000
    assert.equal(await auroraContract.balanceOf(await owner.getAddress()), BigInt(_totalSupply) * BigInt(10 ** _decimal));
    await auroraContract.connect(owner).transfer(await claimContract.getAddress(), BigInt(10 * 10 ** _decimal));
    const afterBalanceForOwner = await auroraContract.balanceOf(await owner.getAddress());
    const afterBalanceForClaimContract = await auroraContract.balanceOf(await claimContract.getAddress());
    assert.equal(afterBalanceForOwner, BigInt(_totalSupply) * BigInt(10 ** _decimal) - BigInt(10 * 10 ** _decimal));
    assert.equal(afterBalanceForClaimContract, BigInt(10 * 10 ** _decimal));
    await expect(claimContract.connect(claimer).claim()).to.be.revertedWith('Set token first.');
    await claimContract.setToken(await auroraContract.getAddress());
    await expect(claimContract.connect(claimer).claim()).to.be.revertedWith('Claim not started.');
    const startTime = parseInt(String(new Date().getTime() / 1000));
    await claimContract.setStartTime(startTime);
    const endTime = startTime + 2 * 86400;
    await claimContract.setEndTime(endTime);
    await claimContract.connect(claimer).claim();
    await expect(claimContract.connect(claimer).claim()).to.be.revertedWith('You have claimed.');
    assert.equal(await auroraContract.balanceOf(await claimContract.getAddress()), afterBalanceForClaimContract - BigInt(10** _decimal));
    assert.equal(await auroraContract.balanceOf(await claimer.getAddress()), BigInt(10 ** _decimal));
    await time.increase(2 * 86400 + 1);
    await expect(claimContract.connect(lateClaimer).claim()).to.be.revertedWith('Claim has ended.');
    await claimContract.connect(owner).withdraw(await auroraContract.getAddress());
    assert.equal(await auroraContract.balanceOf(await claimContract.getAddress()), BigInt(0));
  })
});