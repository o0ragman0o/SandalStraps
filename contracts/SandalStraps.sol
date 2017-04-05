/******************************************************************************\

file:   SandalStraps.sol
ver:    0.0.8
updated:28-Mar-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

This file is part of the SandalStraps framework

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

\******************************************************************************/

import "https://github.com/o0ragman0o/SandalStraps/contracts/RegBase.sol";
import "https://github.com/o0ragman0o/SandalStraps/contracts/Factory.sol";
import "https://github.com/o0ragman0o/SandalStraps/contracts/Registrar.sol";
import "https://github.com/o0ragman0o/SandalStraps/contracts/Value.sol";

pragma solidity ^0.4.10;


contract SandalStraps is RegBase
{
    bytes32 constant public VERSION = "SandalStraps v0.0.8";
    uint8 _initFuse = 3;
    RegistrarFactory public bootstrap;
    Registrar public metaRegistrar;
    
    function SandalStraps(address _creator, bytes32 _regName, address _owner)
        RegBase(_creator, _regName, _owner)
    {
        bootstrap = new RegistrarFactory(owner,"",0x0);
    }

/* Public Constant functions */

    function getAddressByName(bytes32 _registrar, bytes32 _regName)
        public constant
        returns (address addr_)
    {
        addr_ = Registrar(metaRegistrar.namedAddress(_registrar)).
            namedAddress(_regName);
    }
    
    function getIndexByName(bytes32 _registrar, bytes32 _regName)
        public constant
        returns (uint idx_)
    {
        idx_ = Registrar(metaRegistrar.namedAddress(_registrar)).
            namedIndex(_regName);
    }

    function getNameByAddress(bytes32 _registrar, address _addr)
        public constant
        returns (bytes32 regName_)
    {
        regName_ = getNameByIndex(
            _registrar, getIndexByAddress(_registrar, _addr));
    }

    function getIndexByAddress(bytes32 _registrar, address _addr)
        public constant
        returns (uint idx_)
    {
        idx_ = Registrar(metaRegistrar.namedAddress(_registrar)).
            addressIndex(_addr);
    }
 
    function getNameByIndex(bytes32 _registrar, uint _idx)
        public constant
        returns (bytes32 regName_)
    {
        regName_ = Registrar(metaRegistrar.namedAddress(_registrar)).
            indexName(_idx);
    }
    

/* Public non-constant Functions */ 

    // _init1() uses the built-in registry factory to create the root registrar
    // call `metaRegistrar`.
    function _init1()
        public
        onlyOwner
    {
        require(_initFuse == 1);
        _initFuse++;
        bootstrap.createNew("metaRegistrar", 0);
        metaRegistrar = Registrar(bootstrap.last());
    }

    // _init2() registers the `this` address and `metaRegistrar` as the
    // first two entries in `metaRegistrar.
    // It then creates the `factories` registrar and registers `bootstrap` as
    // the current `Registrars` factory.
    function _init2()
        public
        onlyOwner
    {
        require(_initFuse == 2);
        _initFuse++;
        metaRegistrar.add(this);
        metaRegistrar.add(metaRegistrar);
        bootstrap.createNew("factories", 0);
        metaRegistrar.add(bootstrap.last());
        Registrar(bootstrap.last()).add(bootstrap);
    }
    
    // _init3() creates the `Registrar` registrar.
    function _init3()
        public
        onlyOwner
    {
        require(_initFuse == 3);
        delete _initFuse;
        bootstrap.createNew("Registrar", 0);
        metaRegistrar.add(bootstrap.last());
    }
    
    // Registers a factory contract in the `factories` registrar referencing
    // the `regName` constant in the factory itself.
    // It further creates a `Registrar` of the same name into which the product
    // contracts of the factory are registered
    function addFactory(address _address)
        payable
    {
        Factory factory;
        Registrar registrar;
        bytes32 _regName = RegBase(_address).regName();
        address feeAddr = metaRegistrar.namedAddress("addFactoryFee");
        uint256 chargeFee = msg.sender == owner ? 0 :
                    feeAddr == 0x0 ? 0 : Value(feeAddr).value();
        require(chargeFee == msg.value);

        registrar = Registrar(metaRegistrar.namedAddress("factories"));
        registrar.add(_address);

        // Create registrar of same factory name if one doesn't exist
        if (metaRegistrar.namedIndex(_regName) == 0) {
            factory = Factory(getAddressByName("factories", "Registrar"));
            factory.createNew(_regName, address(0));
            metaRegistrar.add(factory.last());
        }
    }
    
    // Creates a product contract from a registered factory.
    // Creation fees can be charged by the factory as set by the factory owner
    // and/or the SandalStraps instance if a `Value` contract called 
    // "newFromFactoryFee" is registered
    function newFromFactory(bytes32 _factory, bytes32 _regName)
        payable
    {
        Factory factory;
        Registrar registrar;
        uint256 factoryFee;
        uint256 newFromFactoryFee;
        address feeAddr;

        factory = Factory(getAddressByName("factories", _factory));
        require(0x0 != address(factory));
        factoryFee = factory.fee();

        feeAddr = metaRegistrar.namedAddress("newFromFactoryFee");
        newFromFactoryFee = msg.sender == owner ? 0 :
                    feeAddr == 0x0 ? 0 : factoryFee / Value(feeAddr).value();

        require(factoryFee + newFromFactoryFee == msg.value);
        registrar = Registrar(metaRegistrar.namedAddress(_factory));
        // require(feeCollector.transfer(newFromFactoryFee));     
        require(
            factory.call.value(factoryFee)("createNew", _regName, msg.sender));
        registrar.add(factory.last());
    }
    
    // Manually registers a `regBase` compliant contract into an existing
    // registrar
    function setRegistrarEntry(bytes32 _registrar, address _addr)
        public
        onlyOwner
    {
        Registrar registrar = Registrar(metaRegistrar.namedAddress(_registrar));
        registrar.add(_addr);
    }
    
    // Sets a `Value` contracts value by proxy when that value is owned by the
    // SandalStraps instance.  (e.g for setting fees)
    function setValue(bytes32 _registrar, bytes32 _regName, uint _value)
        public
        onlyOwner
    {
        Value value = Value(getAddressByName(_registrar, _regName));
        value.set(_value);
    }
    
    // To manually withdraw ether that has accumulated in the contract through
    // fees. The entire balance is sent to either the owner or a `feeCollector`
    // contract if one has been registered in metaRegistrar.
    function withdraw()
        public
    {
        address feeCollector = metaRegistrar.namedAddress("feeCollector");
        if (0x0 == feeCollector) feeCollector = owner;
        feeCollector.transfer(this.balance);
    }
    
    function callAsContract(address _k, uint _value, bytes _callData)
        public
        onlyOwner
        returns (bool)
    {
        require(_k.call.value(_value)(_callData));
        return true;
    }

    // Proxy functions to interact with contracts owned by the SandalStraps
    // Instance.

    function changeOwnerOf(address _regAddr, address _owner)
        public
        onlyOwner
    {
        RegBase(_regAddr).changeOwner(_owner);
    }

    function changeResourceOf(address _regAddr, bytes32 _resource)
        public
        onlyOwner
    {
        RegBase(_regAddr).changeResource(_resource);
    }
    
    function setFeeOf(address _regAddr, uint _fee)
        public
        onlyOwner
    {
        Factory(_regAddr).setFee(_fee);
    } 

    function withdrawFrom(address _regAddr)
        public
        onlyOwner
    {
        Factory(_regAddr).withdraw();
    } 
    
}


contract SandalStrapsFactory is Factory
{
    bytes32 constant public regName = "SandalStraps";
    bytes32 constant public VERSION = "SandalStrapsFactory v0.0.8";

    function SandalStrapsFactory(
        address _creator, bytes32 _regName, address _owner)
        Factory(_creator, _regName, _owner)
    {
        // nothing to contruct
    }

    function createNew(bytes32 _regName, address _owner)
        payable
        feePaid
    {
        last = new SandalStraps(msg.sender, _regName, _owner);
        Created(msg.sender, _regName, last);
    }
}
