/******************************************************************************\

file:   Actor.sol
ver:    0.0.6-sandalstraps
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

import "Base.sol";
import "Interfaces.sol";

contract Actor is Base, StrapsBase
{

/* Constants */

    string constant public VERSION = "SandalStraps Actor v0.0.6";
    SandalStrapsInterface public straps;
    bytes8 public permissions;

    modifier onlyStraps ()
    {
        if (msg.sender != address(straps)) throw;
        _;
    }
    
    event Recieved(address indexed sender, uint amount);
    
    function Actor(address _creator, bytes32 _regName, address _owner)
        public
    {
        straps = SandalStrapsInterface(_creator);
        regName = _regName;
        owner = _owner;
    }
    
    function () payable {
        Recieved(msg.sender, msg.value);
    }
    
    function withdraw(uint256 _amount)
        public
        onlyOwner
    {
        owner.send(_amount);
    }
    
    function changePermissions(bytes8 _permissions)
        external
        onlyStraps
    {
        permissions = _permissions;
    }

    function addFactory(address _address)
        public
        onlyOwner
    {
        straps.addFactory(_address);
    }
    
    function setRegistrarEntry(bytes32 _registrar, address _addr)
        public
        onlyOwner
    {
        straps.setRegistrarEntry(_registrar, _addr);
    }
    
    function newFromFactory(bytes32 _factory, bytes32 _regName)
        payable
        onlyOwner
    {
        straps.newFromFactory(_factory, _regName);
    }
    
    function setValue(bytes32 _registrar, bytes32 _regName, uint _value)
        public
        onlyOwner
    {
        straps.setValue(_registrar, _regName, _value);
    }
}


contract ActorFactory is FactoryInterface
{
    bytes32 constant public regName = "Actors";
    string constant public VERSION = "ActorFactory v0.0.6-sandalstraps";
    
    function createNew(bytes32 _regName, address _owner)
        public
    {
        last = new Actor(msg.sender, _regName, _owner);
        Created(msg.sender, _regName, last);
    }
}