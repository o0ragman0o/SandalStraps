/******************************************************************************\

file:   BytesMap.sol
ver:    0.4.0
updated:7-Oct-2017
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
* Using Factory 0.4.0 for `withdrawAll()` instead of `withdraw(<value>)`
* Change from 'fee' to 'price'
 


\******************************************************************************/

pragma solidity ^0.4.13;

import "./Factory.sol";

contract BytesMap is RegBase
{
//
// Constants
//

    bytes32 constant public VERSION = "BytesMap v0.4.0";

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
        public
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
        hash_ = keccak256(msg.sender, _bytes);
        bytesMap[hash_] = _bytes;
        Stored(hash_);
    }
    
    /// @notice Clear `_bytes`. Must be string owner
    function clear(bytes _bytes)
        public
    {
        delete bytesMap[keccak256(msg.sender, _bytes)];
    }
    
    /// @notice Clear string at hash key of `_hash`
    /// @dev can be cleared by ownr or string owner
    function clearHash(bytes32 _hash)
        public
        returns (bool)
    {
        bytes32 check = keccak256(msg.sender, bytesMap[_hash]);
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
    bytes32 constant public VERSION = "BytesMapFactory v0.4.0";

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
        public
        Factory(_creator, regName, _owner)
    {
        _regName; // Not passed to super. quite compiler warning
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
        kAddr_ = address(new BytesMap(msg.sender, _regName, _owner));
        Created(msg.sender, _regName, kAddr_);
    }
}