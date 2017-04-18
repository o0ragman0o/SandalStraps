/******************************************************************************\

file:   SandalStraps.sol
ver:    0.2.0
updated:18-Apr-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

This file is part of the SandalStraps framework

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

\******************************************************************************/

import "https://github.com/o0ragman0o/SandalStraps/contracts/Factory.sol";
import "https://github.com/o0ragman0o/SandalStraps/contracts/Registrar.sol";
import "https://github.com/o0ragman0o/SandalStraps/contracts/Value.sol";

pragma solidity ^0.4.10;

contract SandalStraps is RegBase
{
//
// Constants
//

    bytes32 constant public VERSION = "SandalStraps v0.2.0";

//
// State Variables
//

    // Value to track contract initialization state 
    uint8 _initFuse = 1;
    
    // An embedded Registrar factory to bootstrap the contract 
    RegistrarFactory public bootstrap;
    
    // The root level registrar
    Registrar public metaRegistrar;

//
// Events
//

    event FactoryAdded(bytes32 indexed regName, address indexed addr);
    event ProductCreated(bytes32 indexed regName, address indexed addr);
    
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
    function SandalStraps(address _creator, bytes32 _regName, address _owner)
        RegBase(_creator, _regName, _owner)
    {
        bootstrap = new RegistrarFactory(owner, "", 0x0);
    }

/* Public Constant functions */

    // @param _registrar The name of a registered registrar
    // @param _regName The name of a registed contract to query
    // @return kAddr_ The address of the contract `_regName` registered in
    // `_registrar`
    function getAddressByName(bytes32 _registrar, bytes32 _regName)
        public constant
        returns (address kAddr_)
    {
        kAddr_ = Registrar(metaRegistrar.namedAddress(_registrar))
            .namedAddress(_regName);
    }
    
    // @param _registrar The name of a registered registrar
    // @param _regName The name of a registed contract to query
    // @return idx_ The registration index of the contract `_regName` registered
    // in `_registrar`
    function getIndexByName(bytes32 _registrar, bytes32 _regName)
        public constant
        returns (uint idx_)
    {
        idx_ = Registrar(metaRegistrar.namedAddress(_registrar))
            .namedIndex(_regName);
    }

    // @param _registrar The name of a registered registrar
    // @param _kAddr The address of a contract registered in `_registrar`
    // @return idx_ The registration index of the contract `_kAddr` registered
    // in `_registrar`
    function getIndexByAddress(bytes32 _registrar, address _kAddr)
        public constant
        returns (uint idx_)
    {
        idx_ = Registrar(metaRegistrar.namedAddress(_registrar))
            .addressIndex(_kAddr);
    }

    // @param _registrar The name of a registered registrar
    // @param _kAddr The address of a contract registered in `_registrar`
    // @return regName_ The name of the contract registered in `_registrar`
    function getNameByAddress(bytes32 _registrar, address _kAddr)
        public constant
        returns (bytes32 regName_)
    {
        regName_ = getNameByIndex(
            _registrar, getIndexByAddress(_registrar, _kAddr));
    }

    // @param _registrar The name of a registered registrar
    // @param _idx The registration index of a contract
    // @return regName_ The name of the contract registered in `_registrar`
    function getNameByIndex(bytes32 _registrar, uint _idx)
        public constant
        returns (bytes32 regName_)
    {
        regName_ = Registrar(metaRegistrar.namedAddress(_registrar))
            .indexName(_idx);
    }
    

/* Public non-constant Functions */ 

    /// @notice Creates root registrar 'metaRegistrar'
    /// @dev must be called first
    function _init1()
        public
        onlyOwner
    {
        require(1 == _initFuse);
        metaRegistrar = Registrar(bootstrap.createNew("metaRegistrar", 0));
        _initFuse++;
    }

    /// @notice Self registers this SandalStraps instant, metaRegistrar then 
    /// creates the 'factories' registrar
    /// @dev must be called second
    function _init2()
        public
        onlyOwner
    {
        require(2 == _initFuse);
        metaRegistrar.add(this);
        metaRegistrar.add(metaRegistrar);
        metaRegistrar.add(bootstrap.createNew("factories", 0));
        _initFuse++;
    }
    
    /// @notice Registers the 'bootstap' registrar factory in the 'factories'
    /// then creates and registers the 'Registrars' registrar.
    /// @dev must be called third
    function _init3()
        public
        onlyOwner
    {
        require(3 == _initFuse);
        Registrar(metaRegistrar.namedAddress("factories")).add(bootstrap);
        metaRegistrar.add(bootstrap.createNew("Registrar", 0));
        delete _initFuse;
    }
    
    /// @notice Register a Sandalstraps compliant fractory at address `_kAddr`
    /// @param _kAddr The address of a SandalStraps compiant factory
    /// @dev Registers a factory contract in the `factories` registrar then
    /// creates a registrar of the same name into which the product contracts of
    /// the factory are registered
    /// @return bool value indicating success
    function addFactory(address _kAddr)
        payable
        returns (bool)
    {
        Factory factory;
        Registrar registrar;

        // Get the factory's `regName` and validate it
        bytes32 fRegName = RegBase(_kAddr).regName();
        require(fRegName != 0x0);
        
        // Get fee for adding a factory if a fee value exists
        address feeAddr = metaRegistrar.namedAddress("addFactoryFee");
        uint256 chargeFee = msg.sender == owner ? 0 :
                    0x0 == feeAddr? 0 : Value(feeAddr).value();

        // Check correct fee has been sent
        require(chargeFee == msg.value);

        // Register new factory into the "factories" registrar
        registrar = Registrar(metaRegistrar.namedAddress("factories"));
        registrar.add(_kAddr);

        // Create registrar of same factory name if one doesn't exist
        if (0 == metaRegistrar.namedIndex(fRegName)) {
            factory = Factory(getAddressByName("factories", "Registrar"));
            metaRegistrar.add(factory.createNew(fRegName, address(0)));
        }
        
        FactoryAdded(fRegName, _kAddr);
        return true;
    }
    
    /// @notice Create a new contract with name `_regName` from factory
    /// `_factory`
    /// @param _factory The registered name of a factory
    /// @param _regName the name to register the new product contract under
    /// @dev a fee may be payable consisting of a 'newFromFactoryFee' and/or
    /// the factory fee itself. If the caller is the SandalStraps owner,
    /// 'newFromFactoryFee' is 0.
    /// @return bool value indicating success
    function newFromFactory(bytes32 _factory, bytes32 _regName)
        payable
        returns (bool)
    {
        // Get chosen factory and ensure it exists
        Factory factory = Factory(getAddressByName("factories", _factory));
        require(0x0 != address(factory));
        
        // Get the factory's registrar and ensure `regName` is no registers
        Registrar registrar = Registrar(metaRegistrar.namedAddress(_factory));
        require(0 == registrar.namedIndex(_regName));

        // Get fee from chosen factory        
        uint256 factoryFee = factory.value();
        
        // Get Straps fee if a value is registered. Straps owner gets free.
        address feeAddr = metaRegistrar.namedAddress("newFromFactoryFee");
        uint256 newFromFactoryFee = (0x0 == feeAddr || msg.sender == owner) ?
            0 : Value(feeAddr).value();
        
        // Check correct fee has been sent
        // Not that factory owner must also pay fee, but can then withdraw it
        // from the factory
        require(msg.value == factoryFee + newFromFactoryFee);
        
        // Create and register product contract
        address kAddr = factory.createNew
                            .value(factoryFee)(_regName, msg.sender);
        require(registrar.add(kAddr));
        ProductCreated(_regName, kAddr);
        return true;
    }
    
    /// @notice Register contract at address `_kAddr` into registrar `_registrar`
    /// @param _registrar The registered name of a registrar
    /// @param _kAddr the address of a compliant contract to be registered
    /// @return bool value indicating success
    function setRegistrarEntry(bytes32 _registrar, address _kAddr)
        public
        onlyOwner
        returns (bool)
    {
        Registrar registrar = Registrar(metaRegistrar.namedAddress(_registrar));
        require(registrar.add(_kAddr));
        return true;
    }
    
    /// @notice Withdraw the contract balance to the feeCollector address
    /// @return bool value indicating success
    function withdraw()
        public
        returns (bool)
    {
        address feeCollector = metaRegistrar.namedAddress("feeCollector");
        if (0x0 == feeCollector) feeCollector = owner;
        feeCollector.transfer(this.balance);
        return true;
    }
    
    /// @dev Allows the owner to make an arbitrary low level call as the
    /// contract
    /// @param _kAddr the address of the contract to call
    /// @param _value The value in wei to be sent
    /// @param _callData The RLP encoded call data
    /// @return bool value indicating success
    function callAsContract(address _kAddr, uint _value, bytes _callData)
        public
        onlyOwner
        returns (bool)
    {
        require(_kAddr.call.value(_value)(_callData));
        return true;
    }

    // Proxy functions to interact with contracts owned by the SandalStraps
    // Instance.

    /// @notice Change the owner of the owned contract `_kAddr` to `_owner`
    /// @param _kAddr The address of the owned contract
    /// @param _owner The address of the new owner
    /// @dev could be used to migrate to an upgraded SandalStraps
    /// @return bool value indicating success
    function changeOwnerOf(address _kAddr, address _owner)
        public
        onlyOwner
        returns (bool)
    {
        require(RegBase(_kAddr).changeOwner(_owner));
        return true;
    }

    /// @notice Change the resource of owned contract `_kAddr` to `_resource`
    /// @param _kAddr The address of the owned contract
    /// @param _resource The new resource value
    /// @return bool value indicating success
    function changeResourceOf(address _kAddr, bytes32 _resource)
        public
        onlyOwner
        returns (bool)
    {
        require(RegBase(_kAddr).changeResource(_resource));
        return true;
    }
    /// @notice Set the value at `_kAddr` to `_value`
    /// @param _kAddr The address of an owned Value contract
    /// @param _value The new value to store in `_regName`
    /// @return bool value indicating success
    function setValueOf(address _kAddr, uint _value)
        public
        onlyOwner
        returns (bool)
    {
        require(Value(_kAddr).set(_value));
        return true;
    }
}


contract SandalStrapsFactory is Factory
{
//
// Constants
//

    /// @return registrar name
    bytes32 constant public regName = "SandalStraps";

    /// @return version string
    bytes32 constant public VERSION = "SandalStrapsFactory v0.2.0";

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
    function SandalStrapsFactory(
        address _creator, bytes32 _regName, address _owner)
        Factory(_creator, _regName, _owner)
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
        kAddr_ = address(new SandalStraps(msg.sender, _regName, _owner));
        Created(msg.sender, _regName, kAddr_);
    }
}
