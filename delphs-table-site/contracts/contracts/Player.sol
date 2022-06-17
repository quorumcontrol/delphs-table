//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./interfaces/IPlayer.sol";

error UsernameAlreadyClaimed();

contract Player is IPlayer {
    event DeviceAdded(address indexed device, address indexed player);
    event DeviceRemoved(address indexed device, address indexed player);
    event PlayerInitialized(address indexed player, string username);
    event UserNameChanged(address indexed player, string username);

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
        emit UserNameChanged(sender, _name);
        return true;
    }

    function addDevice(address payable addr) public payable returns (bool) {
        devices[msg.sender][addr] = true;
        deviceToPlayer[addr] = msg.sender;
        addr.transfer(msg.value);
        emit DeviceAdded(addr, msg.sender);
        return true;
    }

    function removeDevice(address addr) external returns (bool) {
        delete devices[msg.sender][addr];
        delete deviceToPlayer[addr];
        emit DeviceRemoved(addr, msg.sender);
        return true;
    }

    function initializePlayer(string calldata _name, address payable device) payable external returns (bool) {
        deviceToPlayer[msg.sender] = msg.sender; // map the player themselves as a device
        setUsername(_name);
        addDevice(device);
        emit PlayerInitialized(msg.sender, _name);
        return true;
    }

    function isInitialized(address player) external view returns (bool) {
        return deviceToPlayer[player] == player;
    }

}
