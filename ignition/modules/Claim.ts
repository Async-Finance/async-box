import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Claim", (m) => {
  const tokenAddress = m.getParameter("token");
  const CURRENT_TIME = parseInt(String(new Date().getTime() / 1000));
  const START_TIME = CURRENT_TIME
  const END_TIME = START_TIME + 2 * 86400
  const claim = m.contract("Claim", [tokenAddress, START_TIME, END_TIME]);

  return { claim };
});
