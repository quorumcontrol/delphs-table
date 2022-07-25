//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./interfaces/IDiceRoller.sol";
import "./interfaces/IPlayer.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

error NoTwoRollsPerBlock();
error Unauthorized();
error AlreadyExists();
error AlreadyStarted();

contract DelphsTable is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    event DiceRolled(
        uint256 indexed index,
        uint256 indexed blockNumber,
        bytes32 random
    );
    event Started(bytes32 indexed id, uint256 indexed roll);
    event TableCreated(bytes32 indexed id);

    IDiceRoller public immutable roller;
    IPlayer public immutable player;

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
        uint256 startedAt; // the roll number started at
        uint256 gameLength; // number of rolls to play
    }

    struct Stats {
        uint256 attack;
        uint256 defense;
        uint256 health;
    }

    constructor(
        address diceRollerAddress,
        address playerAddress,
        address initialOwner
    ) {
        roller = IDiceRoller(diceRollerAddress);
        player = IPlayer(playerAddress);
        _setupRole(ADMIN_ROLE, initialOwner);
    }

    function rollTheDice() public returns (uint256) {
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

    function createTable(
        bytes32 id,
        address[] calldata playerAddresses,
        bytes32[] calldata statSeeds,
        uint256 length,
        address owner
    ) public {
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

    function start(bytes32 id) public returns (uint256) {
        Table storage table = tables[id];
        if (msgSender() != table.owner) {
            revert Unauthorized();
        }
        if (table.startedAt > 0) {
            revert AlreadyStarted();
        }
        uint firstRoll = latestRoll + 1;
        table.startedAt = firstRoll;
        emit Started(id, firstRoll);
        return firstRoll;
    }

    function players(bytes32 id) public view returns (address[] memory) {
        return tables[id].players;
    }

    function seeds(bytes32 id) public view returns (bytes32[] memory) {
        return tables[id].seeds;
    }

    function statsForPlayer(bytes32 id, address playerAddress)
        public
        view
        returns (Stats memory)
    {
        Table storage table = tables[id];
        //use the roll from the start (which was unknown to the table starter)
        bytes32 rnd = rolls[table.startedAt];

        return
            Stats({
                attack: uintMax(determinsticRandom(
                    rnd,
                    abi.encodePacked(playerAddress, "a"),
                    1000
                ), 400),
                defense: uintMax(determinsticRandom(
                    rnd,
                    abi.encodePacked(playerAddress, "d"),
                    800
                ), 200),
                health: uintMax(determinsticRandom(
                    rnd,
                    abi.encodePacked(playerAddress, "h"),
                    700
                ), 200)
            });
    }

    function determinsticRandom(
        bytes32 seed,
        bytes memory additional,
        uint256 max
    ) private pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(seed, additional))) % max;
    }

    function destinationsForRoll(bytes32 id, uint256 roll)
        public
        view
        returns (Destination[] memory)
    {
        return destinations[id][roll];
    }

    function setDestination(
        bytes32 id,
        int64 x,
        int64 y
    ) public returns (bool) {
        address sender = msgSender();
        Table storage table = tables[id];
        if (!includes(table.players, sender)) {
            revert Unauthorized();
        }

        destinations[id][latestRoll].push(
            Destination({x: x, y: y, player: sender})
        );

        return true;
    }

    function includes(address[] storage arry, address val)
        private
        view
        returns (bool)
    {
        uint256 len = arry.length;
        for (uint256 i = 0; i < len; i++) {
            if (arry[i] == val) {
                return true;
            }
        }
        return false;
    }

    function uintMax(uint a, uint b) private pure returns (uint) {
        if (a >= b) {
            return a;
        }
        return b;
    }

    function msgSender() private view returns (address) {
        address sender = player.deviceToPlayer(msg.sender);
        if (sender == address(0)) {
            return msg.sender;
        }
        return sender;
    }
}
