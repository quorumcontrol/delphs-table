//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Player {
    mapping (address => mapping(address => bool)) public devices;
    mapping (address => string) public name;

    function setUsername(string calldata _name) public returns (bool) {
        name[msg.sender] = _name;
        return true;
    }

    function addDevice(address addr) public returns (bool) {
        devices[msg.sender][addr] = true;
        return true;
    }

    function removeDevice(address addr) external returns (bool) {
        devices[msg.sender][addr] = false;
        return true;
    }

    function setUsernameAndDevice(string calldata _name, address device) external returns (bool) {
        setUsername(_name);
        addDevice(device);
        return true;
    }
}
