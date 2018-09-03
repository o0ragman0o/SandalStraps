/******************************************************************************\

file:   RegBase.sol
ver:    0.4.3
updated:16-Aug-2017
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

Release notes:
* Using Solidity 0.4.24 syntax

\******************************************************************************/


pragma solidity ^0.4.24;

import "https://github.com/o0ragman0o/Owned/contracts/Owned.sol";


contract RegBaseAbstract
{
    /// @dev A static identifier, set in the constructor and used for registrar
    /// lookup
    /// @return Registrar name SandalStraps registrars
    bytes32 public regName;

    /// @dev An general purpose resource such as short text or a key to a
    /// string in a StringsMap
    /// @return resource
    bytes32 public resource;

//
// Events
//

    /// @dev Logged on change of resource
    event ChangedResource(bytes32 indexed _resource);

//
// Function Abstracts
//

    /// @notice Will selfdestruct the contract
    function destroy() public;

    /// @notice Change the resource to `_resource`
    /// @param _resource A key or short text to be stored as the resource.
    function changeResource(bytes32 _resource) public returns (bool);
}


contract RegBase is Owned, RegBaseAbstract
{
//
// Constants
//

    bytes32 constant public VERSION = "RegBase v0.4.3";

//
// Functions
//

    /// @param _creator The calling address passed through by a factory,
    /// typically msg.sender
    /// @param _regName A static name referenced by a Registrar
    /// @param _owner optional owner address if creator is not the intended
    /// owner
    /// @dev On 0x0 value for owner, ownership precedence is:
    /// `_owner` else `_creator` else msg.sender
    constructor(address _creator, bytes32 _regName, address _owner)
        public
    {
        require(_regName != 0x0);
        regName = _regName;
        owner = _owner != 0x0 ? _owner : 
                _creator != 0x0 ? _creator : msg.sender;
    }
    
    /// @notice Will selfdestruct the contract
    function destroy()
        public
        onlyOwner
    {
        selfdestruct(msg.sender);
    }
    
    /// @notice Change the resource to `_resource`
    /// @param _resource A key or short text to be stored as the resource.
    function changeResource(bytes32 _resource)
        public
        onlyOwner
        returns (bool)
    {
        resource = _resource;
        emit ChangedResource(_resource);
        return true;
    }
}