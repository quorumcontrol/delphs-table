//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

error Unauthorized();

contract OrchestratorState is AccessControl {
  using EnumerableSet for EnumerableSet.Bytes32Set;

  event TableAdded(bytes32 indexed tableId);
  event TableRemoved(bytes32 indexed tableId);

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  EnumerableSet.Bytes32Set private _activeTables;

  constructor(address initialOwner) {
    // do the access control
    _setupRole(ADMIN_ROLE, initialOwner);
    _setupRole(DEFAULT_ADMIN_ROLE, initialOwner);
  }

  function add(bytes32 tableId) external returns (bool) {
    if (!hasRole(ADMIN_ROLE, msg.sender)) {
      revert Unauthorized();
    }
    _activeTables.add(tableId);
    emit TableAdded(tableId);
    return true;
  }

  function remove(bytes32 tableId) external returns (bool) {
    if (!hasRole(ADMIN_ROLE, msg.sender)) {
      revert Unauthorized();
    }
    _activeTables.remove(tableId);
    emit TableRemoved(tableId);
    return true;
  }

  function bulkRemove(bytes32[] calldata tableIds) external returns (bool) {
    uint256 len = tableIds.length;
    for (uint256 i = 0; i < len; i++) {
      _activeTables.remove(tableIds[i]);
    }
    return true;
  }

  function all() external view returns (bytes32[] memory ids) {
    return _activeTables.values();
  }

}