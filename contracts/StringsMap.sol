/******************************************************************************\

file:   StringsMap.sol
ver:    0.0.8
updated:28-Mar-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

This file is part of the SandalStraps framework

StringsMap is a SandalStraps compliant wrapper to store strings keyed by their
sha3 hash.  It can be used as a lookup for RegBase resources.


This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

\******************************************************************************/

pragma solidity ^0.4.10;

import "https://github.com/o0ragman0o/SandalStraps/contracts/RegBase.sol";
import "https://github.com/o0ragman0o/SandalStraps/contracts/Factory.sol";

contract StringsMap is RegBase
{
    bytes32 constant public VERSION = "StringsMap v0.0.8";
    bytes32 public last;

    mapping (bytes32 => string) public strings;
    
    function StringsMap(address _creator, bytes32 _regName, address _owner)
        RegBase(_creator, _regName, _owner)
    {
        // nothing to contruct
    }

    function set(string _string)
        public
    {
        last = sha3(_string);
        strings[last] = _string;
    }
}


contract StringsMapFactory is Factory
{
    bytes32 constant public regName = "StringsMap";
    bytes32 constant public VERSION = "StringsMapFactory v0.0.8";

    function StringsMapFactory(
            address _creator, bytes32 _regName, address _owner)
        Factory(_creator, _regName, _owner)
    {
        // nothing to contruct
    }

    function createNew(bytes32 _regName, address _owner)
        payable
        feePaid
    {
        last = new StringsMap(msg.sender, _regName, _owner);
        Created(msg.sender, _regName, last);
    }
}
