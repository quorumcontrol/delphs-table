//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./interfaces/IPlayer.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

error Unauthorized();

contract Lobby is AccessControl {
    using EnumerableSet for EnumerableSet.AddressSet;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    event RegisteredInterest(address indexed player);
    event GameStarted(address indexed player, bytes32 indexed notes);

    IPlayer public immutable player;

    EnumerableSet.AddressSet private waiting;

    constructor(address playerAddress, address initialOwner) {
        player = IPlayer(playerAddress);
        _setupRole(ADMIN_ROLE, initialOwner);
    }

    function registerInterest() public {
        address sender = msgSender();
        waiting.add(sender);
        emit RegisteredInterest(sender);
    }

    function takeAddresses(address[] calldata addresses, bytes32 notes) public {
        if (!hasRole(ADMIN_ROLE, msgSender())) {
            revert Unauthorized();
        }
        uint256 len = addresses.length;
        for (uint256 i = 0; i < len; i++) {
            address addr = addresses[i];
            waiting.remove(addr);
            emit GameStarted(addr, notes);
        }
    }

    function cleanAddresses(address[] calldata addresses) public {
        if (!hasRole(ADMIN_ROLE, msgSender())) {
            revert Unauthorized();
        }
        uint256 len = addresses.length;
        for (uint256 i = 0; i < len; i++) {
            waiting.remove(addresses[i]);
        }
    }

    function waitingAddresses() external view returns (address[] memory) {
      return waiting.values();
    }

    function msgSender() private view returns (address) {
        address sender = player.deviceToPlayer(msg.sender);
        if (sender == address(0)) {
            return msg.sender;
        }
        return sender;
    }
}
