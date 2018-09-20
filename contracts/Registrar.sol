/******************************************************************************\

file:   Registrar.sol
ver:    0.4.3
updated:16-Aug-2018
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

This file is a part of the SandalStraps framework

Registrars are a core but independant concept of the SandalStraps framework.
They provide indexed name/address storage and lookup functionality to compliant
contracts.  A compliant contract requires `RegBase` as a minimum API.

A registered contract can be looked up by unique keys of, `regName`, `address` 
and `index`.

Only the `address` and `index` are stored in the registrar while `regName` is
stored in and looked up from the registered contract.

`Registrar` is itself Registrar compliant and so can be self registered or
registered in another `Registrar` instance.

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

Release Notes
-------------
* Using Solidity 0.4.24 syntax

\******************************************************************************/

pragma solidity ^0.4.24;

import "./Factory.sol";

contract Registrar is RegBase
{

//
// Constants
//

    /// @return The contract version number
    bytes32 constant public VERSION = "Registrar v0.4.3";

//
// State Variables
//

    // `size` is the index of the most rescent registration and does not 
    // decrease with removals.
    // Indexing begins at 1 and not 0, so to avoid out-by-one errors, iterate
    // in the form:
    //     for(i = 1; i <= size; i++) {...}
    uint128 public size;
    
    // Public access registration flag.
    // `false` (default) allows only owner to register.
    // 'true` allows public to register
    bool public isPublic;

    /// @dev `indexAddress` maps Index -> Address
    /// @return The registered address at an index
    mapping (uint => address) public addressByIndex;
    
    /// @dev `indexByName` maps a contracts `regName` -> Index
    /// @return The registration index of a registered contracts name
    mapping (bytes32 => uint) public indexByName;

//
//Modifiers
//

    // Test if sender is the registrar owner or registered contract owner
    modifier onlyOwners(address _contract)
    {
        require(msg.sender == owner || 
            (isPublic && msg.sender == Owned(_contract).owner())
        );
        _;
    }

//
// Events
//

    // Triggered when an address is registered
    event Registered(bytes32 indexed _regName, address indexed _address);
    
    // Triggered when an address is unregistered
    event Removed(bytes32 indexed _regName, address indexed _address);
    
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
    
    /// @dev Return the registered address named `_regName`
    /// @param _regName A registered name
    /// @param kAddr_ The registered address
    /// @return kAddr_
    function addressByName(bytes32 _regName)
        public
        view
        returns (address kAddr_)
    {
        kAddr_ = addressByIndex[indexByName[_regName]];
    }
    
    /// @dev Returns a contracts `index` given its address
    /// @param _addr A registered address
    /// @param idx_ The registration index
    /// @return idx_
    function indexByAddress(address _addr)
        public
        view
        returns (uint idx_)
    {
        idx_ = indexByName[RegBase(_addr).regName()];
    }

    /// @dev Returns a contracts `regName` given its index
    /// @param _idx a registration index
    /// @param regName_ The name of a registered contract 
    /// @return regName_
    function nameByIndex(uint _idx)
        public
        view
        returns (bytes32 regName_)
    {
        regName_ = RegBase(addressByIndex[_idx]).regName();
    }
    
    /// @notice Add contract address `_addr` to the registrar.
    /// Sender must be Registrar owner or owner of new contract to add.
    /// Sender must be Registrar owner or owner of both new and registered
    /// contracts to update.
    /// Update is determined by prior registration of a `regName`.
    /// @dev Providing a prior address of an updated entry to `indexByAddress()`
    /// can be used to discover the newer contract. This is useful for upgrade
    /// path discovery
    /// @param _addr An address of a SandalStraps compliant contract
    /// @return bool indicating call success
    function register(address _addr)
        public
        onlyOwners(_addr)
        returns (bool)
    {
        // Get and validate regName from contract to be registered 
        bytes32 regName = RegBase(_addr).regName();
        require(regName != 0x0);
        
        // Get the index of the regName. 0 == not registered
        uint idx = indexByName[regName];

        // Prevent overwritting registrations if not the registrar owner or
        // contract's owner 
        if (0 != idx)
        {
            require(msg.sender == owner || 
                msg.sender == RegBase(addressByIndex[idx]).owner());
        } else {
            idx = ++size;
        }
        
        // Register the contract
        addressByIndex[idx] = _addr;
        indexByName[regName] = idx;
        emit Registered(regName, _addr);
        return true;
    }
    
    /// @notice Delete the registration of contract at `_addr`
    /// @param _addr The address of a registered contract
    /// @dev Sender must be Registrar owner or owner of the registered contract
    /// @return bool indicating call success
    function remove(address _addr)
        public
        onlyOwners(_addr)
        returns (bool)
    {
        bytes32 regName = RegBase(_addr).regName();
        delete addressByIndex[indexByAddress(_addr)];
        delete indexByName[regName];
        emit Removed(regName, _addr);
        return true;
    }
    
    /// @notice Allow or deny public to register
    /// @param _isPublic The public access flag
    /// @return bool indicating call success
    function setPublic(bool _isPublic)
        public
        returns (bool)
    {
        require(msg.sender == owner);
        isPublic = _isPublic;
        return true;
    }
}


contract RegistrarFactory is Factory
{
//
// Constants
//

    bytes32 constant public regName = "registrar";
    bytes32 constant public VERSION = "RegistrarFactory v0.4.3";

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
        returns(address kAddr_)
    {
        kAddr_ = address(new Registrar(msg.sender, _regName, _owner));
        emit Created(msg.sender, _regName, kAddr_);
    }
}
