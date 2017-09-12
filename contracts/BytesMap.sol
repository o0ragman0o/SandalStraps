/******************************************************************************\

file:   BytesMap.sol
ver:    0.3.3
updated:12-Sep-2017
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

Release Notes
-------------
* Using Factory 0.3.3 for `withdrawAll()` instead of `withdraw(<value>)`


\******************************************************************************/

pragma solidity ^0.4.13;

import "./Factory.sol";

contract BytesMap is RegBase
{
//
// Constants
//

    bytes32 constant public VERSION = "BytesMap v0.3.3";

//
// State Variables
//

    mapping (bytes32 => bytes) public bytesMap;

//
// Events
//

    event Stored(bytes32 indexed _hash);

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
    function BytesMap(address _creator, bytes32 _regName, address _owner)
        RegBase(_creator, _regName, _owner)
    {
        // nothing to construct
    }

    /// @notice Store string `_string`
    /// @dev Stores an owned string in the mapping keyed by a sha3 contatination
    /// of `msg.sender` with `_string`
    function store(bytes _bytes)
        public
        returns (bytes32 hash_)
    {
        hash_ = sha3(msg.sender, _bytes);
        bytesMap[hash_] = _bytes;
        Stored(hash_);
    }
    
    /// @notice Clear `_string`. Must be string owner
    function clear(bytes _bytes)
        public
    {
        delete bytesMap[sha3(msg.sender, _bytes)];
    }
    
    /// @notice Clear string at hash key of `_hash`
    /// @dev can be cleared by ownr or string owner
    function clearHash(bytes32 _hash)
        public
        returns (bool)
    {
        bytes32 check = sha3(msg.sender, bytesMap[_hash]);
        require(_hash == check || msg.sender == owner);
        delete bytesMap[_hash];
        return true;
    }
}


contract BytesMapFactory is Factory
{
//
// Constants
//

    /// @return registrar name
    bytes32 constant public regName = "bytesmap";
    
    /// @return version string
    bytes32 constant public VERSION = "BytesMapFactory v0.3.3";

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
    function BytesMapFactory(
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
        kAddr_ = address(new BytesMap(msg.sender, _regName, _owner));
        Created(msg.sender, _regName, kAddr_);
    }
}
