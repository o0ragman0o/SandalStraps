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


contract Value is StrapsBase
{
    uint public value;
    address public owner;
    
    function Value(address _creator, bytes32 _regName, address _owner)
    {
        owner = _owner == 0x0 ? _creator : _owner;
        regName = _regName;
    }
    
    function set(uint _value)
    {
        if (msg.sender != owner) throw;
        value = _value;
    }
}

contract ValueFactory is FactoryInterface
{
    bytes32 constant public regName = "Values";
    string constant public VERSION = "ValueFactory v0.0.6-sandalstraps";

    function createNew(bytes32 _regName, address _owner)
        public
    {
        last = new Value(msg.sender, _regName, _owner);
        Created(msg.sender, _regName, last);
    }
}
