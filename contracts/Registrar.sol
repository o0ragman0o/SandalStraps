/******************************************************************************\

file:   Registrar.sol
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

import "Interfaces.sol";

contract Registrar is StrapsBase
{
    string constant public VERSION = "SandalStraps Registrar v0.0.6";
    
    uint public size = 1;

    mapping (uint => address) public idxAddress;
    mapping (bytes32 => uint) public namedIdx;

    modifier canUpdate(bytes32 _name, bool _overwrite)
    {
        if (!_overwrite && namedAddress(_name) != address(0x0)) throw;
        _;
    }
    
    event Entered(bytes32 name, address addr);

    function Registrar(address _creator, bytes32 _regName, address _owner)
        public
    {
        owner = _owner == 0x0 ? _creator : owner;
        regName = _regName;
    }

    function namedAddress(bytes32 _regName)
        public
        constant
        returns (address addr_)
    {
        addr_ = idxAddress[namedIdx[_regName]];
    }
    
    function addressIdx(address _addr)
        public
        constant
        returns (uint idx_)
    {
        idx_ = namedIdx[StrapsBase(_addr).regName()];
    }

    function idxName(uint _idx)
        public
        constant
        returns (bytes32 regName_)
    {
        regName_ = StrapsBase(idxAddress[_idx]).regName();
    }
    
    function add(address _addr)
        public
        onlyOwner
    {
        uint idx = addressIdx(_addr);
        idx = idx == 0 ? size++ : idx;
        idxAddress[idx] = _addr;
        namedIdx[StrapsBase(_addr).regName()] = idx;
    }
    
    function remove(bytes32 _regName)
        public
        onlyOwner
    {
        delete idxAddress[namedIdx[_regName]];
        delete namedIdx[_regName];
    }
    
}

contract RegistrarFactory is FactoryInterface
{
    bytes32 constant public regName = "Registrars";
    string constant public VERSION = "RegistrarFactory v0.0.6-sandalstraps";

    function createNew(bytes32 _regName, address _owner)
        public
    {
        last = new Registrar(msg.sender, _regName, _owner);
        Created(msg.sender, _regName, last);
    }
}
