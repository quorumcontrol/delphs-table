//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./interfaces/IPlayer.sol";

contract Player is IPlayer {
    mapping (address => mapping(address => bool)) public devices;
    mapping (address => string) public name;
    mapping (address => address) public deviceToPlayer;

    function setUsername(string calldata _name) public returns (bool) {
        name[msg.sender] = _name;
        return true;
    }

    function addDevice(address addr) public returns (bool) {
        devices[msg.sender][addr] = true;
        deviceToPlayer[addr] = msg.sender;
        return true;
    }

    function removeDevice(address addr) external returns (bool) {
        delete devices[msg.sender][addr];
        delete deviceToPlayer[addr];
        return true;
    }

    function initializePlayer(string calldata _name, address device) external returns (bool) {
        setUsername(_name);
        addDevice(device);
        deviceToPlayer[msg.sender] = msg.sender; // map the player themselves as a device
        return true;
    }

    function isInitialized(address player) external view returns (bool) {
        return deviceToPlayer[player] == player;
    }

}
