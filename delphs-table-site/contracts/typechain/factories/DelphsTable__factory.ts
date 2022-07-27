/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { DelphsTable, DelphsTableInterface } from "../DelphsTable";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "diceRollerAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "playerAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "initialOwner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AlreadyExists",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadyStarted",
    type: "error",
  },
  {
    inputs: [],
    name: "NoTwoRollsPerBlock",
    type: "error",
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "random",
        type: "bytes32",
      },
    ],
    name: "DiceRolled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "roll",
        type: "uint256",
      },
    ],
    name: "Started",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "TableCreated",
    type: "event",
  },
  {
    inputs: [],
    name: "ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "blockOfRoll",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "address[]",
        name: "playerAddresses",
        type: "address[]",
      },
      {
        internalType: "bytes32[]",
        name: "statSeeds",
        type: "bytes32[]",
      },
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "createAndStart",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "address[]",
        name: "playerAddresses",
        type: "address[]",
      },
      {
        internalType: "bytes32[]",
        name: "statSeeds",
        type: "bytes32[]",
      },
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "createTable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "destinations",
    outputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        internalType: "int64",
        name: "x",
        type: "int64",
      },
      {
        internalType: "int64",
        name: "y",
        type: "int64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "roll",
        type: "uint256",
      },
    ],
    name: "destinationsForRoll",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "player",
            type: "address",
          },
          {
            internalType: "int64",
            name: "x",
            type: "int64",
          },
          {
            internalType: "int64",
            name: "y",
            type: "int64",
          },
        ],
        internalType: "struct DelphsTable.Destination[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoll",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "player",
    outputs: [
      {
        internalType: "contract IPlayer",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "players",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rollTheDice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "roller",
    outputs: [
      {
        internalType: "contract IDiceRoller",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "rolls",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "seeds",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "int64",
        name: "x",
        type: "int64",
      },
      {
        internalType: "int64",
        name: "y",
        type: "int64",
      },
    ],
    name: "setDestination",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "start",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "playerAddress",
        type: "address",
      },
    ],
    name: "statsForPlayer",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "attack",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "defense",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "health",
            type: "uint256",
          },
        ],
        internalType: "struct DelphsTable.Stats",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "tables",
    outputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gameLength",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60c06040523480156200001157600080fd5b5060405162001a1838038062001a18833981016040819052620000349162000149565b6001600160a01b03808416608052821660a052620000737fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775826200007c565b50505062000193565b6200008882826200008c565b5050565b6000828152602081815260408083206001600160a01b038516845290915290205460ff1662000088576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055620000e83390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b80516001600160a01b03811681146200014457600080fd5b919050565b6000806000606084860312156200015f57600080fd5b6200016a846200012c565b92506200017a602085016200012c565b91506200018a604085016200012c565b90509250925092565b60805160a051611851620001c7600039600081816102880152610e2901526000818161020101526107fd01526118516000f3fe608060405234801561001057600080fd5b50600436106101585760003560e01c806375b238fc116100c3578063a217fddf1161007c578063a217fddf146103b0578063ae383a4d146103b8578063d3098b9a146103c1578063d547741f14610429578063e0e543d01461043c578063f15c95491461045c57600080fd5b806375b238fc146103065780637d789dee1461032d578063863d928814610335578063907efe001461034857806391d148541461037d5780639424732e1461039057600080fd5b80632f2ff15d116101155780632f2ff15d1461023b578063361508521461025057806336568abe1461027057806348db5f89146102835780635d69f16c146102aa5780637213b814146102ca57600080fd5b8063015a18ed1461015d57806301ffc9a71461018357806313870132146101a6578063248a9ca3146101b95780632d1dc122146101dc5780632f09177d146101fc575b600080fd5b61017061016b366004611326565b61046f565b6040519081526020015b60405180910390f35b61019661019136600461133f565b61052b565b604051901515815260200161017a565b6101966101b436600461137b565b610562565b6101706101c7366004611326565b60009081526020819052604090206001015490565b6101706101ea366004611326565b60036020526000908152604090205481565b6102237f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200161017a565b61024e6102493660046113cc565b610654565b005b61026361025e366004611326565b61067e565b60405161017a91906113fc565b61024e61027e3660046113cc565b6106e3565b6102237f000000000000000000000000000000000000000000000000000000000000000081565b6101706102b8366004611326565b60026020526000908152604090205481565b6102dd6102d8366004611440565b610766565b604080516001600160a01b039094168452600792830b6020850152910b9082015260600161017a565b6101707fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c2177581565b6101706107c7565b61024e6103433660046114b8565b610928565b61035b6103563660046113cc565b61094a565b604080518251815260208084015190820152918101519082015260600161017a565b61019661038b3660046113cc565b610adb565b6103a361039e366004611326565b610b04565b60405161017a919061154f565b610170600081565b61017060015481565b6104016103cf366004611326565b6005602081905260009182526040909120805460038201546004830154929093015490926001600160a01b0316919084565b604080519485526001600160a01b03909316602085015291830152606082015260800161017a565b61024e6104373660046113cc565b610b72565b61044f61044a366004611590565b610b97565b60405161017a91906115b2565b61024e61046a3660046114b8565b610c37565b600081815260056020526040812060038101546001600160a01b0316610493610e07565b6001600160a01b0316146104b9576040516282b42960e81b815260040160405180910390fd5b6004810154156104dc57604051631fbde44560e01b815260040160405180910390fd5b600060015460016104ed9190611632565b60048301819055604051909150819085907f3a5803cb6dcb9c83b0584d712b7825e7e9fa6243be3cde9e798681f5c091e65c90600090a39392505050565b60006001600160e01b03198216637965db0b60e01b148061055c57506301ffc9a760e01b6001600160e01b03198316145b92915050565b60008061056d610e07565b600086815260056020526040902090915061058b6001820183610eb0565b6105a7576040516282b42960e81b815260040160405180910390fd5b50600094855260046020908152604080872060018054895290835281882082516060810184526001600160a01b039586168152600798890b8186019081529790980b92880192835280548083018255908952929097209551600290920290950180549451919092166001600160e01b031990941693909317600160a01b67ffffffffffffffff948516021781559251928401805467ffffffffffffffff1916939092169290921790555090565b60008281526020819052604090206001015461066f81610f1d565b6106798383610f2a565b505050565b6000818152600560209081526040918290206002018054835181840281018401909452808452606093928301828280156106d757602002820191906000526020600020905b8154815260200190600101908083116106c3575b50505050509050919050565b6001600160a01b03811633146107585760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6107628282610fae565b5050565b6004602052826000526040600020602052816000526040600020818154811061078e57600080fd5b6000918252602090912060029091020180546001909101546001600160a01b0382169450600160a01b909104600790810b93500b905083565b6001546000908152600360205260408120544390036107f9576040516374f70e7960e11b815260040160405180910390fd5b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663aacc5a176040518163ffffffff1660e01b8152600401602060405180830381865afa158015610859573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061087d919061164a565b9050806002600060015460016108939190611632565b815260200190815260200160002081905550436003600060015460016108b99190611632565b815260200190815260200160002081905550600160008154809291906108de90611663565b9190505550436001547f61a648c0140ef625babe35b3bc5ba2a28852bd10a17c53f6d9f3831b21096cd78360405161091891815260200190565b60405180910390a3505060015490565b61093787878787878787610c37565b6109408761046f565b5050505050505050565b61096e60405180606001604052806000815260200160008152602001600081525090565b600083815260056020908152604080832060048101548452600290925290912054806109cb5760405162461bcd60e51b815260206004820152600c60248201526b1b9bc81cdd185d1cc81e595d60a21b604482015260640161074f565b604080516060810190915280610a27610a1f84610a08896080860160609190911b6001600160601b0319168152606160f81b601482015260150190565b6040516020818303038152906040526103e8611013565b610190611054565b8152602001610a7f610a788488604051602001610a61919060609190911b6001600160601b0319168152601960fa1b601482015260150190565b604051602081830303815290604052610320611013565b60c8611054565b8152602001610ad0610a788488604051602001610ab9919060609190911b6001600160601b0319168152600d60fb1b601482015260150190565b6040516020818303038152906040526102bc611013565b905295945050505050565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b6000818152600560209081526040918290206001018054835181840281018401909452808452606093928301828280156106d757602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610b495750505050509050919050565b600082815260208190526040902060010154610b8d81610f1d565b6106798383610fae565b60008281526004602090815260408083208484528252808320805482518185028101850190935280835260609492939192909184015b82821015610c2b576000848152602090819020604080516060810182526002860290920180546001600160a01b0381168452600160a01b9004600790810b84860152600191820154900b918301919091529083529092019101610bcd565b50505050905092915050565b610c637fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c2177561038b610e07565b610c7f576040516282b42960e81b815260040160405180910390fd5b6000878152600560205260409020600181015415610cb05760405163119b4fd360e11b815260040160405180910390fd5b6040518060c00160405280898152602001888880806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250505090825250604080516020888102828101820190935288825292830192909189918991829185019084908082843760009201829052509385525050506001600160a01b038516602080840191909152604080840183905260609093018790528b825260058152919020825181558282015180519192610d7992600185019290910190611271565b5060408201518051610d959160028401916020909101906112d6565b5060608201516003820180546001600160a01b0319166001600160a01b039092169190911790556080820151600482015560a09091015160059091015560405188907fff39e0eaf58742100b3d96f355f818806f2c4c75c3fb9c8ff1101305924884fa90600090a25050505050505050565b6040516336ec7a7760e01b815233600482015260009081906001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906336ec7a7790602401602060405180830381865afa158015610e70573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e94919061167c565b90506001600160a01b038116610eab573391505090565b919050565b8154600090815b81811015610f1257836001600160a01b0316858281548110610edb57610edb611699565b6000918252602090912001546001600160a01b031603610f005760019250505061055c565b80610f0a81611663565b915050610eb7565b506000949350505050565b610f27813361106a565b50565b610f348282610adb565b610762576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055610f6a3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b610fb88282610adb565b15610762576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b60008184846040516020016110299291906116df565b6040516020818303038152906040528051906020012060001c61104c9190611705565b949350505050565b600081831061106457508161055c565b50919050565b6110748282610adb565b6107625761108c816001600160a01b031660146110ce565b6110978360206110ce565b6040516020016110a8929190611727565b60408051601f198184030181529082905262461bcd60e51b825261074f9160040161179c565b606060006110dd8360026117cf565b6110e8906002611632565b67ffffffffffffffff811115611100576111006117ee565b6040519080825280601f01601f19166020018201604052801561112a576020820181803683370190505b509050600360fc1b8160008151811061114557611145611699565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061117457611174611699565b60200101906001600160f81b031916908160001a90535060006111988460026117cf565b6111a3906001611632565b90505b600181111561121b576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106111d7576111d7611699565b1a60f81b8282815181106111ed576111ed611699565b60200101906001600160f81b031916908160001a90535060049490941c9361121481611804565b90506111a6565b50831561126a5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161074f565b9392505050565b8280548282559060005260206000209081019282156112c6579160200282015b828111156112c657825182546001600160a01b0319166001600160a01b03909116178255602090920191600190910190611291565b506112d2929150611311565b5090565b8280548282559060005260206000209081019282156112c6579160200282015b828111156112c65782518255916020019190600101906112f6565b5b808211156112d25760008155600101611312565b60006020828403121561133857600080fd5b5035919050565b60006020828403121561135157600080fd5b81356001600160e01b03198116811461126a57600080fd5b8035600781900b8114610eab57600080fd5b60008060006060848603121561139057600080fd5b833592506113a060208501611369565b91506113ae60408501611369565b90509250925092565b6001600160a01b0381168114610f2757600080fd5b600080604083850312156113df57600080fd5b8235915060208301356113f1816113b7565b809150509250929050565b6020808252825182820181905260009190848201906040850190845b8181101561143457835183529284019291840191600101611418565b50909695505050505050565b60008060006060848603121561145557600080fd5b505081359360208301359350604090920135919050565b60008083601f84011261147e57600080fd5b50813567ffffffffffffffff81111561149657600080fd5b6020830191508360208260051b85010111156114b157600080fd5b9250929050565b600080600080600080600060a0888a0312156114d357600080fd5b87359650602088013567ffffffffffffffff808211156114f257600080fd5b6114fe8b838c0161146c565b909850965060408a013591508082111561151757600080fd5b506115248a828b0161146c565b90955093505060608801359150608088013561153f816113b7565b8091505092959891949750929550565b6020808252825182820181905260009190848201906040850190845b818110156114345783516001600160a01b03168352928401929184019160010161156b565b600080604083850312156115a357600080fd5b50508035926020909101359150565b602080825282518282018190526000919060409081850190868401855b8281101561160f57815180516001600160a01b0316855286810151600790810b8887015290860151900b85850152606090930192908501906001016115cf565b5091979650505050505050565b634e487b7160e01b600052601160045260246000fd5b600082198211156116455761164561161c565b500190565b60006020828403121561165c57600080fd5b5051919050565b6000600182016116755761167561161c565b5060010190565b60006020828403121561168e57600080fd5b815161126a816113b7565b634e487b7160e01b600052603260045260246000fd5b60005b838110156116ca5781810151838201526020016116b2565b838111156116d9576000848401525b50505050565b828152600082516116f78160208501602087016116af565b919091016020019392505050565b60008261172257634e487b7160e01b600052601260045260246000fd5b500690565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835161175f8160178501602088016116af565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516117908160288401602088016116af565b01602801949350505050565b60208152600082518060208401526117bb8160408501602087016116af565b601f01601f19169190910160400192915050565b60008160001904831182151516156117e9576117e961161c565b500290565b634e487b7160e01b600052604160045260246000fd5b6000816118135761181361161c565b50600019019056fea2646970667358221220ab130e7528b7103bb999e54bd936403d44d5164d731c21129c394d64a68c5d8264736f6c634300080e0033";

export class DelphsTable__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    diceRollerAddress: string,
    playerAddress: string,
    initialOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<DelphsTable> {
    return super.deploy(
      diceRollerAddress,
      playerAddress,
      initialOwner,
      overrides || {}
    ) as Promise<DelphsTable>;
  }
  getDeployTransaction(
    diceRollerAddress: string,
    playerAddress: string,
    initialOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      diceRollerAddress,
      playerAddress,
      initialOwner,
      overrides || {}
    );
  }
  attach(address: string): DelphsTable {
    return super.attach(address) as DelphsTable;
  }
  connect(signer: Signer): DelphsTable__factory {
    return super.connect(signer) as DelphsTable__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DelphsTableInterface {
    return new utils.Interface(_abi) as DelphsTableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DelphsTable {
    return new Contract(address, _abi, signerOrProvider) as DelphsTable;
  }
}
