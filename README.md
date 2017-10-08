# SandalStraps
v0.4.0

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
potential of Ethereum as a distributed applications technology.

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
___
## Release Notes
v0.4.0 is breaking.

### Registrar.sol
* Completely breaking change.  Renamed all getters to more intuitive identifiers
* `indexedAddres()` to `addressByIndex()`
* `namedIndex()` to `indexByName()`
* `namedAddress` to `addressByName()`
* `addressIndex()` to `indexByAddress()`
* `indexName()` to `nameByIndex()`

### SandalStraps.sol
* Using Factory 0.4.0 for `withdrawAll()` instead of `withdraw(<value>)`
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
___
# API
## RegBase API
All `SandalStraps` compliant contracts present the following public functions:
```
[{"constant":false,"inputs":[{"name":"_resource","type":"bytes32"}],"name":"changeResource","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"regName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"resource","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_kAddr","type":"address"}],"name":"receiveOwnership","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"changeOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_creator","type":"address"},{"name":"_regName","type":"bytes32"},{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangeOwnerTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_oldOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_kAddr","type":"address"}],"name":"ReceivedOwnership","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_resource","type":"bytes32"}],"name":"ChangedResource","type":"event"}]
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
function owner() constant returns (address);
```
Returns the contract owner address

### newOwner
```
function newOwner() constant returns (address);
```
Returns an address permissioned to accept contract ownership.

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
Allows a permissioned address to take ownership of the contract.

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
___
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

### supportsInterface
```
function supportsInterface(bytes4 _interfaceID) constant returns (bool);
```
Returns `true` if `_interfaceID == 0x3b3b57de`, the standard ENS named address lookup interface

`_interfaceID` An ENS interface ID

### addr
```
function addr(bytes32 _regName) public constant returns (address kAddr_);
```
Standard ENS interface (`0x3b3b57de`) to return an address for a given key. Is alias of `namedAddress()`.

`_regName` The registration name of a registered contract

`kAddr_` Returns the address of the contract with `_regName`

### addressByIndexed
```
function addressByIndex(uint index) constant returns (address kAddr_);
```
Returns a registered address given its registration index

### indexByName
```
function indexByName(bytes32 _regName) constant returns (uint idx_);
```
Returns the registration index given a registered name

`_regName` The registration name of a registered contract

`idx_` The registration index associated with the contract

### addressByName
```
function addressByName(bytes32 _regName) constant returns (address kAddr_);
```
Returns a registered address given a registered name

`_regName` The registration name of a registered contract

`kAddr_` The address of the contract with that name

### indexByAddress
```
function indexByAddress(address _kAddr) constant returns (uint idx_);
```
Returns the registration index given a registered address

`_kAddr` The address of the registered contract to lookup

`idx_` The registration index of the contract

### nameByIndex
```
function nameByIndex(uint _idx) constant returns (bytes32 regName_);
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
    
___

## Factory API
A factory embeds the bytecode of a product contract which can be deployed by
calling `createNew()`.  It's registry name (regName) MUST be the product name
and set as a `bytes32 public constant`. The `_regName` parameter is ignored. 

In addition to the base compliant API, a `SandalStraps` `Factory` contract 
exposes a minimum of the following functions:
```
[{"constant":false,"inputs":[{"name":"_resource","type":"bytes32"}],"name":"changeResource","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"regName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"resource","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"value","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_fee","type":"uint256"}],"name":"set","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdrawAll","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"changeOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_regName","type":"bytes32"},{"name":"_owner","type":"address"}],"name":"createNew","outputs":[{"name":"kAddr_","type":"address"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_creator","type":"address"},{"name":"_regName","type":"bytes32"},{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_creator","type":"address"},{"indexed":true,"name":"_regName","type":"bytes32"},{"indexed":true,"name":"_addr","type":"address"}],"name":"Created","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangeOwnerTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_oldOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_kAddr","type":"address"}],"name":"ReceivedOwnership","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_resource","type":"bytes32"}],"name":"ChangedResource","type":"event"}]
```

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

### withdrawAll
```
function withdrawAll();
```
Transfer the contract's balance of ether to owner address

### Events
```
event Created(address indexed _creator, bytes32 indexed _regName, address indexed _addr);
```
Is triggered when a product is created

___
## SandalStraps Kernel Contract API

The `SandalStraps` kernel calls a predeployed Registrar factory.
Once it is deployed, two initialisation functions, `init1()` 
`init2()` are require to be called in sequence in order to build ancillary 
registrars `factories` and `registrar` 
and register loopbacks for `metaRegistrar` and the `SandalStraps` instance.

In addition to the `regBase` API, the `SandalStraps` kernel provides the
following functions:

```
[{"constant":true,"inputs":[{"name":"_registrar","type":"bytes32"},{"name":"_kAddr","type":"address"}],"name":"nameByAddressFrom","outputs":[{"name":"regName_","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_resource","type":"bytes32"}],"name":"changeResource","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"creator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_kAddr","type":"address"},{"name":"_value","type":"uint256"}],"name":"setValueOf","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_registrar","type":"bytes32"},{"name":"_kAddr","type":"address"}],"name":"removeFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"regName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_kAddr","type":"address"}],"name":"receiveOwnershipOf","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_kAddr","type":"address"}],"name":"addFactory","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_registrar","type":"bytes32"},{"name":"_kAddr","type":"address"}],"name":"addTo","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_registrar","type":"bytes32"},{"name":"_kAddr","type":"address"}],"name":"indexByAddressFrom","outputs":[{"name":"idx_","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"_init1","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"reservedNames","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"resource","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_regName","type":"bytes32"}],"name":"addr","outputs":[{"name":"kAddr_","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"metaRegistrar","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_registrar","type":"bytes32"},{"name":"_idx","type":"uint256"}],"name":"nameByIndexFrom","outputs":[{"name":"regName_","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"_init2","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_factory","type":"bytes32"},{"name":"_regName","type":"bytes32"},{"name":"_prodOwner","type":"address"}],"name":"newProduct","outputs":[{"name":"kAddr_","type":"address"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_kAddr","type":"address"},{"name":"_resource","type":"bytes32"}],"name":"changeResourceOf","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdrawAll","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_kAddr","type":"address"},{"name":"_callData","type":"bytes"}],"name":"callAsContract","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_factory","type":"bytes32"}],"name":"getProductPrice","outputs":[{"name":"price_","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_registrar","type":"bytes32"},{"name":"_regName","type":"bytes32"}],"name":"indexByNameFrom","outputs":[{"name":"idx_","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"changeOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"__initFuse","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_registrar","type":"bytes32"},{"name":"_regName","type":"bytes32"}],"name":"addressByNameFrom","outputs":[{"name":"kAddr_","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAddFactoryFee","outputs":[{"name":"fee_","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_regNames","type":"bytes32[]"},{"name":"_reserved","type":"bool[]"}],"name":"reserveNames","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_kAddr","type":"address"},{"name":"_owner","type":"address"}],"name":"changeOwnerOf","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"bootstrap","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_creator","type":"address"},{"name":"_regName","type":"bytes32"},{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_by","type":"address"},{"indexed":true,"name":"_regName","type":"bytes32"},{"indexed":true,"name":"_kAddr","type":"address"}],"name":"ProductCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_kAddr","type":"address"}],"name":"ReceivedOwnership","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_registrar","type":"bytes32"},{"indexed":true,"name":"_kAddr","type":"address"}],"name":"RegistrarAdd","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_registrar","type":"bytes32"},{"indexed":true,"name":"_kAddr","type":"address"}],"name":"RegistrarRemove","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_by","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Withdrawal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangeOwnerTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_oldOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_resource","type":"bytes32"}],"name":"ChangedResource","type":"event"}]
```

### SandalStraps
```
function SandalStraps(address _creator, bytes32 _regName, address _owner);
```
The constructor sets registry name and contract ownership before creating
the top level registrar `metaRegistrar`.

### ()
```
function () payable
```
The contract can receive ether payments to the default function

### VERSION
```
function VERSION() public constant returns (bytes32)
```
Returns the contract's version as `bytes32`

### creator
```
function creator() public constant returns (address)
```
Returns the address that created the contract.

### __initFuse
```
function __initFuse() public constant returns (uint8);
```
Returns the current init level:
 
1 - Call to `_init1()` required

2 - Call to `_init2()` required

0 - Contract has been initialized

### _init1
```
function _init1() public returns (bool);
```
Creates and registers registrars 'factories' and 'registrar'.
Must be called first after contract creation.

### _init2
```
function _init2() public returns (bool);
```
Self registers the SandalStraps instant, metaRegistrar and bootstrap factory.
Must be called second.

### bootstrap
```
function bootstrap() public constant returns (address)
```
Returns the address of the origional `bootstrap` registrar factory.

### metaRegistrar
```
function metaRegistrar() public constant returns (address)
```
Returns the address of the current root level registrar.

### reservedNames
```
function reservedNames(bytes32 _regName) public constant returns (bool)
```
Returns the reserved status of a registry name.

`_regName` A registry name.

Returns `true` for reserved, `false` for unreserved

### addr
```
function addr(bytes32 _regName) public constant returns (address kAddr_)
```
An ENS compliant lookup function to return an address of a contract registered
in `metaRegistrar` 

`_regName` A registered name.

Returns `kAddr_` The address of the contract `_regName`

### addressByNameFrom
```
function addressByNameFrom(bytes32 _registrar, bytes32 _regName) public constant returns (address kAddr_)
```
A lookup function to return an address of a contract registered in a specified 2nd level registrar given a name.

`_registrar` A registered name of a registrar registered in `metaRegistrar`.

`_regName` A registered name.

Returns `kAddr_` The address of the contract `_regName`

### indexByNameFrom
```
function indexByNameFrom(bytes32 _registrar, bytes32 _regName) public constant returns (uint idx_)
```
A lookup function to return an index of a contract registered in a specified 2nd level registrar given a name.

`_registrar` A registered name of a registrar registered in `metaRegistrar`.

`_regName` A registered name.

Returns `idx_` The index of the contract `_regName` in `_registrar`

### indexByAddressFrom
```
function indexByAddressFrom(bytes32 _registrar, address _kAddr) public constant returns (uint idx_)
```
A lookup function to return an index of a contract registered in a specified 2nd level registrar given and address.

`_registrar` A registered name of a registrar registered in `metaRegistrar`.

`_kAddr` A contract address.

Returns `idx_` The index of the contract at `_kAddr` in `_registrar`

### nameByAddressFrom
```
function nameByAddressFrom(bytes32 _registrar, address _kAddr) public constant returns (bytes32 regName_)
```
A lookup function to return an registered name of a contract registered in a specified 2nd level registrar given an address.

`_registrar` A registered name of a registrar registered in `metaRegistrar`.

`_kAddr` A contract address.

Returns `regName_` The name of the contract at `_kAddr` in `_registrar`

### nameByIndexFrom
```
function nameByIndexFrom(bytes32 _registrar, uint _idx) public constant returns (bytes32 regName_)
```
A lookup function to return an registered name of a contract registered in a specified 2nd level registrar given an index.

`_registrar` A registered name of a registrar registered in `metaRegistrar`.

`_idx` A contract address.

Returns `regName_` The name of the contract at index `_idx` in `_registrar`

### getAddFactoryFee
```
function getAddFactoryFee() public constant returns (uint fee_)
```
Returns the fee required to register a factory contract. A zero value will be returned if a `Value` contract with the reserved name `ssfactoryfee` has not been registered in `metaRegistrar`

Returns `fee_` being the required payment to register a factory

### getCommissionDivisor
```    
function getCommissionDivisor() public constant returns (uint div_)
```
Returns the divisor value which determins the commission added to the price of a product contract according to the equasion `price / commission`. A zero value will be returned if a `Value` contract with the reserved name `sscommission` has not been registered in `metaRegistrar`

Returns `div_` being the denominator value of the commission calculation

### getProductPrice
```
function getProductPrice(bytes32 _factory) public constant returns (uint price_)
```
Returns the total price payable to create a product contract.

`_factory` The name of a registered factory

Returns `price_` the price in ether including any commission.

### addFactory
```
function addFactory(address _kAddr) public returns (bool)
```
Registers a factory contract and creates a 2nd level registrar of the same name in which it's products are registered.

`_kAddr` A factory contract address.

Returns boolean success value

### newProduct
```
function newProduct(bytes32 _factory, bytes32 _regName, address _prodOwner) public returns (address kAddr_)
```
Creates and registers a new product contract from factory `_factory`. A payment of ether is required if the factory contract has set a price.

`_factory` The factory name from which to create a product.

`_regName` A registry name to give the product contract.

`_prodOwner` An address by which the product will be owned. If `0x0`, the product will be owned by the caller `msg.sender`.

Returns `kAddr_` being the address of the new product contract.

### addTo
```
function addTo(bytes32 _registrar, address _kAddr) public returns (bool)
```
For the owner to register a contract in a registrar

`_registrar` The name of a registrar

`_kAddr` A SandalStraps compliant contract address.

Returns boolean success value

### removeFrom
```
 function removeFrom(bytes32 _registrar, address _kAddr) public returns (bool)
```
For the owner to deregister a contract from a registrar

`_registrar` The name of a registrar

`_kAddr` A SandalStraps compliant contract address.

Returns boolean success value

### reserveNames
```    
function reserveNames(bytes32[] _regNames, bool[] _reserved) public returns (bool)
```
For the owner to reserve/unreserve an array of names to prevent or allow the thirdparty registration of contracts with those names.

`_regNames` An array of names

`_reserved` A respective array of reservation states. `true` prevents third-party registration of contracts with the respective name. 
    
Returns boolean success value

### withdrawAll
```
function withdrawAll() public returns (bool)
```
Withdraws the contracts ether balance to the creator or wallet address if one has been registered with the name `sswallet`.  Can be called by anyone.

Returns boolean success value

### callAsContract
```
function callAsContract(address _kAddr, bytes _callData) public returns (bool)
```
For the owner to make a low level call to another contract using the SandalStraps instance as a proxy.  This can be useful for calling SandalStraps owned contracts.

`_kAddr` A contract address.

`_callData` Precompiled call data

Returns boolean success value

### changeOwnerOf
```
function changeOwnerOf(address _kAddr, address _owner) public returns (bool)
```
For the owner to change the owner of a contract owned by the SandalStraps instance

`_kAddr` A contract address.

`_owner` The new owner address

Returns boolean success value

### receiveOwnershipOf
```
function receiveOwnershipOf(address _kAddr) public returns (bool)
```
For the SandalStraps instance to recieve ownership of a contract.

`_kAddr` A contract address.

Returns boolean success value

### changeResourceOf
```
function changeResourceOf(address _kAddr, bytes32 _resource) public returns (bool)
```
For the owner to change the `RegBase` `resource` of a contract owned by the instance of SandalStraps

`_kAddr` A contract address.

`_resource` The resource value

Returns boolean success value

### setValueOf 
```
function setValueOf(address _kAddr, uint _value) public returns (bool)
```
For the owner to change the `value` of a `Value` contract owned by the instance of SandalStraps

`_kAddr` A contract address.

`_value` The value to be set

Returns boolean success value

### Events

### ProductCreated
```
event ProductCreated(bytes32 indexed _regName, address indexed _kAddr);
```
Triggered when a factory product contract is created

`_regName` The product name.

`_kAddr` The product address.

### ReceivedOwnership
```
event ReceivedOwnership(address indexed _kAddr);
```
Logged when SandalStraps accepts ownership of a contract

`_kAddr` A contract address.

### RegistrarAdd
```
event RegistrarAdd(bytes32 indexed _registrar, address indexed _kAddr);
```
Logged when a registrar entry is changed

`_registrar` The name of the modified registry

`_kAddr` A registered contract address.

### RegistrarRemove
```
event RegistrarRemove(bytes32 indexed _registrar, address indexed _kAddr);
```
Logged when a registration is remove

`_registrar` The name of the modified registry

`_kAddr` A registered contract address.

___
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

___
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

___
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

___
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

___
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

