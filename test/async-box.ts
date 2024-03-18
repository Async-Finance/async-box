import { assert } from 'chai';
import hre, { ignition } from 'hardhat';
import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

describe("AsyncBox", function () {
  const AsyncBoxModule = buildModule("AsyncBox", (m) => {
    const asyncBoxOwner = m.getParameter("owner");
    const asyncBoxContract = m.contract("AsyncBox", [asyncBoxOwner]);
    return { asyncBoxContract };
  });


  it("Check transfer", async function () {
    const _accounts = await hre.ethers.getSigners();
    const { asyncBoxContract } = await ignition.deploy(AsyncBoxModule, {
      parameters: {
        AsyncBox: {
          owner: await _accounts[0].getAddress(),
        }
      }
    });
    await asyncBoxContract.setWhitelist(await _accounts[0].getAddress(), 1);
    await asyncBoxContract.setWhitelist(await _accounts[1].getAddress(), 1);
    const _decimal = 18;
    assert.equal(await asyncBoxContract.balanceOf(await _accounts[0].getAddress()), BigInt(10000 * 10 ** _decimal));
    await asyncBoxContract.connect(_accounts[0]).transfer(await _accounts[1].getAddress(), BigInt(10 * 10 ** _decimal));
    const afterBalanceForU0 = await asyncBoxContract.balanceOf(await _accounts[0].getAddress());
    const afterBalanceForU1 = await asyncBoxContract.balanceOf(await _accounts[1].getAddress());
    assert.equal(afterBalanceForU0, BigInt(10000 * 10 ** _decimal) - BigInt(10 * 10 ** _decimal));
    assert.equal(afterBalanceForU1, BigInt(10 * 10 ** _decimal));
  });
});