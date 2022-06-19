/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  TestDiceRoller,
  TestDiceRollerInterface,
} from "../TestDiceRoller";

const _abi = [
  {
    inputs: [],
    name: "getRandom",
    outputs: [
      {
        internalType: "bytes32",
        name: "rnd",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060b08061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063aacc5a1714602d575b600080fd5b60336045565b60405190815260200160405180910390f35b600060506001436056565b40905090565b600082821015607557634e487b7160e01b600052601160045260246000fd5b50039056fea264697066735822122024f11cdb3497bf38762bbd470262e605285c893e9959986ce6ffe4d9d4ee9a9964736f6c634300080e0033";

export class TestDiceRoller__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TestDiceRoller> {
    return super.deploy(overrides || {}) as Promise<TestDiceRoller>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): TestDiceRoller {
    return super.attach(address) as TestDiceRoller;
  }
  connect(signer: Signer): TestDiceRoller__factory {
    return super.connect(signer) as TestDiceRoller__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestDiceRollerInterface {
    return new utils.Interface(_abi) as TestDiceRollerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestDiceRoller {
    return new Contract(address, _abi, signerOrProvider) as TestDiceRoller;
  }
}
