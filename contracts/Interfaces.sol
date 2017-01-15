/******************************************************************************\

file:   Interfaces.sol
ver:    0.0.6
updated:15-Jan-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

This file is part of the SandalStraps framework

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

\******************************************************************************/

pragma solidity ^0.4.7;

contract StrapsBase
{
    // An immutable identifier to be set in constructor and used by registrars
    bytes32 public regName;
}

contract ValueInterface
{
    function value() public constant returns (uint);
}

contract FactoryInterface
{
    address public last;
    
    event Created(address _creator, bytes32 _name, address _addr);
    function createNew(bytes32 _name, address _owner);
}


contract SandalStrapsInterface
{
    function getAddressByName(bytes32 _registrar, bytes32 _name)
        public constant returns (address addr_);

    function getNameByIdx(bytes32 _registrar, uint _idx)
        public constant returns (bytes32 name_);

    function getNameByAddress(bytes32 _registrar, address _addr)
        public constant returns (bytes32 name_);

    function getIdxByAddress(bytes32 _registrar, address _addr)
        public constant returns (uint idx_);

/* Public non-constant Functions */ 

    function addFactory(address _address);
    function setRegistrarEntry(bytes32 _registrar, address _addr);
    function newFromFactory(bytes32 _factory, bytes32 _name) payable;
}
