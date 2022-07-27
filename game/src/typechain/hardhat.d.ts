/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "AccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AccessControl__factory>;
    getContractFactory(
      name: "IAccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControl__factory>;
    getContractFactory(
      name: "IVotes",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IVotes__factory>;
    getContractFactory(
      name: "Pausable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Pausable__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "ERC20Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Permit__factory>;
    getContractFactory(
      name: "IERC20Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Permit__factory>;
    getContractFactory(
      name: "ERC20Burnable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Burnable__factory>;
    getContractFactory(
      name: "ERC20Votes",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Votes__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "DelphsTable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DelphsTable__factory>;
    getContractFactory(
      name: "DiceRoller",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DiceRoller__factory>;
    getContractFactory(
      name: "IDiceRoller",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDiceRoller__factory>;
    getContractFactory(
      name: "IPlayer",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPlayer__factory>;
    getContractFactory(
      name: "Lobby",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Lobby__factory>;
    getContractFactory(
      name: "OrchestratorState",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OrchestratorState__factory>;
    getContractFactory(
      name: "Player",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Player__factory>;
    getContractFactory(
      name: "TestDiceRoller",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestDiceRoller__factory>;
    getContractFactory(
      name: "Wootgump",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Wootgump__factory>;

    getContractAt(
      name: "AccessControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AccessControl>;
    getContractAt(
      name: "IAccessControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControl>;
    getContractAt(
      name: "IVotes",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IVotes>;
    getContractAt(
      name: "Pausable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Pausable>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "ERC20Permit",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Permit>;
    getContractAt(
      name: "IERC20Permit",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Permit>;
    getContractAt(
      name: "ERC20Burnable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Burnable>;
    getContractAt(
      name: "ERC20Votes",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Votes>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "ERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "DelphsTable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DelphsTable>;
    getContractAt(
      name: "DiceRoller",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DiceRoller>;
    getContractAt(
      name: "IDiceRoller",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IDiceRoller>;
    getContractAt(
      name: "IPlayer",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPlayer>;
    getContractAt(
      name: "Lobby",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Lobby>;
    getContractAt(
      name: "OrchestratorState",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OrchestratorState>;
    getContractAt(
      name: "Player",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Player>;
    getContractAt(
      name: "TestDiceRoller",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TestDiceRoller>;
    getContractAt(
      name: "Wootgump",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Wootgump>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
