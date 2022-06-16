import "hardhat-deploy";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy, execute } = deployments;
  const { deployer } = await getNamedAccounts();

  const player = await deploy("Player", {
    from: deployer,
    log: true,
    // deterministicDeployment: true,
    args: [],
  });

  if (player.newlyDeployed) {
    await execute(
      "Player",
      {
        log: true,
        from: deployer,
      },
      "initializePlayer",
      "deployer",
      deployer
    );
  }
};
export default func;
