import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Aurora", (m) => {
  const auroraOwner = m.getParameter("owner");
  const auroraContract = m.contract("Aurora", [auroraOwner]);

  return { auroraContract };
});