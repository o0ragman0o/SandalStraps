/******************************************************************************\

file:   RegBase.sol
ver:    0.0.8-sandalstraps
updated:28-Mar-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

This file is part of the SandalStraps framework

`RegBase` provides an inheriting contract the minimal API to be compliant with 
`Registrar`.  It includes a set-once, `bytes32 public regName` which is refered
to by `Registrar` lookups.

An owner updatable `address public owner` state variable is also provided and is
required by `Factory.createNew()`.

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

\******************************************************************************/

pragma solidity ^0.4.10;

contract RegBase
{
    // `regName` A static identifier, set in the constructor and used by
    // registrars
    bytes32 public regName;

    // `resource` A informational resource. Can be a sha3 of a string to lookup
    // in a StringsMap
    bytes32 public resource;
    
    // An address permissioned to enact owner restricted functions
    address public owner;

    event ChangedOwner(address indexed oldOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    // `_creator` The calling address seen by a factory
    // `_regName` A unique, static name referenced by a Registrar
    // `_owner` optional owner address if creator is not the intended owner.
    function RegBase(address _creator, bytes32 _regName, address _owner)
    {
        regName = _regName;
        owner = _owner != 0x0 ? _owner : 
                _creator != 0x0 ? _creator : msg.sender;
    }
    
    function destroy()
        onlyOwner
    {
        selfdestruct(msg.sender);
    }
    
    function changeOwner(address _owner)
        public
        onlyOwner
    {
        ChangedOwner(owner, _owner);
        owner = _owner;
    }

    function changeResource(bytes32 _resource)
        public
        onlyOwner
    {
        resource = _resource;
    }
}