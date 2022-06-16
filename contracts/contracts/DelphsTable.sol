//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./interfaces/IDiceRoller.sol";
import "./interfaces/IPlayer.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

error NoTwoRollsPerBlock();
error Unauthorized();
error AlreadyExists();

contract DelphsTable is AccessControl {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  event DiceRolled(uint indexed index, uint256 indexed blockNumber, bytes32 random);
  event TableCreated(bytes32 indexed id);

  IDiceRoller immutable public roller;
  IPlayer immutable public player;

  uint256 public latestRoll;
  mapping(uint256 => bytes32) public rolls;
  mapping(uint256 => uint256) public blockOfRoll;

  mapping(bytes32 => mapping(uint256 => Destination[])) public destinations;

  mapping(bytes32 => Table) public tables;

  struct Destination {
    address player;
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
  
  struct Stats {
    uint256 attack;
    uint256 defense;
    uint256 health;
  }

  constructor(address diceRollerAddress, address playerAddress, address initialOwner) {
    roller = IDiceRoller(diceRollerAddress);
    player = IPlayer(playerAddress);
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

  function createTable(bytes32 id, address[] calldata playerAddresses, bytes32[] calldata statSeeds, uint256 length, address owner) public {
    if (!hasRole(ADMIN_ROLE, msgSender())) {
      revert Unauthorized();
    }
    Table storage table = tables[id];
    if (table.players.length > 0) {
      revert AlreadyExists();
    }
    tables[id] = Table({
      id: id,
      players: playerAddresses,
      seeds: statSeeds,
      gameLength: length,
      owner: owner,
      startedAt: 0
    });
    emit TableCreated(id);
  }

  function start(bytes32 id) public returns (uint) {
    Table storage table = tables[id];
    if (msgSender() != table.owner) {
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

  function statsForPlayer(bytes32 id, address playerAddress) public view returns (Stats memory) {
    Table storage table = tables[id];
    //use the roll from the start (which was unknown to the table starter)
    bytes32 rnd = rolls[table.startedAt];

    return Stats({
      attack: determinsticRandom(rnd, abi.encodePacked(playerAddress, "a"), 1000),
      defense: determinsticRandom(rnd, abi.encodePacked(playerAddress, "d"), 900),
      health: determinsticRandom(rnd, abi.encodePacked(playerAddress, "h"), 2000)
    });
  }

  function determinsticRandom(bytes32 seed, bytes memory additional, uint256 max) private pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(seed, additional))) % max;
  }

  function destinationsForRoll(bytes32 id, uint256 roll) public view returns (Destination[] memory) {
    return destinations[id][roll];
  }

  function setDestination(bytes32 id, int64 x, int64 y) public returns (bool) {
    address sender = msgSender();
    Table storage table = tables[id];
    if (!includes(table.players, sender)) {
      revert Unauthorized();
    }

    destinations[id][latestRoll].push(Destination({
      x: x,
      y: y,
      player: sender
    }));

    return true;
  }

  function includes(address[] storage arry, address val) private view returns (bool) {
    uint256 len = arry.length;
    for (uint i = 0; i < len; i++) {
      if (arry[i] == val) {
        return true;
      }
    }
    return false;
  }

  function msgSender() private view returns (address) {
    address sender = player.deviceToPlayer(msg.sender);
    if (sender == address(0)) {
      return msg.sender;
    }
    return sender;
  }

}
