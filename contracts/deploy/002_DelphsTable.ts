import "hardhat-deploy";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const player = await get('Player')
  const roller = await get('DiceRoller')

  await deploy("DelphsTable", {
    from: deployer,
    log: true,
    // deterministicDeployment: true,
    args: [roller.address, player.address, deployer],
  });
};
export default func;
