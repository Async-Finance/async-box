import { assert } from 'chai';
import hre, { ignition } from 'hardhat';
import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

describe("AsyncBox", function () {
  const AsyncBoxModule = buildModule("AsyncBox", (m) => {
    const asyncBoxOwner = m.getParameter("owner");
    const asyncBoxContract = m.contract("AsyncBox", [asyncBoxOwner]);
    return { asyncBoxContract };
  });
  const claimModule = buildModule("Claim", (m) => {
    const tokenAddress = m.getParameter("token");
    const CURRENT_TIME = parseInt(String(new Date().getTime() / 1000));
    const START_TIME = CURRENT_TIME
    const END_TIME = START_TIME + 2 * 86400
    const claimContract = m.contract("Claim", [tokenAddress, START_TIME, END_TIME]);

    return { claimContract };
  });

  it("Check claim", async function() {
    const _accounts = await hre.ethers.getSigners();
    const owner = _accounts[0];
    const claimer = _accounts[1];
    const { asyncBoxContract } = await ignition.deploy(AsyncBoxModule, {
      parameters: {
        AsyncBox: {
          owner: await owner.getAddress(),
        }
      }
    });
    const { claimContract } = await ignition.deploy(claimModule, {
      parameters: {
        Claim: {
          token: await asyncBoxContract.getAddress(),
        }
      }
    });
    await asyncBoxContract.setWhitelist(await owner.getAddress(), 1);
    await asyncBoxContract.setWhitelist(await claimContract.getAddress(), 1);
    const _decimal = 18;
    assert.equal(await asyncBoxContract.balanceOf(await _accounts[0].getAddress()), BigInt(10000 * 10 ** _decimal));
    await asyncBoxContract.connect(owner).transfer(await claimContract.getAddress(), BigInt(10 * 10 ** _decimal));
    const afterBalanceForOwner = await asyncBoxContract.balanceOf(await _accounts[0].getAddress());
    const afterBalanceForClaimContract = await asyncBoxContract.balanceOf(await claimContract.getAddress());
    assert.equal(afterBalanceForOwner, BigInt(10000 * 10 ** _decimal) - BigInt(10 * 10 ** _decimal));
    assert.equal(afterBalanceForClaimContract, BigInt(10 * 10 ** _decimal));
    await claimContract.connect(claimer).claim();
    assert.equal(await asyncBoxContract.balanceOf(await claimContract.getAddress()), afterBalanceForClaimContract - BigInt(1 ** _decimal));
    assert.equal(await asyncBoxContract.balanceOf(await claimer.getAddress()), BigInt(1 ** _decimal));
    await claimContract.connect(owner).withdraw(await asyncBoxContract.getAddress());
    assert.equal(await asyncBoxContract.balanceOf(await claimContract.getAddress()), BigInt(0));
  })
});