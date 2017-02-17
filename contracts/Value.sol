/******************************************************************************\

file:   Value.sol
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

import "Interfaces.sol";

pragma solidity ^0.4.7;

// `Value` is a callable analog of the scalar `uint`. It can be used with 
// SandalStraps to provide and external metric, e.g. fees.

contract Value is StrapsBase
{
    string constant public VERSION = "SandalStraps Value v0.0.6";
    uint public value;
    
    function Value(address _creator, bytes32 _regName, address _owner)
    {
        owner = _owner == 0x0 ? _creator : _owner;
        regName = _regName;
    }
    
    function set(uint _value)
    {
        if (msg.sender == owner) value = _value;
    }
}

contract ValueFactory is FactoryInterface
{
    bytes32 constant public regName = "Values";
    string constant public VERSION = "SandalStraps ValueFactory v0.0.6";

    function createNew(bytes32 _regName, address _owner)
        public
    {
        last = new Value(msg.sender, _regName, _owner);
        Created(msg.sender, _regName, last);
    }
}
