## SandalStraps Kernel Contract API

NOTE: This contract requires post deployment initialization by calling `_init1()` and `_init2`

Upon construction the `SandalStraps` kernel calls a predeployed `RegistrarFactory`.
Once it is deployed, two initialisation functions, `init1()` 
`init2()` are require to be called in sequence in order to build ancillary 
registrars `factories` and `registrar` 
and register loopbacks for `metaRegistrar` and the `SandalStraps` instance.

In addition to the `regBase` API, the `SandalStraps` kernel provides the
following functions:

```
[{"constant":true,"inputs":[{"name":"_registrar","type":"bytes32"},{"name":"_kAddr","type":"address"}],"name":"nameByAddressFrom","outputs":[{"name":"regName_","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_resource","type":"bytes32"}],"name":"changeResource","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"creator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_kAddr","type":"address"},{"name":"_value","type":"uint256"}],"name":"setValueOf","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_registrar","type":"bytes32"},{"name":"_kAddr","type":"address"}],"name":"removeFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCommissionDivisor","outputs":[{"name":"div_","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"regName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_kAddr","type":"address"}],"name":"receiveOwnershipOf","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_kAddr","type":"address"}],"name":"addFactory","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_registrar","type":"bytes32"},{"name":"_kAddr","type":"address"}],"name":"addTo","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_registrar","type":"bytes32"},{"name":"_kAddr","type":"address"}],"name":"indexByAddressFrom","outputs":[{"name":"idx_","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"_init1","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"reservedNames","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"resource","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_regName","type":"bytes32"}],"name":"addr","outputs":[{"name":"kAddr_","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"metaRegistrar","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_registrar","type":"bytes32"},{"name":"_idx","type":"uint256"}],"name":"nameByIndexFrom","outputs":[{"name":"regName_","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"_init2","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_factory","type":"bytes32"},{"name":"_regName","type":"bytes32"},{"name":"_prodOwner","type":"address"}],"name":"newProduct","outputs":[{"name":"kAddr_","type":"address"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_kAddr","type":"address"},{"name":"_resource","type":"bytes32"}],"name":"changeResourceOf","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdrawAll","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_kAddr","type":"address"},{"name":"_callData","type":"bytes"}],"name":"callAsContract","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_factory","type":"bytes32"}],"name":"getProductPrice","outputs":[{"name":"price_","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_registrar","type":"bytes32"},{"name":"_regName","type":"bytes32"}],"name":"indexByNameFrom","outputs":[{"name":"idx_","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"changeOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"__initFuse","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_registrar","type":"bytes32"},{"name":"_regName","type":"bytes32"}],"name":"addressByNameFrom","outputs":[{"name":"kAddr_","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAddFactoryFee","outputs":[{"name":"fee_","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_regNames","type":"bytes32[]"},{"name":"_reserved","type":"bool[]"}],"name":"reserveNames","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_kAddr","type":"address"},{"name":"_owner","type":"address"}],"name":"changeOwnerOf","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"bootstrap","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_creator","type":"address"},{"name":"_regName","type":"bytes32"},{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_by","type":"address"},{"indexed":true,"name":"_factoryName","type":"bytes32"},{"indexed":true,"name":"_regName","type":"bytes32"},{"indexed":false,"name":"_kAddr","type":"address"}],"name":"ProductCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_kAddr","type":"address"}],"name":"ReceivedOwnership","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_registrar","type":"bytes32"},{"indexed":true,"name":"_kAddr","type":"address"}],"name":"RegistrarAdd","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_registrar","type":"bytes32"},{"indexed":true,"name":"_kAddr","type":"address"}],"name":"RegistrarRemove","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_by","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Withdrawal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangeOwnerTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_oldOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_resource","type":"bytes32"}],"name":"ChangedResource","type":"event"}]
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

### \_\_initFuse
```
function __initFuse() public constant returns (uint8);
```
Returns the current init level

1 - Call to `_init1()` required

2 - Call to `_init2()` required

0 - Contract has been initialized

### \_init1
```
function _init1() public returns (bool);
```
**Must be called first after contract creation.**
Creates and registers registrars 'factories' and 'registrar'.

### _init2
```
function _init2() public returns (bool);
```
**Must be called after `_init1`**
Self registers the SandalStraps instant, metaRegistrar and bootstrap factory.

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
event ProductCreated(
        address indexed _by,
        bytes32 indexed _factoryName,
        bytes32 indexed _regName,
        address _kAddr);
```
Triggered when a factory product contract is created

`_by` The address of the caller.

`_factoryName` The `regName` of the creating factory

`_regName` The `regName` given to the product.

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
