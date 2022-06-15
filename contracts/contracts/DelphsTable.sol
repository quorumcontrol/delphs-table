//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./interfaces/IDiceRoller.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

error NoTwoRollsPerBlock();
error Unauthorized();
error AlreadyExists();

contract DelphsTable is AccessControl {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  event DiceRolled(uint indexed index, uint256 indexed blockNumber, bytes32 random);
  event TableCreated(bytes32 indexed id);

  IDiceRoller immutable public roller;

  uint256 public latestRoll;
  mapping(uint256 => bytes32) public rolls;
  mapping(uint256 => uint256) public blockOfRoll;

  mapping(bytes32 => mapping(address => Destination)) public destinations;

  mapping(bytes32 => Table) public tables;

  struct Destination {
    // the roll this was set at 
    uint setAt;
    int64 x;
    int64 y;
  }

  struct Table {
    bytes32 id;
    address[] players;
    bytes32[] seeds;
    address owner;
    uint startedAt; // the roll number started at
    uint gameLength; // number of rolls to play
  }

  constructor(address diceRollerAddress, address initialOwner) {
    roller = IDiceRoller(diceRollerAddress);
    _setupRole(ADMIN_ROLE, initialOwner);
  }

  function rollTheDice() public returns (uint) {
    if (blockOfRoll[latestRoll] == block.number) {
      revert NoTwoRollsPerBlock();
    }
    bytes32 rnd = roller.getRandom();
    rolls[latestRoll + 1] = rnd;
    blockOfRoll[latestRoll + 1] = block.number;
    latestRoll++;
    emit DiceRolled(latestRoll, block.number, rnd);
    return latestRoll;
  }

  function createTable(bytes32 id, address[] calldata players, bytes32[] calldata statSeeds, uint256 length, address owner) public {
    if (!hasRole(ADMIN_ROLE, msg.sender)) {
      revert Unauthorized();
    }
    Table storage table = tables[id];
    if (table.players.length > 0) {
      revert AlreadyExists();
    }
    tables[id] = Table({
      id: id,
      players: players,
      seeds: statSeeds,
      gameLength: length,
      owner: owner,
      startedAt: 0
    });
    emit TableCreated(id);
  }

  function start(bytes32 id) public returns (uint) {
    Table storage table = tables[id];
    if (msg.sender != table.owner) {
      revert Unauthorized();
    }
    table.startedAt = latestRoll + 1;
    return latestRoll + 1;
  }

  function players(bytes32 id) public view returns (address[] memory) {
    return tables[id].players;
  }

  function seeds(bytes32 id) public view returns (bytes32[] memory) {
    return tables[id].seeds;
  }

}
