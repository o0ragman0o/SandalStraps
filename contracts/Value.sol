/******************************************************************************\

file:   Value.sol
ver:    0.4.2
updated:26-Jul-2018
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

This file is part of the SandalStraps framework

`Value` is a SandalStraps Registrar compliant ownable metric contract.
It can be set by the owner and `value()` read publicly returning a `uint256`
value.
The `function value() returns (uint);` API is intended as a modualar parameter
or value source for other utilising contracts. 

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

Release Notes
-------------
* removed `setUnits()` and `setDecimals()`
* added `setAll(uint _value, uint8 _decimals, bytes32 _units)`


\******************************************************************************/

pragma solidity ^0.4.17;

import "./Factory.sol";

contract Value is RegBase
{
    bytes32 constant public VERSION = "Value v0.4.2";
    
    /// @return The current set value
    uint public value;

    /// @return The fix poitn decimal place
    uint8 public decimals;

    /// @return Units description
    bytes31 public units;

    event Set(uint _value, uint8 _decimals, bytes32 _units);

    function Value(address _creator, bytes32 _regName, address _owner)
        public
        RegBase(_creator, _regName, _owner)
    {
        // nothing to construct
    }
    
    /// @notice Set the value to `_value`
    /// @param _value An unsigned integer
    /// @return Boolean success value
    function set(uint _value)
        public
        onlyOwner
        returns (bool)
    {
        value = _value;
        Set(_value, decimals, units);
        return true;
    }

    /// @notice Set the decimal places to `_decimal`
    /// @param _value An unsigned integer
    /// @param _decimals A fixed point decimal place value
    /// @param _units A 31 byte UTF8 units descriptor
    /// @return Boolean success value
    function setAll(uint _value, uint8 _decimals, bytes32 _units)
        public
        onlyOwner
        returns (bool)
    {
        value = _value;
        decimals = _decimals;
        units = bytes31(_units);
        Set(_value, _decimals, _units);
        return true;
    }
}


contract ValueFactory is Factory
{
//
// Constants
//

    /// @return registrar name
    bytes32 constant public regName = "value";

    /// @return version string
    bytes32 constant public VERSION = "ValueFactory v0.4.2";

//
// Function
//

    /// @param _creator The calling address passed through by a factory,
    /// typically msg.sender
    /// @param _regName A static name referenced by a Registrar
    /// @param _owner optional owner address if creator is not the intended
    /// owner
    /// @dev On 0x0 value for _owner or _creator, ownership precedence is:
    /// `_owner` else `_creator` else msg.sender
    function ValueFactory(address _creator, bytes32 _regName, address _owner)
        public
        Factory(_creator, regName, _owner)
    {
        _regName; // Not passed to super. Quiet compiler warning
    }

    /// @notice Create a new product contract
    /// @param _regName A unique name if the the product is to be registered in
    /// a SandalStraps registrar
    /// @param _owner An address of a third party owner.  Will default to
    /// msg.sender if 0x0
    /// @return kAddr_ The address of the new product contract
    function createNew(bytes32 _regName, address _owner)
        public
        payable
        pricePaid
        returns (address kAddr_)
    {
        kAddr_ = address(new Value(msg.sender, _regName, _owner));
        Created(msg.sender, _regName, kAddr_);
    }
}
