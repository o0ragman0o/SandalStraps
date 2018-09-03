/******************************************************************************\

file:   StringsMap.sol
ver:    0.4.3
updated:16-Aug-2018
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

Release notes
-------------
* Using SOlidity 0.4.24 syntax


\******************************************************************************/

pragma solidity ^0.4.24;

import "./Factory.sol";

contract StringsMap is RegBase
{
//
// Constants
//

    bytes32 constant public VERSION = "StringsMap v0.4.3";

//
// State Variables
//

    mapping (bytes32 => string) public strings;

//
// Events
//

    event Stored(bytes32 indexed _hash);
    event Cleared(bytes32 indexed _hash);

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
    constructor(address _creator, bytes32 _regName, address _owner)
        public
        RegBase(_creator, _regName, _owner)
    {
        // nothing to construct
    }

    /// @notice Store string `_string`
    /// @dev Stores an owned string in the mapping keyed by a sha3 contatination
    /// of `msg.sender` with `_string`
    function store(string _string)
        public
        returns (bytes32 hash_)
    {
        hash_ = keccak256(abi.encodePacked(msg.sender, _string));
        strings[hash_] = _string;
        emit Stored(hash_);
    }
    
    /// @notice Clear `_string`. Must be string owner
    function clear(string _string)
        public
        returns (bool)
    {
        bytes32 hash = keccak256(abi.encodePacked(msg.sender, _string));
        delete strings[hash];
        emit Cleared(hash);
        return true;
    }
    
    /// @notice Clear string at hash key of `_hash`
    /// @dev can be cleared by ownr or string owner
    function clearHash(bytes32 _hash)
        public
        returns (bool)
    {
        bytes32 check = keccak256(abi.encodePacked(msg.sender, strings[_hash]));
        require(_hash == check || msg.sender == owner);
        delete strings[_hash];
        emit Cleared(_hash);
        return true;
    }
}


contract StringsMapFactory is Factory
{
//
// Constants
//

    /// @return registrar name
    bytes32 constant public regName = "stringsmap";
    
    /// @return version string
    bytes32 constant public VERSION = "StringsMapFactory v0.4.3";

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
    constructor(
            address _creator, bytes32 _regName, address _owner)
        public
        Factory(_creator, regName, _owner)
    {
        _regName; // Not passed to super. Quite compiler warning
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
        kAddr_ = address(new StringsMap(msg.sender, _regName, _owner));
        emit Created(msg.sender, _regName, kAddr_);
    }
}
