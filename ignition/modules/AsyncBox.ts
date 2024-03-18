import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AsyncBox", (m) => {
  const asyncBoxOwner = m.getParameter("owner");
  const asyncBoxContract = m.contract("AsyncBox", [asyncBoxOwner]);

  return { asyncBoxContract };
});