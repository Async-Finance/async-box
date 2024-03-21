import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Claim", (m) => {
  const claim = m.contract("Claim", []);

  return { claim };
});
