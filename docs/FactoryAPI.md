## Factory API v0.4.0
A factory embeds the bytecode of a product contract which can be deployed by
calling `createNew()`.  It's registry name (regName) MUST be the product name
and set as a `bytes32 public constant`. The `_regName` parameter is ignored. 

In addition to the base compliant API, a `SandalStraps` `Factory` contract 
exposes a minimum of the following functions:
```
[{"constant":false,"inputs":[{"name":"_resource","type":"bytes32"}],"name":"changeResource","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"regName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"resource","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"value","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_price","type":"uint256"}],"name":"set","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_safePhrase","type":"bytes32"}],"name":"destroy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdrawAll","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_regName","type":"bytes32"},{"name":"_owner","type":"address"}],"name":"createNew","outputs":[{"name":"kAddr_","type":"address"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_creator","type":"address"},{"name":"_regName","type":"bytes32"},{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_creator","type":"address"},{"indexed":true,"name":"_regName","type":"bytes32"},{"indexed":true,"name":"_kAddr","type":"address"}],"name":"Created","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_by","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Withdrawal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_resource","type":"bytes32"}],"name":"ChangedResource","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangeOwnerTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_oldOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangedOwner","type":"event"}]
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
Sets the price to be paid in ether to created product contracts

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
