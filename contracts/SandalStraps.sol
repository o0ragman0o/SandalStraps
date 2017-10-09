/******************************************************************************\

file:   SandalStraps.sol
ver:    0.4.0
updated:8-Oct-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

This file is part of the SandalStraps framework

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

Release Notes:
* Completely breaking changes
* Added minimum Withdrawable API compliance
* Change factoryFee to productPrice
* Changed newFromFactoryFee to commission
* Changed "newfromfactoryfee" to "sswallet"
* Hardcoded predeployed bootstrap address
* removed __init3()
* Renamed registrar proxy getters according to registrar getter name changes
* Removed `event RegistrarChange(bytes32 indexed _registrar, address indexed _kAddr);`
* Added `function removeFrom(bytes32 _registrar, address _kAddr)`
* Added `event RegistrarAdd(bytes32 indexed _registrar, address indexed _kAddr);`
* Added `event RegistrarRemove(bytes32 indexed _registrar, address indexed _kAddr);`
* Added `reservedNames` mapping for to allow only owner to add reserved name contracts
* Added `function changeReservedsName(bytes32 _regName, bool _reserved) returns (bool);
* Added explicit reentry protection with `ReentryProtected` contract


\******************************************************************************/

pragma solidity ^0.4.13;

import "https://github.com/o0ragman0o/Withdrawable/contracts/Withdrawable.sol";
import "https://github.com/o0ragman0o/ReentryProtected/ReentryProtected.sol";
import "./Registrar.sol";
import "./Value.sol";

contract SandalStraps is ReentryProtected, RegBase, WithdrawableMinItfc
{
//
// Constants
//

    bytes32 constant public VERSION = "SandalStraps v0.4.0";

    // Pre-deployed registrar factory address
    address constant BOOTSTRAP = 0xDFd6dCCF429Fe7d4e8bba3f9c29c2C7CbA4f52EF;

//
// State Variables
//

    // Value to track contract initialization state 
    uint8 public __initFuse = 1;
    
    // Address of creator
    address public creator;

    // RegistrarFactory bootstrap;
    RegistrarFactory public bootstrap = RegistrarFactory(BOOTSTRAP);
    
    // The root level registrar
    Registrar public metaRegistrar;
    
    // A mapping of regNames that can only be added by the owner
    mapping (bytes32 => bool) public reservedNames;

//
// Events
//

    // Logged when a factory product is created
    event ProductCreated(
        address indexed _by,
        bytes32 indexed _factoryName,
        bytes32 indexed _regName,
        address _kAddr);
    
    // Logged when SandalStraps accepts ownership of a contract
    event ReceivedOwnership(address indexed _kAddr);

    // Logged when a registrar entry is changed
    event RegistrarAdd(bytes32 indexed _registrar, address indexed _kAddr);

    // Logged when a registrar entry is removed
    event RegistrarRemove(bytes32 indexed _registrar, address indexed _kAddr);

//
// Functions - Constructor and Default
//

    /// @param _creator The calling address passed through by a factory,
    /// typically msg.sender
    /// @param _regName A static name referenced by a Registrar
    /// @param _owner optional owner address if creator is not the intended
    /// owner
    /// @dev On 0x0 value for _owner or _creator, ownership precedence is:
    /// `_owner` else `_creator` else msg.sender
    function SandalStraps(address _creator, bytes32 _regName, address _owner)
        public
        RegBase(_creator, _regName, _owner)
    {
    	creator = _creator;
        metaRegistrar = Registrar(bootstrap.createNew("metaregistrar", this));
        ProductCreated(msg.sender,
            "registrar",
            "metaregistrar",            
            address(metaRegistrar));
        reservedNames["metaregistrar"] = true;
        reservedNames["factories"] = true;
        reservedNames["registrar"] = true;
        reservedNames["sswallet"] = true;
        reservedNames["sscommision"] = true;
        reservedNames["ssfactoryfee"] = true;
    }

    /// @dev Accepts funds to the default function
    function ()
        public
        payable
    {
        Deposit(msg.sender, msg.value);
    }
    
/* Public Constant functions */

    /// @dev ENS resolver for metaRegistrar registered contracts
    /// @param _regName a contract's registrar name
    function addr(bytes32 _regName)
        public
        constant
        returns (address kAddr_)
    {
        kAddr_ = metaRegistrar.addr(_regName);
        require(kAddr_ != 0x0);
    }

    /// @param _registrar The name of a registered registrar
    /// @param _regName The name of a registed contract to query
    /// @return kAddr_ The address of the contract `_regName` registered in
    /// `_registrar`
    function addressByNameFrom(bytes32 _registrar, bytes32 _regName)
        public
        constant
        returns (address kAddr_)
    {
        kAddr_ = Registrar(metaRegistrar.addressByName(_registrar))
            .addressByName(_regName);
    }
    
    /// @param _registrar The name of a registered registrar
    /// @param _regName The name of a registed contract to query
    /// @return idx_ The registration index of the contract `_regName` registered
    /// in `_registrar`
    function indexByNameFrom(bytes32 _registrar, bytes32 _regName)
        public
        constant
        returns (uint idx_)
    {
        idx_ = Registrar(metaRegistrar.addressByName(_registrar))
            .indexByName(_regName);
    }

    /// @param _registrar The name of a registered registrar
    /// @param _kAddr The address of a contract registered in `_registrar`
    /// @return idx_ The registration index of the contract `_kAddr` registered
    /// in `_registrar`
    function indexByAddressFrom(bytes32 _registrar, address _kAddr)
        public
        constant
        returns (uint idx_)
    {
        idx_ = Registrar(metaRegistrar.addressByName(_registrar))
            .indexByAddress(_kAddr);
    }

    /// @param _registrar The name of a registered registrar
    /// @param _kAddr The address of a contract registered in `_registrar`
    /// @return regName_ The name of the contract registered in `_registrar`
    function nameByAddressFrom(bytes32 _registrar, address _kAddr)
        public
        constant
        returns (bytes32 regName_)
    {
        regName_ = nameByIndexFrom(
            _registrar, indexByAddressFrom(_registrar, _kAddr));
    }

    /// @param _registrar The name of a registered registrar
    /// @param _idx The registration index of a contract
    /// @return regName_ The name of the contract registered in `_registrar`
    function nameByIndexFrom(bytes32 _registrar, uint _idx)
        public
        constant
        returns (bytes32 regName_)
    {
        regName_ = Registrar(metaRegistrar.addressByName(_registrar))
            .nameByIndex(_idx);
    }
    
    /// @return fee_ The fee in wei required to register a factory contract
    function getAddFactoryFee()
        public
        constant
        returns (uint fee_)
    {
        // Get fee for adding a factory if a fee value exists
        address feeAddr = metaRegistrar.addressByName("ssfactoryfee");
        fee_ = 0x0 == feeAddr ? 0 : Value(feeAddr).value();
    }
    
    /// @return div_ The commision divisor if `sscomission` Value is registered
    function getCommissionDivisor()
        public
        constant
        returns (uint div_)
    {
        address commissionAddr = metaRegistrar.addressByName("sscommission");
        div_ = (0x0 == commissionAddr) ? 0 : Value(commissionAddr).value();
    }
    
    /// @param _factory The regName of a product factory
    /// @return price_ The price in wei required to create a `_factory` product
    function getProductPrice(bytes32 _factory)
    	public
        constant
        returns (uint price_)
    {
        // Get fee from chosen factory        
        price_ = Factory(addressByNameFrom("factories", _factory)).value();

        // Get Straps fee if a value is registered. Straps owner gets free.
        address commissionAddr = metaRegistrar.addressByName("sscommission");
        uint divisor = (0x0 == commissionAddr) ? 0 : 
                Value(commissionAddr).value();

        // Need to protect against divide by 0 on unset commision divisor value
        price_ = (0 == divisor) ? price_ : 
                price_ + price_ / divisor;
    }
    

/* Public non-constant Functions */ 

    /// @dev Creates and registers 'factories' and 'registrar' registrars
    function _init1()
        public
        onlyOwner
        noReentry
        returns (bool)
    {
        require(1 == __initFuse);
        
        // Create and add 'factories' registrar to metaregistrar
        address factoriesReg = bootstrap.createNew("factories", this);
        ProductCreated(this, "registrar", "factories", factoriesReg);
        metaRegistrar.add(factoriesReg);
        RegistrarAdd("metaregistrar", factoriesReg);
        
        // Create and register the 'registrar' registrar
        address registrarReg = bootstrap.createNew("registrar", this);
        ProductCreated(this, "registrar", "registrar", registrarReg);
        metaRegistrar.add(registrarReg);
        RegistrarAdd("metaregistrar", registrarReg);

        __initFuse++;
        return true;
    }
    
    /// @dev Registers own and metaregistrar addresses in metaRegistrar.
    /// Registers bootstrap factory address in factories
    function _init2()
        public
        onlyOwner
        noReentry
        returns (bool)
    {
        require(2 == __initFuse);
        
        // Add this to metaregistrar
        metaRegistrar.add(this);
        RegistrarAdd("metaregistrar", this);
        
        // Add 'metaregistrar' to metaregistrar
        metaRegistrar.add(metaRegistrar);
        RegistrarAdd("metaregistrar", metaRegistrar);
        
        // Register the bootstrap registrar factory in 'factories' registrar
        Registrar(metaRegistrar.addressByName("factories")).add(BOOTSTRAP);
        RegistrarAdd("factories", BOOTSTRAP);
        
        delete __initFuse;
        return true;
    }
    
    /// @notice Register a Sandalstraps compliant fractory at address `_kAddr`
    /// @param _kAddr The address of a SandalStraps compiant factory
    /// @dev Registers a factory contract in the `factories` registrar then
    /// creates a registrar of the same name into which the product contracts of
    /// the factory are registered
    /// @return bool value indicating success
    function addFactory(address _kAddr)
        public
        payable
        preventReentry
        returns (bool)
    {
        if (msg.value > 0) { Deposit(msg.sender, msg.value); }

        // Get the factories registrar
        address factories = metaRegistrar.addressByName("factories");
        
        // Get the registrars registrar
        Registrar registrars = Registrar(metaRegistrar.addressByName("registrar"));
        
        // Get the registrar factory
        address regFactory = addressByNameFrom("factories", "registrar");
        
        // Get registrar factory price
        uint price = Value(regFactory).value();

        // Get factory registration fee. Owner pays only factory price
        address feeValue = metaRegistrar.addressByName("ssfactoryfee");
        uint fee = feeValue == 0x0 ? 0 :
                    msg.sender == owner ? 0 :
                    Value(feeValue).value();

        require(msg.value == fee + price);
        
        // Get the added factory's `regName` and validate it
        bytes32 factoryName = RegBase(_kAddr).regName();
        require(factoryName != 0x0);
        Registrar(factories).add(_kAddr);
        RegistrarAdd("factories", _kAddr);

        // Create a registrar of same factory name if one doesn't exist
        if (0x0 == Registrar(registrars).addressByName(factoryName)) {
            if (price > 0) { Withdrawal(msg.sender, regFactory, price); }

            address registrar = Factory(regFactory)
                    .createNew
                    .value(price)(factoryName, this);
            ProductCreated(this, "registrar", factoryName, registrar);
            // Register the new registrar in the registrars ragistrar
            Registrar(registrars).add(registrar);
            RegistrarAdd("registrar", registrar);
            metaRegistrar.add(registrar);
            RegistrarAdd("metaregistrar", registrar);
        }
        return true;
    }

    /// @notice Create a new contract with name `_regName` from factory
    /// `_factory`
    /// @param _factory The registered name of a factory
    /// @param _regName the name to register the new product contract under
    /// @param _prodOwner product owner address. msg.sender if == 0x0
    /// @dev a fee may be payable consisting of a 'newFromFactoryFee' and/or
    /// the factory fee itself. If the caller is the SandalStraps owner,
    /// 'newFromFactoryFee' is 0.
    /// @return bool value indicating success
    function newProduct(bytes32 _factory, bytes32 _regName, address _prodOwner)
        public
        payable
        preventReentry
        returns (address kAddr_)
    {
        // Only owner can use reserved regNames
        require(msg.sender == owner || !reservedNames[_regName]);
        
        if (msg.value > 0) { Deposit(msg.sender, msg.value); }
        
        _prodOwner = _prodOwner != 0x0 ? _prodOwner : msg.sender;
        
        // Get chosen factory and ensure it exists
        Factory factory = Factory(addressByNameFrom("factories", _factory));
        
        // Get the factory's registrar and ensure `_regName` is not registered
        Registrar registrar = Registrar(metaRegistrar.addressByName(_factory));

        // Get price from factory        
        uint256 price = factory.value();
        
        // Get product commission divisor if a value is registered.
        address commissionAddr = metaRegistrar.addressByName("sscommission");
        uint divisor = (0x0 == commissionAddr) ? 0 :
                Value(commissionAddr).value();

        // Get full price (need to protect against divide by 0 on unset
        // commision divisor value)
        uint fullPrice = (0 == divisor) ? price : price + price / divisor;
        require(msg.value == fullPrice);
        
        // Create the product contract
        if (price > 0) { Withdrawal(msg.sender, kAddr_, price); }
        kAddr_ = factory.createNew.value(price)(_regName, _prodOwner);
        ProductCreated(msg.sender, _factory, _regName, kAddr_);

        // Register The product contract. Will throw if product failed creation
        require(registrar.add(kAddr_));
        RegistrarAdd(_factory, kAddr_);
    }
    
    /// @notice Register contract at address `_kAddr` into registrar `_registrar`
    /// @param _registrar The registered name of a registrar
    /// @param _kAddr the address of a compliant contract to be registered
    /// @return bool value indicating success
    function addTo(bytes32 _registrar, address _kAddr)
        public
        onlyOwner
        noReentry
        returns (bool)
    {
        Registrar registrar = Registrar(metaRegistrar.addressByName(_registrar));
        require(registrar.add(_kAddr));
        RegistrarAdd(_registrar, _kAddr);
        
        return true;
    }

    /// @notice Register contract at address `_kAddr` into registrar `_registrar`
    /// @param _registrar The registered name of a registrar
    /// @param _kAddr the address of a compliant contract to be deregistered
    /// @return bool value indicating success
    function removeFrom(bytes32 _registrar, address _kAddr)
    	public
    	onlyOwner
    	noReentry
    	returns (bool)
    {
        Registrar registrar = Registrar(metaRegistrar.addressByName(_registrar));
        require(registrar.remove(_kAddr));
        RegistrarRemove(_registrar, _kAddr);

        return true; 	
    }
    
    /// @notice Set array of reserved `_regNames` to `_reserved`
    /// @param _regNames An array of registry name to reserve
    /// @param _reserved An array of boolean reservations.
    /// @return bool value indicating success
    function reserveNames(bytes32[] _regNames, bool[] _reserved)
        public
        onlyOwner
        noReentry
        returns (bool)
    {
        uint l = _regNames.length;
        for (uint i; i < l; i++) {
            reservedNames[_regNames[i]] = _reserved[i];
        }
        return true;
    }
    
    /// @notice Withdraw the contract balance to the feeCollector address
    /// @return bool value indicating success
    function withdrawAll()
        public
        preventReentry
        returns (bool)
    {
        address wallet = metaRegistrar.addressByName("sswallet");
        // If no wallet specified, funds go to creator (typically the factory)
        if (0x0 == wallet) wallet = creator;

        Withdrawal(msg.sender, wallet, this.balance);
        wallet.transfer(this.balance);

        return true;
    }
    
    /// @dev Allows the owner to make an arbitrary low level call as the
    /// contract
    /// @param _kAddr the address of the contract to call
    /// @param _callData The RLP encoded call data
    /// @return bool value indicating success
    function callAsContract(address _kAddr, bytes _callData)
        public
        payable
        onlyOwner
        preventReentry
        returns (bool)
    {
        require(_kAddr.call.value(msg.value)(_callData));
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
        noReentry
        returns (bool)
    {
        require(RegBase(_kAddr).changeOwner(_owner));
        return true;
    }
    
    /// @notice Receive ownership of a contract at `_kAddr`
    /// @param _kAddr The address of a contract transferring ownership
    /// @return bool value indicating success
    function receiveOwnershipOf(address _kAddr)
        public
        noReentry
        returns (bool)
    {
        require(RegBase(_kAddr).acceptOwnership());
        ReceivedOwnership(_kAddr);
        return true;
    }

    /// @notice Change the resource of owned contract `_kAddr` to `_resource`
    /// @param _kAddr The address of the owned contract
    /// @param _resource The new resource value
    /// @return bool value indicating success
    function changeResourceOf(address _kAddr, bytes32 _resource)
        public
        onlyOwner
        noReentry
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
        noReentry
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
    bytes32 constant public regName = "sandalstraps";

    /// @return version string
    bytes32 constant public VERSION = "SandalStrapsFactory v0.4.0";

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
        returns (address kAddr_)
    {
        kAddr_ = address(new SandalStraps(
                this,
                _regName,
                _owner != 0x0 ? owner : msg.sender)
            );
        Created(msg.sender, _regName, kAddr_);
    }
}
