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

  await deploy("Lobby", {
    from: deployer,
    log: true,
    args: [player.address, deployer],
  });
};
export default func;
