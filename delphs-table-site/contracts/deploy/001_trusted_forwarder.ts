import "hardhat-deploy";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { TrustedForwarder__factory } from 'skale-relayer-contracts/lib/typechain-types'

const SERVICE = "delphstable.xyz";
const STATEMENT = "Your browser will send transactions to Delph's Table without requiring signatures.";
const URI = "https://delphstable.xyz";
const VERSION = "1";

const func: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const roller = await get('DiceRoller')

  await deploy("TrustedForwarder", {
    from: deployer,
    log: true,
    contract: {
      bytecode: TrustedForwarder__factory.bytecode,
      abi: TrustedForwarder__factory.abi,
    },
    args: [
      roller.address,
      SERVICE,
      STATEMENT,
      URI,
      VERSION
    ],
  });
};
export default func;
