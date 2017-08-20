/******************************************************************************\

file:   Redirector.sol
ver:    0.3.1
updated:19-Aug-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

This file is part of the SandalStraps framework

Redirectory acts as a proxy address for payment pass-through.

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

Release Notes
-------------
* local directory imports
* removed regName requirment in factory as RegBase constructor now requires regName

\******************************************************************************/

pragma solidity ^0.4.13;

import "./Factory.sol";

contract Redirector is RegBase {
//
// Constants
//

    bytes32 constant public VERSION = "Redirector v0.3.1";

//
// State
//

    address public payTo;
    
//
// Events
//
    
    event Redirect(address indexed _from, address indexed _payTo, uint _value);

//
// Functions
//

    function Redirector(address _creator, bytes32 _regName, address _owner)
        RegBase(_creator, _regName, _owner)
    {
        payTo = owner;
    }
    
    function () payable 
    {
        require(msg.value > 0);
        Redirect(msg.sender, payTo, msg.value);
        payTo.transfer(msg.value);
    }
    
    function changePayTo(address _payTo)
        onlyOwner
        returns (bool)
    {
        require(_payTo != address(this) && _payTo != 0x0);
        payTo = _payTo;
        return true;
    }
}

contract RedirectorFactory is Factory
{
//
// Constants
//

    /// @return registrar name
    bytes32 constant public regName = "redirector";
    
    /// @return version string
    bytes32 constant public VERSION = "RedirectorFactory v0.3.1";

//
// Functions
//

    /// @param _creator The calling address passed through by a factory,
    /// typically msg.sender
    /// @param _regName A static name referenced by a Registrar
    /// @param _owner optional owner address if creator is not the intended
    /// owner
    /// @dev On 0x0 value for _owner or _creator, ownership precedence is:
    /// `_owner` else `_creator` else msg.sender
    function RedirectorFactory(
            address _creator, bytes32 _regName, address _owner)
        Factory(_creator, regName, _owner)
    {
        // nothing to construct
    }

    /// @notice Create a new product contract
    /// @param _regName A unique name if the the product is to be registered in
    /// a SandalStraps registrar
    /// @param _owner An address of a third party owner.  Will default to
    /// msg.sender if 0x0
    /// @return kAddr_ The address of the new product contract
    function createNew(bytes32 _regName, address _owner)
        payable
        feePaid
        returns (address kAddr_)
    {
        kAddr_ = address(new Redirector(msg.sender, _regName, _owner));
        Created(msg.sender, _regName, kAddr_);
    }
}
