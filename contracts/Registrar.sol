/******************************************************************************\

file:   Registrar.sol
ver:    0.0.8
updated:28-Mar-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

This file is a part of the SandalStraps framework

Registrars are a core but independant concept of the SandalStraps framework.
They provide indexed name/address storage and lookup functionality for compliant
contracts.  A compliant contract requires `RegBase` as a minimum API.

A registered contract can be looked up by unique keys of, `regName`, `address` 
and `index`.

Only the `address` and `index` are stored in the registrar while `regName` is
stored in the registered contract.


`Registrar` is itself Registrar compliant and so can be self registered or
registered in another `Registrar` instance.


This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

\******************************************************************************/

pragma solidity ^0.4.10;

import "https://github.com/o0ragman0o/SandalStraps/contracts/RegBase.sol";
import "https://github.com/o0ragman0o/SandalStraps/contracts/Factory.sol";

contract Registrar is RegBase
{
    bytes32 constant public VERSION = "Registrar v0.0.8";
    
    // `size` is the index of the most rescent registration and does not 
    // decrease with removals.
    // Indexing begins at 1 and not 0, so to avoid out-by-one errors, itterate
    // in the form:
    //     for(i = 1; i <= size; i++) {...}
    uint public size;

    // `indexAddress` maps Index -> Address
    mapping (uint => address) public indexedAddress;
    
    // `namedIndex` maps a contracts `regName` -> Index
    mapping (bytes32 => uint) public namedIndex;

    // Test if sender is registrar owner or registered contract owner
    modifier onlyOwners(address _contract)
    {
        require(msg.sender == owner ||
            msg.sender == RegBase(_contract).owner());
        _;
    }

    event Registered(bytes32 regName, address _address);
    event Removed(bytes32 regName, address _address);
    
    function Registrar(address _creator, bytes32 _regName, address _owner)
        RegBase(_creator, _regName, _owner)
    {
        // nothing left to construct
    }

    // Returns a contract address given its `regName`
    function namedAddress(bytes32 _regName)
        public
        constant
        returns (address addr_)
    {
        addr_ = indexedAddress[namedIndex[_regName]];
    }
    
    // Returns a contracts `index` given its address
    function addressIndex(address _addr)
        public
        constant
        returns (uint idx_)
    {
        idx_ = namedIndex[RegBase(_addr).regName()];
    }

    // Returns a contracts `regName` given its index
    function indexName(uint _idx)
        public
        constant
        returns (bytes32 regName_)
    {
        regName_ = RegBase(indexedAddress[_idx]).regName();
    }
    
    // Adds or updates a contract in the registrar.
    // Sender must be Registrar owner or owner of new contract to add.
    // Sender must be Registrar owner or owner of both new and registered
    // contracts to update.
    // Update is determined by prior registration of a `regName`.
    // Providing a prior address of an updated entry to `addressIndex()`
    // can be used to discover the newer contract.
    function add(address _addr)
        public
        onlyOwners(_addr)
    {
        bytes32 regName = RegBase(_addr).regName();
        uint idx = namedIndex[regName];

        // Prevent overwritting registrations if not the owner or registered
        // contract's owner 
        if (idx != 0)
        {
            require(msg.sender == owner || 
                msg.sender == RegBase(indexedAddress[idx]).owner());
        } else {
            idx = ++size;
        }
        
        indexedAddress[idx] = _addr;
        namedIndex[regName] = idx;
        Registered(regName, _addr);
    }
    
    // Deletes a contract's registration.
    // Sender must be Registrar owner or owner of the registered contract
    function remove(address _addr)
        public
        onlyOwners(_addr)
    {
        bytes32 regName = RegBase(_addr).regName();
        delete indexedAddress[addressIndex(_addr)];
        delete namedIndex[regName];
        Removed(regName, _addr);
    }
}


contract RegistrarFactory is Factory
{
    bytes32 constant public regName = "Registrar";
    bytes32 constant public VERSION = "RegistrarFactory v0.0.8";

    function RegistrarFactory(address _creator, bytes32 _regName, address _owner)
        Factory(_creator, _regName, _owner)
    {
        // nothing to contruct
    }

    function createNew(bytes32 _regName, address _owner)
        payable
        feePaid
    {
        last = new Registrar(msg.sender, _regName, _owner);
        Created(msg.sender, _regName, last);
    }
}
