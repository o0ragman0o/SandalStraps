## StringsMap API
The `StringsMap` contract is a `SandalStraps` compliant contract that stores
owned strings in a `bytes32 => string` mapping.  This can be useful for storing
`resource` strings longer than 32 bytes. A strings key is the sha3 hash of
msg.sender and the string.  A string can only be deleted by the
caller who set it or by the `StingsMap` owner using its mapping key.

In addition to the `RegBase API`, a `SandalStraps` `StringMap` contract
exposes a minimum of the following functions:

```
[{"constant":false,"inputs":[{"name":"_resource","type":"bytes32"}],"name":"changeResource","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_string","type":"string"}],"name":"store","outputs":[{"name":"hash_","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_string","type":"string"}],"name":"clear","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"regName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"resource","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"clearHash","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"strings","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_creator","type":"address"},{"name":"_regName","type":"bytes32"},{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_hash","type":"bytes32"}],"name":"Stored","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_resource","type":"bytes32"}],"name":"ChangedResource","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangeOwnerTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_oldOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"ChangedOwner","type":"event"}]
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
