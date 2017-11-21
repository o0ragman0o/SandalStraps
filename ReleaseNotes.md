## Release Notes
v0.4.0 is breaking.

### RegBase.sol
* Importing and inheriting from `Ownable`

### Registrar.sol
* Completely breaking change.  Renamed all getters to more intuitive identifiers
* `indexedAddres()` to `addressByIndex()`
* `namedIndex()` to `indexByName()`
* `namedAddress` to `addressByName()`
* `addressIndex()` to `indexByAddress()`
* `indexName()` to `nameByIndex()`
* `add()` to `register()`
* removed ENS `addr()` (incompatible without using nameHash)
* pragma solidity 0.4.17

### SandalStraps.sol
* Completely breaking changes
* Added minimum Withdrawable API compliance
* Change factoryFee to productPrice
* Changed newFromFactoryFee to commission
* Changed "newfromfactoryfee" to "sswallet"
* Hardcoded predeployed bootstrap address
* removed `__init3()`
* Renamed registrar proxy getters according to registrar getter name changes
* Removed `event RegistrarChange(bytes32 indexed _registrar, address indexed _kAddr);`
* Added `function removeFrom(bytes32 _registrar, address _kAddr)`
* Added `event RegistrarRegister(bytes32 indexed _registrar, address indexed _kAddr);`
* Added `event RegistrarRemove(bytes32 indexed _registrar, address indexed _kAddr);`
* Added `reservedNames` mapping for to allow only owner to add reserved name contracts
* Added `function changeReservedName(bytes32 _regName, bool _reserved) returns (bool);`
* Added explicit reentry protection with `ReentryProtected` contract
* `addFactory()` to `registerFactory(address _kAddr)`
* `addTo()` to `registerIn()`
* pragma solidity 0.4.17


