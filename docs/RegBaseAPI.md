## RegBase API v0.4.0
Regbase inherits ownership funactionality from the
[Ownable](https://github.com/o0ragman0o/Owned)
 API. In addition to the `Ownable` API, all `SandalStraps` compliant contracts
 present the following additioonal public functions:
```
[{"constant":false,"inputs":[{"name":"_resource","type":"bytes32"}],"name":"changeResource","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"regName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"resource","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_creator","type":"address"},{"name":"_regName","type":"bytes32"},{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_resource","type":"bytes32"}],"name":"ChangedResource","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangeOwnerTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_oldOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangedOwner","type":"event"}]
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

### destroy
```
function destroy(bytes32 _safePhrase);
```
To destroy the contract and send money to the owner. This should be overloaded
by a deriving contract which should first attempt to delete its storage.
This function requires the safe phrase *"I want to destroy this contract."*
to be passed.

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
would otherwise be passed to a constructor, an initialisation function and
optional fuse can instead be included and called post deployment. `__initFuse`
should use inverted logic and construct as `true` and be deleted (set to
`false`) upon initialisation.

`__initFuse` should be set to `true` during construction, tested for deleted by

`_init()`

### EVENTS
```
event ChangedResource(bytes32 indexed _resource);
```
Logged on change of resource
