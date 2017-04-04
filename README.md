# SandalStraps
A extensible framework of registrars, factories and product smart contracts for Ethereum platforms.

## Purpose
On Ethereum, immutible code in the form of smart contracts poses potential hazards when that code doesn't work as intended. It is by nature difficult to stop, correct and upgrade unless explicitly written to do so.  Strategies to mitagate these hazards advise against writting complex contracts in the first place and instead encourage simplicity and atomicity of logic.  While there is utilitarian scope for contracts
of isolated simple function, it would seem an unlikely way to fully realise the potential of Ethereum as an applications technology in the blockchain field.

The Sandal Straps framework seeks to provide a modular kernel to manage a scalable and extensible body of interacting contracts, in order to develop complex upgradeable organisations from simple component contracts.

There are four primary catagorys of contracts in the framework
* The SandalStraps kernal which holds and manages a registrar of registrars.
* Registrars hold *Name->Index* and *Index->Address* mappings to registered contracts and can provide an iteration source for those entries.
* Factories are contracts containing bytecode of a product contract for deployment.
* Product contracts could be anything providing a required functionality and are created by a registered factory.  They may be independent from the framework or be an interactive component unto it., including the SandalStraps and Registrar contracts themselves (implying that SandalStraps can selfspawn).

##API
###Base API
All `SandalStraps` compliant contracts are required to present a minimum interface presenting public functions of:
```
// Constructor to be called by the contract's factory upon `new`. 
// If `_creator` and `_owner` are empty strings, the owner defaults to msg.sender
// `_regname` must be unique for the registrar the contract belongs to
function <contract>(address _creator, bytes32 _regName, address _owner);

// Returns the registed name
function regName() constant returns(bytes32 regName_);

// Returns the contract owner
function owner() constant returns (address owner_);

// To change the contract owner
function changeOwner(address owner);

// To destroy the contract and send money to the owner
function destroy();

// To discover the contract version
function VERSION() constant returns (bytes32 version_);
```
Optionally a `bytes32` general resource can be used provided information such as a short URL or a hash to a string table:
```
// Returns resource data of up to 32 bytes
function resource() constant returns(bytes32 resource_);
``` 
If a contract is required to initialise state variables based on parameters an initialisation function and fuse can be included for that purpose, e.g:
```
// To initialise state post deployment
function _init(<param1>, <param2>,...);

// To test if the contract has been initialised
function __initfuse() constant returns(bool);
```
###Registrar API
In addition to the base compliant API, a `SandalStraps` `Registrar` contract exposes a minimum of the following functions:
```
// Returns a registered address given its index
function indexedAddress(uint index) constant returns (address addr_);

// Returns and index given a registered name
function namedIndex(bytes32 _regName) constant returns (uint idx_);

// Returns a registered address given its name
function namedAddress(bytes32 _regName) constant returns (address addr_);

// Returns an index given a registered address
function addressIndex(address _addr) constant returns (uint idx_);

// Returns a contract name given its index
function indexName(uint _idx) constant returns (bytes32 regName_);

// Registers a contract by providing its address
function add(address _addr);

// Deletes a registration of a contract given its address
function remove(address _addr);
```
###Factory API
In addition to the base compliant API, a `SandalStraps` `Factory` contract exposes a minimum of the following functions:
```
// Creates a new instance of the product contract
function createNew(bytes32 _name, address _owner) payable;

// Returns the address of the last product contract that was created
function last() constant returns(address addr_);

// Returns the fee required to create a new product contract
function fee() constant returns(uint fee_);

// Sets the fee required in to created product contracts
function setFee(uint _fee);

// Withdraw the balance of fees to the factory owner
function withdraw();
```
The `_owner` parameter is optional and exists to award ownership to a third-party upon creation.  If passed as an empty string `""`, it will give ownership to `msg.sender`.  The `_creator`  which is passed to the `_creator` parameter by the SandalStraps `newFromFactory` function.

Any contract specific initialisation that would normally be done by a constructor should instead be done post deployment by an init() function.

Factory contracts should be independant entities and agnostic towards the caller. 

## SandalStraps Kernel Contract
The `SandalStraps` kernel contains a minimal Registrar factory called `bootstrap`.  Once it is deployed, three initialisation functions, `init1()` `init2()` and `init3()` are require to be called in sequence in order to build the root registrar called `metaRegistrar`, the ancillary registrar `factories` and register loopbacks for `metaRegistrar` and the `SandalStraps` instance.

In addition to the base API, the `SandalStraps` kernel provides the following functions:
```
// Registers a new `Factory` contract
function addFactory(address _address) payable;

// Creates and registers a new product contract from a registered factory
function newFromFactory(bytes32 _factory, bytes32 _regName) payable;

// Register a compliant contract address in a register
function setRegistrarEntry(bytes32 _registrar, address _addr);

// Set the value of a registered `Value` contract
function setValue(bytes32 _registrar, bytes32 _regName, uint _value);

// Withdraw fees to the owner or `feeCollector` if registered
function withdraw();

// Execute a transaction from the SandalStraps instance address
function callAsContract(address _k, uint _value, bytes _callData);
```

##Wrapped Types
An applied framework may require publicly accessible control values, e.g. fees, to be kept. For this purpose atomic store type may be wrapped in a compliant contract such as the `Value` contract.  Any tsimple type up to 32 bytes (256 bits) can be cast into and out of this contract store:
```
// Returns the value of `Value` state variable
function value() constant returns (uint value_);

// Sets the value of the `Value` state variable
function set(uint _value);
```

##StringsMap
The `StringsMap` contract is a `SandalStraps` compliant contract that stores strings in a `byte32` keyed mapping.  This can be useful for storing `resource` strings longer than 32 bytes
```
// Returns a stored string given its `sha3` hash
function strings(bytes32 _lookup) constant returns (string string_);

// Stores a string in the mapping keyed by its `sha3` hash
function set(string _string);

// Returns the `sha3` hash of the last string stored
function last() constant returns (bytes32 lastHash_);
```

##Fees and Fee Collection
The `SandalStraps` contract and compliant factories can collect optional fees.  The fees collected by the SandalStraps instance can be withdrawn to its `owner` or a `feeCollector` contract if one is registered in the `metaRegistrar` with that name.  Fees collected by a `Factory` can be withdrawn to its owner.

In addition to a possible `Factory` fee, fees can be charged by a `SandalStraps` instance upon registering a new `Factory` through `addFactory()` and creating a new product by calling `newFromFactory()`.

In order for a `SandalStraps` instance to collect fees, one or both `Value` contracts with the `regName`s of
```
addFactoryFee
``` 
and
```
newFromFactoryFee
```
have to be registered in `metaRegistrar`

Although factories are independent of the the `SandalStraps` instance and can create products and collect fees without one,  those products do not benefit from registration in the framework.

Once initialized, adding a factory will register it into the `factories` registrar and also create a registrar of the factory's `regName` if it didn't already exist.  When a product is created through `newFromfactory()`, it is entered into the registrar of its factory's name.

##Writing SandalStraps Compliant Contracts

Any contract can be written as `SandalStraps` compliant by importing `RegBase.sol` and `Factory.sol` as in the following boilerplate example.  
```
import "https://github.com/o0ragman0o/SandalStraps/contracts/RegBase.sol";
import "https://github.com/o0ragman0o/SandalStraps/contracts/Factory.sol";

pragma solidity ^0.4.10;

contract SS_Foo
{
    bytes32 public constant VERSION = "SS_Foo v0.0.1";
    // Structs, State variables, etc
    function SS_Foo(address _creator, bytes32 _regName, address _owner)
        RegBase(_creator, _regName, _owner)
    {
        // contract specific construction
    }
    ... 
}

contract FooFactory is Factory
{
    bytes32 constant public regName = "Foos";
    bytes32 constant public VERSION = "Foo_Factory v0.0.1";

    function BaktFactory(address _creator, bytes32 _regName, address _owner)
        Factory(_creator, _regName, _owner)
    {
        // nothing left to construct
    }

    function createNew(bytes32 _regName, address _owner)
        payable
        feePaid
    {
        last = new Foo(owner, _regName, msg.sender);
        Created(msg.sender, _regName, last);
    }
}
```
The `Factory` can then be deployed to the blockchain and it's address added to a `SandalStraps` kernel by calling function `addFactory(address _factoryAddress)`.  Adding a `Factory` in this way will also create an associated `Registrar` of the `regName` of the `Factory`.  All product contracts of that factory which are created by calling `function newFromFactory(bytes32 _factoryRegName, bytes32 _newContractRegName)` will also be registered in that registrar.

