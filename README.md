# SandalStraps
v0.3.0

An extensible framework of registrars, factories and product smart contracts for 
Ethereum platforms.

WARNING: This code base is not yet production ready.  It has not been audited or fully tested.  It still likely contains bugs.

## Purpose
On Ethereum, immutible code in the form of smart contracts poses potential 
hazards when that code doesn't work as intended. It is by nature difficult to 
stop, correct and upgrade unless explicitly written to do so.  Strategies to 
mitagate these hazards advise against writting complex contracts in the first 
place and instead encourage simplicity and atomicity of logic.  While there is 
utilitarian scope for contracts
of isolated simple function, it would seem an unlikely way to fully realise the 
potential of Ethereum as an applications technology in the blockchain field.

The Sandal Straps framework seeks to provide a modular kernel to manage a 
scalable and extensible body of interacting contracts, in order to develop 
complex upgradeable organisations from simple component contracts.

There are four primary catagorys of contracts in the framework
* The **SandalStraps** kernel which holds and manages a registrar of registrars.
* **Registrars** hold *Name->Index* and *Index->Address* mappings to registered 
contracts and can provide an iteration source for those entries.
* **Factories** are contracts containing bytecode of a product contract for 
deployment.
* **Product** contracts could be anything providing a required functionality and 
are created by a registered factory.  They may be independent from the 
framework or be an interactive component unto it.
* **Auxiliary** contracts support the framework by providing managment controls
such as fee values or string mapping for contract resource lookup

# API
## RegBase API
All `SandalStraps` compliant contracts presents the following public functions:
```
[{"constant":false,"inputs":[{"name":"_resource","type":"bytes32"}],"name":"changeResource","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"regName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"resource","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"changeOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"inputs":[{"name":"_creator","type":"address"},{"name":"_regName","type":"bytes32"},{"name":"_owner","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangeOwnerTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_oldOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_resource","type":"bytes32"}],"name":"ChangedResource","type":"event"}]
```

### *Constructor*
```
function <contract>(address _creator, bytes32 _regName, address _owner);
```
Constructor is called during contract creation typically by the contract's
factory during `createNew()`
`address _creator` The address of the caller passed through by a factory.
`bytes32 _regName` A static name for contract identification within a registrar
`address _owner` An optional third party owner address.
On 0x0 address values ownership is awarded to:
`_owner` else `_creator` else `msg.sender`

### regName
```
function regName() constant returns(bytes32 regName_);
```
Returns the register name of the contract. Can be made human readable using:

`web3.toUtf8(<contract>.regName())`

### owner
```
function owner() constant returns (address owner_);
```
Returns the contract owner address

### changeOwner
```
function changeOwner(address _owner);
```
To change the contract owner

`owner_` The address to transfer ownership to

### acceptOwnership
```
function acceptOwnership() public returns (bool);
```
Finalise change of ownership to newOwner

### destroy
```
function destroy();
```
To destroy the contract and send money to the owner. This should be overloaded
by a deriving contract which should first attempt to delete its storage

### VERSION
```
function VERSION() constant returns (bytes32 version_);
```
Returns the version string constant

`web3.toUtf8(<contract>.VERSION())`

### resource (optional)
```
function resource() constant returns(bytes32 resource_);
``` 
Returns general purpose 32 byte resource.  This may be use for storing short
informational text or used as an index/key/hash into such as a string mapping
for front end URL discovery

### _init and initFuse (optional)
```
function _init(<param1>, <param2>,...);
function __initfuse() constant returns(uint);
```
If a contract is required to initialise state variables based on parameters that
would otherwise be passed to a constructor, an initialisation function and fuse 
can instead be included and called post deployment. _init() should delete

`__initFuse` should be se to 1 during construction, tested for deleted by

`_init()`

### EVENTS
### ChangeOwnerTo
```
event ChangeOwnerTo(address indexed _newOwner);
```
Triggered on initiation of change owner address

### ChangedOwner
```
event ChangedOwner(address indexed _oldOwner, address indexed _newOwner);
```
Triggered on change of owner address

## Registrar API
A registrar is a triangular lookup data structure with keys of *contract address
(kAddr)*, *contract name (regName)* and *registration index (idx)*
`kAddr` and `idx` are stored in mappings in the registrar while `regName` is
referenced from the registered contract

In addition to the `RegBase API`, a `SandalStraps` `Registrar` contract
exposes a minimum of the following functions:

```
[{"constant":true,"inputs":[{"name":"interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_resource","type":"bytes32"}],"name":"changeResource","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"add","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"namedIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"regName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_idx","type":"uint256"}],"name":"indexName","outputs":[{"name":"regName_","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"remove","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"resource","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_regName","type":"bytes32"}],"name":"addr","outputs":[{"name":"kAddr_","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_regName","type":"bytes32"}],"name":"namedAddress","outputs":[{"name":"addr_","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"addressIndex","outputs":[{"name":"idx_","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"size","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"changeOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"indexedAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"inputs":[{"name":"_creator","type":"address"},{"name":"_regName","type":"bytes32"},{"name":"_owner","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_regName","type":"bytes32"},{"indexed":true,"name":"_address","type":"address"}],"name":"Registered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_regName","type":"bytes32"},{"indexed":true,"name":"_address","type":"address"}],"name":"Removed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangeOwnerTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_oldOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_resource","type":"bytes32"}],"name":"ChangedResource","type":"event"}]
```

### indexedAddress
```
function indexedAddress(uint index) constant returns (address kAddr_);
```
Returns a registered address given its registration index

### namedIndex
```
function namedIndex(bytes32 _regName) constant returns (uint idx_);
```
Returns the registration index given a registered name

`_regName` The registration name of a registered contract

`idx_` The registration index associated with the contract

### namedAddress
```
function namedAddress(bytes32 _regName) constant returns (address kAddr_);
```
Returns a registered address given a registered name

`_regName` The registration name of a registered contract

`kAddr_` The address of the contract with that name

### addressIndex
```
function addressIndex(address _kAddr) constant returns (uint idx_);
```
Returns the registration index given a registered address

`_kAddr` The address of the registered contract to lookup

`idx_` The registration index of the contract

### indexName
```
function indexName(uint _idx) constant returns (bytes32 regName_);
```
Returns a contract name given its index

`_idx` The registration index of a registered contract

`regName_` The registration name of contract

### add
```
function add(address _kAddr);
```
Registers or updates a contract by providing its address. 
If the contracts `regName` is already registered then the caller must be the 
registrar owner or owner of the registered contract

`_kAddr` The address of the contract being registered

### remove
```
function remove(address _kAddr);
```
Deletes a registration of a contract given its address.
The caller must be either the registrar owner ot the registered contract
owner

### Events
### Registered
```
event Registered(bytes32 indexed _regName, address indexed _address);
```
Triggered when an address is registered

### Removed    
```
event Removed(bytes32 indexed _regName, address indexed _address);
```
Triggered when an address is unregistered
    

## Factory API
A factory embeds the bytecode of a product contract which can be deployed by
calling `createNew()`

In addition to the base compliant API, a `SandalStraps` `Factory` contract 
exposes a minimum of the following functions:
```
[{"constant":false,"inputs":[{"name":"_resource","type":"bytes32"}],"name":"changeResource","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"regName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"withdraw","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"resource","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"value","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_fee","type":"uint256"}],"name":"set","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"changeOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_regName","type":"bytes32"},{"name":"_owner","type":"address"}],"name":"createNew","outputs":[{"name":"kAddr_","type":"address"}],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"inputs":[{"name":"_creator","type":"address"},{"name":"_regName","type":"bytes32"},{"name":"_owner","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_creator","type":"address"},{"indexed":true,"name":"_regName","type":"bytes32"},{"indexed":true,"name":"_addr","type":"address"}],"name":"Created","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangeOwnerTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_oldOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_resource","type":"bytes32"}],"name":"ChangedResource","type":"event"}]```

### createNew
```
function createNew(bytes32 _regName, address _owner) payable returns (address kAddr_);
```
Deploys a new instance of the product contract

`_regName` The registration name of the new contract

`_owner` An address to be awarded ownership of the product contract. If 0x0
then the caller (`msg.sender`) is awarded ownership.
If a `fee` has been set, then the required value of ether must be sent with the call

### value
```
function value() constant returns(uint);
```
Returns the fee required to create a new product contract if one has been set 
by the factory owner

### setValue
```
function setValue(uint _fee);
```
Sets the fee required to created product contracts

`_fee` A fee value in wei

### withdraw
```
function withdraw(uint _value);
```
Transfer the a value of ether to owner address

### Events
```
event Created(address indexed _creator, bytes32 indexed _regName, address indexed _addr);
```
Is triggered when a product is created


## SandalStraps Kernel Contract API

The `SandalStraps` kernel contains a minimal Registrar factory called 
`bootstrap`.  Once it is deployed, three initialisation functions, `init1()` 
`init2()` and `init3()` are require to be called in sequence in order to build 
the root registrar called `metaRegistrar`, the ancillary registrar `factories` 
and register loopbacks for `metaRegistrar` and the `SandalStraps` instance.

In addition to the `regBase` API, the `SandalStraps` kernel provides the
following functions:

```
[{"constant":false,"inputs":[{"name":"_resource","type":"bytes32"}],"name":"changeResource","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_kAddr","type":"address"},{"name":"_value","type":"uint256"}],"name":"setValueOf","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"regName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_kAddr","type":"address"}],"name":"addFactory","outputs":[{"name":"","type":"bool"}],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"withdraw","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"_init1","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"resource","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_regName","type":"bytes32"}],"name":"addr","outputs":[{"name":"kAddr_","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_registrar","type":"bytes32"},{"name":"_kAddr","type":"address"}],"name":"setRegistrarEntry","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_registrar","type":"bytes32"},{"name":"_kAddr","type":"address"}],"name":"getNameByAddress","outputs":[{"name":"regName_","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_registrar","type":"bytes32"},{"name":"_idx","type":"uint256"}],"name":"getNameByIndex","outputs":[{"name":"regName_","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"_init3","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"metaRegistrar","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"_init2","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_kAddr","type":"address"},{"name":"_value","type":"uint256"},{"name":"_callData","type":"bytes"}],"name":"callAsContract","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_registrar","type":"bytes32"},{"name":"_regName","type":"bytes32"}],"name":"getAddressByName","outputs":[{"name":"kAddr_","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_kAddr","type":"address"},{"name":"_resource","type":"bytes32"}],"name":"changeResourceOf","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"changeOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_registrar","type":"bytes32"},{"name":"_kAddr","type":"address"}],"name":"getIndexByAddress","outputs":[{"name":"idx_","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_factory","type":"address"}],"name":"getFeeFor","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"__initFuse","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_factory","type":"bytes32"},{"name":"_regName","type":"bytes32"}],"name":"newFromFactory","outputs":[{"name":"","type":"bool"}],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"_registrar","type":"bytes32"},{"name":"_regName","type":"bytes32"}],"name":"getIndexByName","outputs":[{"name":"idx_","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_kAddr","type":"address"},{"name":"_owner","type":"address"}],"name":"changeOwnerOf","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"bootstrap","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"inputs":[{"name":"_creator","type":"address"},{"name":"_regName","type":"bytes32"},{"name":"_owner","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_regName","type":"bytes32"},{"indexed":true,"name":"_addr","type":"address"}],"name":"FactoryAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_regName","type":"bytes32"},{"indexed":true,"name":"_addr","type":"address"}],"name":"ProductCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangeOwnerTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_oldOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_resource","type":"bytes32"}],"name":"ChangedResource","type":"event"}]
```
### _init1
```
function _init1() pulic only owner
```
Creates root registrar 'metaRegistrar'.
Must be called first after contract creation.

### _init2
```
function _init2() pulic only owner
```
Self registers the SandalStraps instant, metaRegistrar then creates the 'factories' registrar.
Must be called second.

### _init3
```
function _init3() pulic only owner
```
Registers the 'bootstap' registrar factory in the 'factories' then creates and registers the 'Registrars' registrar.
Must be called third.

### addFactory
```
function addFactory(address _kAddr) payable;
```
Registers a `Factory` contract. If a `Value` contract with the name
`addFactoryFee` is registered in `metaRegistrar`, it's value will be look up
and interpreted as a fee in wei to be paid to register the factory.
If the factory's `regName` has not previously been registered, then a
registrar is created of the same name. 

`_kAddr` The factory address to be registered

### newFromFactory
```
function newFromFactory(bytes32 _factory, bytes32 _regName) payable returns(address kAddr_);
```
Creates and registers a new product contract from a registered factory.
The product contract is also registered into a registrar of the factory's
`regName`. If the product's registration name is already registered then
the owner must be the owner of the existing contract which is overwritten.

`_factory` The `regName` of a factory from which to create a product

`_regName` The registration name to be given to the product contract

`kAddr_` The address of the created product contract

### setRegistrarEntry
```
function setRegistrarEntry(bytes32 _registrar, address _kAddr);
```
Manually registers a compliant contract in a registrar. The registrar 
or contract must be owned by the SandalStraps kernel instance.

`_registrar` The registrar to register the contract into

`_kAddr` The address of the contract to be registered

### withdraw
```
function withdraw();
```
To transfer the entire balance of the SandalStraps kernal contract to the
owner or the address of the `feeCollector` if a contract is registered 
in `metaRegistrar` with that name

### callAsContract
```
function callAsContract(address _kAddr, uint _value, bytes _callData);
```
Allows the owner to make an arbitrary low level call as the SandalStraps
kernal instance.

`_kAddr` The address of the contract to call

`_value` The value in wei to be sent

`_callData` The RLP encoded call data

### changeOwnerOf
```
function changeOwnerOf(address _kAddr, address _owner);
```
Changes the owner of a contract owned by the SandalStraps kernel instance.

`_kAddr` The address of the owned contract.

`_owner` The address of to transfer ownership to.

### changeResourseOf
```
function changeResourceOf(address _kAddr, bytes32 _resource);
```
Changes the resource of a contract owned by the SandalStraps kernel instance.

`_kAddr` The address of the owned contract.

`_resource` The new resource value.

### setValue
```
function setValue(address _kAddr, uint _value);
```
Sets the value of a registered `Value` contract owned by the SandalStraps
kernal instance

`_kAddr` The address of the owned contract.

`_value` The value to set the `Value` contract to.

### Events
```
event FactoryAdded(bytes32 indexed _regName, address indexed _addr);
```
Triggered when a factory is registered

### ProductCreated
```
event ProductCreated(bytes32 indexed _regName, address indexed _addr);
```
Triggered when a factory product contract is created


## Value API (Wrapped Types)
An applied framework may require publicly accessible control values, e.g. fees, 
to be kept. For this purpose atomic store types may be wrapped in a compliant 
contract such as the `Value` contract.  Any simple type up to 32 bytes 
(256 bits) can be cast into and out of this contract store:

In addition to the `RegBase API`, a `SandalStraps` `Value` contract
exposes a minimum of the following functions:

```
[{"constant":false,"inputs":[{"name":"_resource","type":"bytes32"}],"name":"changeResource","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"regName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"resource","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"value","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"set","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"changeOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"inputs":[{"name":"_creator","type":"address"},{"name":"_regName","type":"bytes32"},{"name":"_owner","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangeOwnerTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_oldOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_resource","type":"bytes32"}],"name":"ChangedResource","type":"event"}]
```

### value
```
function value() constant returns (uint);
```
Returns the value of `Value` state variable

### set
```
function set(uint _value);
```
Sets the value of the `Value` state variable

`_value` The value to be stored


## StringsMap API
The `StringsMap` contract is a `SandalStraps` compliant contract that stores
owned strings in a `bytes32 => string` mapping.  This can be useful for storing
`resource` strings longer than 32 bytes. A strings key is the sha3 hash of
msg.sender and the string.  A string can only be deleted by the
caller who set it or by the `StingsMap` owner using its mapping key.

In addition to the `RegBase API`, a `SandalStraps` `StringMap` contract
exposes a minimum of the following functions:

```
[{"constant":false,"inputs":[{"name":"_resource","type":"bytes32"}],"name":"changeResource","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_string","type":"string"}],"name":"store","outputs":[{"name":"hash_","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_string","type":"string"}],"name":"clear","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"regName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"resource","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"clearHash","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"strings","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"changeOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"inputs":[{"name":"_creator","type":"address"},{"name":"_regName","type":"bytes32"},{"name":"_owner","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_hash","type":"bytes32"}],"name":"Stored","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangeOwnerTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_oldOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_resource","type":"bytes32"}],"name":"ChangedResource","type":"event"}]
```

### strings
```
function strings(bytes32 _lookup) constant returns (string string_);
```
Returns a stored string given its key

`_lookup` A mapping key the string is stored at 

### set
```
function set(string _string);
```
Stores an owned string in the mapping keyed by a sha3 contatination of

`msg.sender` with string content.

`_string` The string to store

### clear
```
function clear(string _string)
```
Allows a string owner to clears a stored string.

`_string` The string to be deleted.

### clearHash
```
function clearHash(bytes32 _hash)
```
Allows a string owner or `StringMap` owner to delete a stored string.

`_hash` The hash key of the string to delete


## BytesMap API
The `BytesMap` contract is a `SandalStraps` compliant contract that stores
owned byte arrays in a `bytes32 => bytes` mapping.  This can be useful for storing
`resource` bytes longer than 32 bytes. A `bytesMap` key is the sha3 hash of
`msg.sender` and the byte array.  A byte array can only be deleted by the
caller who set it or by the `BytesMap` owner using its mapping key.

In addition to the `RegBase API`, a `SandalStraps` `StringMap` contract
exposes a minimum of the following functions:

```
[{"constant":false,"inputs":[{"name":"_resource","type":"bytes32"}],"name":"changeResource","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"regName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"resource","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"clearHash","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_bytes","type":"bytes"}],"name":"clear","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"changeOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_bytes","type":"bytes"}],"name":"store","outputs":[{"name":"hash_","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"bytesMap","outputs":[{"name":"","type":"bytes"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"inputs":[{"name":"_creator","type":"address"},{"name":"_regName","type":"bytes32"},{"name":"_owner","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_hash","type":"bytes32"}],"name":"Stored","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangeOwnerTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_oldOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_resource","type":"bytes32"}],"name":"ChangedResource","type":"event"}]
```

### bytesMap
```
function bytesMap(bytes32 _hash) constant returns (bytes bytes_);
```
Returns a stored string given its key

`_hash` A mapping key the byte array is stored at 

### set
```
function set(bytes _bytes);
```
Stores an owned byte array in the mapping keyed by a sha3 contatination of

`msg.sender` with byte array content.

`_bytes` The byte array to store

### clear (by byte array)
```
function clear
```
Allows a byte array owner to clear a stored byte array.

`_bytes` The string to be deleted.

### clearHash
```
function clear(bytes32 _hash)
```
Allows a byte array owner or `BytesMap` owner to delete a stored byte array.

`_hash` The hash key of the byte array to delete

## Fees and Fee Collection
The `SandalStraps` contract and compliant factories can collect optional fees.
The fees collected by the SandalStraps instance can be withdrawn to its `owner` 
or a `feeCollector` contract if one is registered in the `metaRegistrar` with 
that name.  Fees collected by a `Factory` can be withdrawn to its owner.

In addition to a possible `Factory` fee, fees can be charged by a `SandalStraps`
instance upon registering a new `Factory` through `addFactory()` and creating 
a new product by calling `newFromFactory()`.

In order for a `SandalStraps` instance to collect fees, one or both `Value` 
contracts with the `regName`s of
```
addFactoryFee
``` 
and
```
newFromFactoryFee
```
have to be registered in `metaRegistrar`

Although factories are independent of the the `SandalStraps` instance and can 
create products and collect fees without one, those products do not benefit 
from registration in the framework.

Once initialized, adding a factory will register it into the `factories` 
registrar and also create a registrar of the factory's `regName` if it didn't 
already exist.  When a product is created through `newFromfactory()`, it is 
entered into the registrar of its factory's name.

## Writing SandalStraps Compliant Contracts

Any contract can be written as `SandalStraps` compliant by importing 
`Factory.sol` as in the following boilerplate example.

```
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
        returns (bool)
    {
        last = new Foo(owner, _regName, msg.sender);
        Created(msg.sender, _regName, last);
        return true;
    }
}
```

The `Factory` can then be deployed to the blockchain and its address registered
to a `SandalStraps` kernel instance by calling function:

`addFactory(address _factoryAddress)`.

Adding a `Factory` in this way will also create an associated `Registrar` of 
the `regName` of the `Factory`.  All product contracts of that factory which 
are created by calling:

`function newFromFactory(bytes32 _factoryRegName, bytes32 _newContractRegName)` 

will be registered in that registrar.

