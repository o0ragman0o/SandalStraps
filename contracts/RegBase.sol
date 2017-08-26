/******************************************************************************\

file:   RegBase.sol
ver:    0.3.2
updated:26-Aug-2017
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
* Using Owned 0.2.0 API
* removed `receiveOwnerShip(address _kAddr) public returns (bool)`
* removed `event ReceivedOwnership(address indexed _kAddr);
\******************************************************************************/

pragma solidity ^0.4.13;

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
    
    /// @dev An address permissioned to enact owner restricted functions
    /// @return owner
    address public owner;
    
    /// @dev An address permissioned to take ownership of the contract
    /// @return newOwner
    address public newOwner;

//
// Events
//

    /// @dev Triggered on initiation of change owner address
    event ChangeOwnerTo(address indexed _newOwner);

    /// @dev Triggered on change of owner address
    event ChangedOwner(address indexed _oldOwner, address indexed _newOwner);

    /// @dev Triggered when the contract accepts ownership of another contract.
    event ReceivedOwnership(address indexed _kAddr);

    /// @dev Triggered on change of resource
    event ChangedResource(bytes32 indexed _resource);

//
// Function Abstracts
//

    /// @notice Will selfdestruct the contract
    function destroy() public;

    /// @notice Initiate a change of owner to `_owner`
    /// @param _owner The address to which ownership is to be transfered
    function changeOwner(address _owner) public returns (bool);

    /// @notice Finalise change of ownership to newOwner
    function acceptOwnership() public returns (bool);

    /// @notice Change the resource to `_resource`
    /// @param _resource A key or short text to be stored as the resource.
    function changeResource(bytes32 _resource) public returns (bool);
}


contract RegBase is RegBaseAbstract
{
//
// Constants
//

    bytes32 constant public VERSION = "RegBase v0.3.2";

//
// State Variables
//

    // Declared in RegBaseAbstract for reasons that an inherited abstract
    // function is not seen as implimented by a public state identifier of
    // the same name.
    
//
// Modifiers
//

    // Permits only the owner
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

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
    function RegBase(address _creator, bytes32 _regName, address _owner)
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
    
    /// @notice Initiate a change of owner to `_owner`
    /// @param _owner The address to which ownership is to be transfered
    function changeOwner(address _owner)
        public
        onlyOwner
        returns (bool)
    {
        ChangeOwnerTo(_owner);
        newOwner = _owner;
        return true;
    }
    
    /// @notice Finalise change of ownership to newOwner
    function acceptOwnership()
        public
        returns (bool)
    {
        require(msg.sender == newOwner);
        ChangedOwner(owner, msg.sender);
        owner = newOwner;
        delete newOwner;
        return true;
    }

    /// @notice Change the resource to `_resource`
    /// @param _resource A key or short text to be stored as the resource.
    function changeResource(bytes32 _resource)
        public
        onlyOwner
        returns (bool)
    {
        resource = _resource;
        ChangedResource(_resource);
        return true;
    }
}