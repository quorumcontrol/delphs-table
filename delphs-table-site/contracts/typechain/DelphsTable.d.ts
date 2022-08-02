/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface DelphsTableInterface extends ethers.utils.Interface {
  functions: {
    "ADMIN_ROLE()": FunctionFragment;
    "DEFAULT_ADMIN_ROLE()": FunctionFragment;
    "blockOfRoll(uint256)": FunctionFragment;
    "createAndStart(bytes32,address[],bytes32[],uint256,address)": FunctionFragment;
    "createTable(bytes32,address[],bytes32[],uint256,address)": FunctionFragment;
    "destinations(bytes32,uint256,uint256)": FunctionFragment;
    "destinationsForRoll(bytes32,uint256)": FunctionFragment;
    "getRoleAdmin(bytes32)": FunctionFragment;
    "grantRole(bytes32,address)": FunctionFragment;
    "hasRole(bytes32,address)": FunctionFragment;
    "isTrustedForwarder(address)": FunctionFragment;
    "latestRoll()": FunctionFragment;
    "players(bytes32)": FunctionFragment;
    "renounceRole(bytes32,address)": FunctionFragment;
    "revokeRole(bytes32,address)": FunctionFragment;
    "rollTheDice()": FunctionFragment;
    "roller()": FunctionFragment;
    "rolls(uint256)": FunctionFragment;
    "seeds(bytes32)": FunctionFragment;
    "setDestination(bytes32,int64,int64)": FunctionFragment;
    "start(bytes32)": FunctionFragment;
    "statsForPlayer(bytes32,address)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "tables(bytes32)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "blockOfRoll",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "createAndStart",
    values: [BytesLike, string[], BytesLike[], BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "createTable",
    values: [BytesLike, string[], BytesLike[], BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "destinations",
    values: [BytesLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "destinationsForRoll",
    values: [BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRoleAdmin",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "grantRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "isTrustedForwarder",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "latestRoll",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "players", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "rollTheDice",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "roller", values?: undefined): string;
  encodeFunctionData(functionFragment: "rolls", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "seeds", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "setDestination",
    values: [BytesLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "start", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "statsForPlayer",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "tables", values: [BytesLike]): string;

  decodeFunctionResult(functionFragment: "ADMIN_ROLE", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "blockOfRoll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createAndStart",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createTable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "destinations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "destinationsForRoll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isTrustedForwarder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "latestRoll", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "players", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rollTheDice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "roller", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rolls", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "seeds", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setDestination",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "start", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "statsForPlayer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tables", data: BytesLike): Result;

  events: {
    "DiceRolled(uint256,uint256,bytes32)": EventFragment;
    "RoleAdminChanged(bytes32,bytes32,bytes32)": EventFragment;
    "RoleGranted(bytes32,address,address)": EventFragment;
    "RoleRevoked(bytes32,address,address)": EventFragment;
    "Started(bytes32,uint256)": EventFragment;
    "TableCreated(bytes32)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DiceRolled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleAdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleGranted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleRevoked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Started"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TableCreated"): EventFragment;
}

export type DiceRolledEvent = TypedEvent<
  [BigNumber, BigNumber, string] & {
    index: BigNumber;
    blockNumber: BigNumber;
    random: string;
  }
>;

export type RoleAdminChangedEvent = TypedEvent<
  [string, string, string] & {
    role: string;
    previousAdminRole: string;
    newAdminRole: string;
  }
>;

export type RoleGrantedEvent = TypedEvent<
  [string, string, string] & { role: string; account: string; sender: string }
>;

export type RoleRevokedEvent = TypedEvent<
  [string, string, string] & { role: string; account: string; sender: string }
>;

export type StartedEvent = TypedEvent<
  [string, BigNumber] & { id: string; roll: BigNumber }
>;

export type TableCreatedEvent = TypedEvent<[string] & { id: string }>;

export class DelphsTable extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: DelphsTableInterface;

  functions: {
    ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;

    blockOfRoll(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    createAndStart(
      id: BytesLike,
      playerAddresses: string[],
      statSeeds: BytesLike[],
      length: BigNumberish,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    createTable(
      id: BytesLike,
      playerAddresses: string[],
      statSeeds: BytesLike[],
      length: BigNumberish,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    destinations(
      arg0: BytesLike,
      arg1: BigNumberish,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, BigNumber] & {
        player: string;
        x: BigNumber;
        y: BigNumber;
      }
    >;

    destinationsForRoll(
      id: BytesLike,
      roll: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        ([string, BigNumber, BigNumber] & {
          player: string;
          x: BigNumber;
          y: BigNumber;
        })[]
      ]
    >;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<[string]>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isTrustedForwarder(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    latestRoll(overrides?: CallOverrides): Promise<[BigNumber]>;

    players(id: BytesLike, overrides?: CallOverrides): Promise<[string[]]>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    rollTheDice(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    roller(overrides?: CallOverrides): Promise<[string]>;

    rolls(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    seeds(id: BytesLike, overrides?: CallOverrides): Promise<[string[]]>;

    setDestination(
      id: BytesLike,
      x: BigNumberish,
      y: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    start(
      id: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    statsForPlayer(
      id: BytesLike,
      playerAddress: string,
      overrides?: CallOverrides
    ): Promise<
      [
        [BigNumber, BigNumber, BigNumber] & {
          attack: BigNumber;
          defense: BigNumber;
          health: BigNumber;
        }
      ]
    >;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    tables(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber, BigNumber] & {
        id: string;
        owner: string;
        startedAt: BigNumber;
        gameLength: BigNumber;
      }
    >;
  };

  ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

  DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

  blockOfRoll(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  createAndStart(
    id: BytesLike,
    playerAddresses: string[],
    statSeeds: BytesLike[],
    length: BigNumberish,
    owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  createTable(
    id: BytesLike,
    playerAddresses: string[],
    statSeeds: BytesLike[],
    length: BigNumberish,
    owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  destinations(
    arg0: BytesLike,
    arg1: BigNumberish,
    arg2: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [string, BigNumber, BigNumber] & {
      player: string;
      x: BigNumber;
      y: BigNumber;
    }
  >;

  destinationsForRoll(
    id: BytesLike,
    roll: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    ([string, BigNumber, BigNumber] & {
      player: string;
      x: BigNumber;
      y: BigNumber;
    })[]
  >;

  getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

  grantRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  hasRole(
    role: BytesLike,
    account: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isTrustedForwarder(
    forwarder: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  latestRoll(overrides?: CallOverrides): Promise<BigNumber>;

  players(id: BytesLike, overrides?: CallOverrides): Promise<string[]>;

  renounceRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  revokeRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  rollTheDice(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  roller(overrides?: CallOverrides): Promise<string>;

  rolls(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  seeds(id: BytesLike, overrides?: CallOverrides): Promise<string[]>;

  setDestination(
    id: BytesLike,
    x: BigNumberish,
    y: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  start(
    id: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  statsForPlayer(
    id: BytesLike,
    playerAddress: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber] & {
      attack: BigNumber;
      defense: BigNumber;
      health: BigNumber;
    }
  >;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  tables(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    [string, string, BigNumber, BigNumber] & {
      id: string;
      owner: string;
      startedAt: BigNumber;
      gameLength: BigNumber;
    }
  >;

  callStatic: {
    ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

    blockOfRoll(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createAndStart(
      id: BytesLike,
      playerAddresses: string[],
      statSeeds: BytesLike[],
      length: BigNumberish,
      owner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    createTable(
      id: BytesLike,
      playerAddresses: string[],
      statSeeds: BytesLike[],
      length: BigNumberish,
      owner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    destinations(
      arg0: BytesLike,
      arg1: BigNumberish,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, BigNumber] & {
        player: string;
        x: BigNumber;
        y: BigNumber;
      }
    >;

    destinationsForRoll(
      id: BytesLike,
      roll: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      ([string, BigNumber, BigNumber] & {
        player: string;
        x: BigNumber;
        y: BigNumber;
      })[]
    >;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isTrustedForwarder(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    latestRoll(overrides?: CallOverrides): Promise<BigNumber>;

    players(id: BytesLike, overrides?: CallOverrides): Promise<string[]>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    rollTheDice(overrides?: CallOverrides): Promise<BigNumber>;

    roller(overrides?: CallOverrides): Promise<string>;

    rolls(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    seeds(id: BytesLike, overrides?: CallOverrides): Promise<string[]>;

    setDestination(
      id: BytesLike,
      x: BigNumberish,
      y: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    start(id: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    statsForPlayer(
      id: BytesLike,
      playerAddress: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        attack: BigNumber;
        defense: BigNumber;
        health: BigNumber;
      }
    >;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    tables(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber, BigNumber] & {
        id: string;
        owner: string;
        startedAt: BigNumber;
        gameLength: BigNumber;
      }
    >;
  };

  filters: {
    "DiceRolled(uint256,uint256,bytes32)"(
      index?: BigNumberish | null,
      blockNumber?: BigNumberish | null,
      random?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber, string],
      { index: BigNumber; blockNumber: BigNumber; random: string }
    >;

    DiceRolled(
      index?: BigNumberish | null,
      blockNumber?: BigNumberish | null,
      random?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber, string],
      { index: BigNumber; blockNumber: BigNumber; random: string }
    >;

    "RoleAdminChanged(bytes32,bytes32,bytes32)"(
      role?: BytesLike | null,
      previousAdminRole?: BytesLike | null,
      newAdminRole?: BytesLike | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; previousAdminRole: string; newAdminRole: string }
    >;

    RoleAdminChanged(
      role?: BytesLike | null,
      previousAdminRole?: BytesLike | null,
      newAdminRole?: BytesLike | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; previousAdminRole: string; newAdminRole: string }
    >;

    "RoleGranted(bytes32,address,address)"(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    RoleGranted(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    "RoleRevoked(bytes32,address,address)"(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    RoleRevoked(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    "Started(bytes32,uint256)"(
      id?: BytesLike | null,
      roll?: BigNumberish | null
    ): TypedEventFilter<[string, BigNumber], { id: string; roll: BigNumber }>;

    Started(
      id?: BytesLike | null,
      roll?: BigNumberish | null
    ): TypedEventFilter<[string, BigNumber], { id: string; roll: BigNumber }>;

    "TableCreated(bytes32)"(
      id?: BytesLike | null
    ): TypedEventFilter<[string], { id: string }>;

    TableCreated(
      id?: BytesLike | null
    ): TypedEventFilter<[string], { id: string }>;
  };

  estimateGas: {
    ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    blockOfRoll(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createAndStart(
      id: BytesLike,
      playerAddresses: string[],
      statSeeds: BytesLike[],
      length: BigNumberish,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    createTable(
      id: BytesLike,
      playerAddresses: string[],
      statSeeds: BytesLike[],
      length: BigNumberish,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    destinations(
      arg0: BytesLike,
      arg1: BigNumberish,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    destinationsForRoll(
      id: BytesLike,
      roll: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isTrustedForwarder(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    latestRoll(overrides?: CallOverrides): Promise<BigNumber>;

    players(id: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    rollTheDice(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    roller(overrides?: CallOverrides): Promise<BigNumber>;

    rolls(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    seeds(id: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    setDestination(
      id: BytesLike,
      x: BigNumberish,
      y: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    start(
      id: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    statsForPlayer(
      id: BytesLike,
      playerAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tables(arg0: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    ADMIN_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    DEFAULT_ADMIN_ROLE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    blockOfRoll(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    createAndStart(
      id: BytesLike,
      playerAddresses: string[],
      statSeeds: BytesLike[],
      length: BigNumberish,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    createTable(
      id: BytesLike,
      playerAddresses: string[],
      statSeeds: BytesLike[],
      length: BigNumberish,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    destinations(
      arg0: BytesLike,
      arg1: BigNumberish,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    destinationsForRoll(
      id: BytesLike,
      roll: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isTrustedForwarder(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    latestRoll(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    players(
      id: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    rollTheDice(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    roller(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rolls(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    seeds(
      id: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setDestination(
      id: BytesLike,
      x: BigNumberish,
      y: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    start(
      id: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    statsForPlayer(
      id: BytesLike,
      playerAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tables(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
