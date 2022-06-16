//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./interfaces/IPlayer.sol";

error UsernameAlreadyClaimed();

contract Player is IPlayer {
    mapping (address => mapping(address => bool)) public devices;
    mapping (address => string) public name;
    mapping (string => address) public usernameToAddress;
    mapping (address => address) public deviceToPlayer;

    function setUsername(string calldata _name) public returns (bool) {
        address sender = deviceToPlayer[msg.sender];
        address existing = usernameToAddress[_name];
        if (!(existing == sender || existing == address(0))) {
            revert UsernameAlreadyClaimed();
        }
        delete usernameToAddress[name[sender]];
        name[sender] = _name;
        usernameToAddress[_name] = sender;
        return true;
    }

    function addDevice(address payable addr) public payable returns (bool) {
        devices[msg.sender][addr] = true;
        deviceToPlayer[addr] = msg.sender;
        addr.transfer(msg.value);
        return true;
    }

    function removeDevice(address addr) external returns (bool) {
        delete devices[msg.sender][addr];
        delete deviceToPlayer[addr];
        return true;
    }

    function initializePlayer(string calldata _name, address payable device) payable external returns (bool) {
        deviceToPlayer[msg.sender] = msg.sender; // map the player themselves as a device
        setUsername(_name);
        addDevice(device);
        return true;
    }

    function isInitialized(address player) external view returns (bool) {
        return deviceToPlayer[player] == player;
    }

}
