/******************************************************************************\

file:   SandalStraps.sol
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
import "ExtendedBase.sol";
import "Registrar.sol";
import "Value.sol";

pragma solidity ^0.4.7;


contract SandalStraps is ExtendedBase
{
    string constant public VERSION = "SandalStraps v0.0.6";
    bytes32 public regName;
    RegistrarFactory public bootstrap;
    Registrar public metaRegistrar;
    
    modifier isAllowed
    {
        if (msg.sender != owner) {
            if (msg.value != ValueInterface(
                    getAddressByName("Values","fee")).value())
                throw;
        }
        _;
    }

    function SandalStraps(address _creator, bytes32 _regName, address _owner)
        public
    {
        owner = _owner == 0x0 ? _creator : _owner;
        regName = _regName;
        bootstrap = new RegistrarFactory();
    }

/* Public Constant functions */

    function getAddressByName(bytes32 _registrar, bytes32 _regName)
        public constant
        returns (address addr_)
    {
        addr_ = Registrar(metaRegistrar.namedAddress(_registrar)).
            namedAddress(_regName);
    }
    
    function getIdxByName(bytes32 _registrar, bytes32 _regName)
        public constant
        returns (uint idx_)
    {
        idx_ = Registrar(metaRegistrar.namedAddress(_registrar)).
            namedIdx(_regName);
    }

    function getNameByAddress(bytes32 _registrar, address _addr)
        public constant
        returns (bytes32 regName_)
    {
        regName_ = getNameByIdx(
            _registrar, getIdxByAddress(_registrar, _addr));
    }

    function getIdxByAddress(bytes32 _registrar, address _addr)
        public constant
        returns (uint idx_)
    {
        idx_ = Registrar(metaRegistrar.namedAddress(_registrar)).
            addressIdx(_addr);
    }
 
    function getNameByIdx(bytes32 _registrar, uint _idx)
        public constant
        returns (bytes32 regName_)
    {
        regName_ = Registrar(metaRegistrar.namedAddress(_registrar)).
            idxName(_idx);
    }
    
    function getLastFromFactory(bytes32 _factory)
        public constant
        returns (address regAddress_)
    {
        regAddress_ = FactoryInterface(
            Registrar(metaRegistrar.namedAddress("factories")).
                namedAddress(_factory)).last();
    }
    

/* Public non-constant Functions */ 

    // To boostrap the central registry post deployment
    function init1()
        public
        onlyOwner
    {
        if(address(metaRegistrar) != 0x0) throw;
        bootstrap.createNew("metaRegistrar", 0);
        metaRegistrar = Registrar(bootstrap.last());
    }

    function init2()
        public
        onlyOwner
    {
        metaRegistrar.add(this);
        metaRegistrar.add(metaRegistrar);
        bootstrap.createNew("factories", 0);
        metaRegistrar.add(bootstrap.last());
        Registrar(bootstrap.last()).add(bootstrap);
    }
    
    function init3()
        public
        onlyOwner
    {
        bootstrap.createNew("Registrars", 0);
        metaRegistrar.add(bootstrap.last());
    }

    function addFactory(address _address)
        public
        onlyOwner
    {
        FactoryInterface factory;
        Registrar registrar;
        bytes32 _regName = StrapsBase(_address).regName();

        registrar = Registrar(metaRegistrar.namedAddress("factories"));
        registrar.add(_address);

        // Create registrar of same factory name if one doesn't exist
        if (metaRegistrar.namedIdx(_regName) == 0) {
            factory = FactoryInterface(
                getAddressByName("factories", "Registrars"));
            factory.createNew(_regName, address(0));
            metaRegistrar.add(factory.last());
        }
    }
    
    function newFromFactory(bytes32 _factory, bytes32 _regName)
        payable
        isAllowed
    {
        FactoryInterface factory;
        Registrar registrar;
        
        factory = FactoryInterface(getAddressByName("factories", _factory));
        registrar = Registrar(metaRegistrar.namedAddress(_factory));
        factory.createNew(_regName, msg.sender);
        registrar.add(factory.last());
    }
    
    function setRegistrarEntry(bytes32 _registrar, address _addr)
        public
        onlyOwner
    {
        Registrar registrar = Registrar(metaRegistrar.namedAddress(_registrar));
        registrar.add(_addr);
    }
    
    function setValue(bytes32 _registrar, bytes32 _regName, uint _value)
        public
        onlyOwner
    {
        Value value = Value(getAddressByName(_registrar, _regName));
        value.set(_value);
    }
    
    function collectFees()
        public
    {
        address recipient = owner;
        recipient = metaRegistrar.namedIdx("feeCollector") != 0 ?
            metaRegistrar.namedAddress("feeCollector") : owner;
        recipient.send(this.balance);
    }
}

contract SandalStrapsFactory is FactoryInterface
{
    bytes32 constant public regName = "SandalStraps";
    string constant public VERSION = "SandalStrapsFactory v0.0.6";

    function createNew(bytes32 _regName, address _owner)
        public
    {
        last = new SandalStraps(msg.sender, _regName, _owner);
        Created(msg.sender, _regName, last);
    }
}
