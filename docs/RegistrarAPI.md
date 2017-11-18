## Registrar API
A registrar is a triangular lookup data structure with keys of *contract address
(kAddr)*, *contract name (regName)* and *registration index (idx)*
`kAddr` and `idx` are stored in mappings in the registrar while `regName` is
referenced from the registered contract

In addition to the `RegBase API`, a `SandalStraps` `Registrar` contract
exposes a minimum of the following functions:

```
[{"constant":true,"inputs":[{"name":"_interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_resource","type":"bytes32"}],"name":"changeResource","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"regName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"remove","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_regName","type":"bytes32"}],"name":"content","outputs":[{"name":"resource_","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_regName","type":"bytes32"}],"name":"addressByName","outputs":[{"name":"kAddr_","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"resource","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_regName","type":"bytes32"}],"name":"addr","outputs":[{"name":"kAddr_","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"register","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"size","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"indexByAddress","outputs":[{"name":"idx_","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"changeOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"indexByName","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_idx","type":"uint256"}],"name":"nameByIndex","outputs":[{"name":"regName_","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"addressByIndex","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_creator","type":"address"},{"name":"_regName","type":"bytes32"},{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_regName","type":"bytes32"},{"indexed":true,"name":"_address","type":"address"}],"name":"Registered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_regName","type":"bytes32"},{"indexed":true,"name":"_address","type":"address"}],"name":"Removed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangeOwnerTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_oldOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_kAddr","type":"address"}],"name":"ReceivedOwnership","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_resource","type":"bytes32"}],"name":"ChangedResource","type":"event"}]
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

### content
```
function content(bytes32 _regName)  public view returns (bytes32 resource_);
```
Standard ENS content interface (`0xd8389dc5`) to return the `resource` variable
of a registered contract address `_regName`

`_regName` The registration name of a registered contract

`resource_` Returns the resource of the contract with `_regName`

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

### register
```
function register(address _kAddr);
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
Logged when an address is registered

### Removed    
```
event Removed(bytes32 indexed _regName, address indexed _address);
```
Logged when an address is unregistered
    