# SandalStraps
v0.4.0

An extensible framework of registrars, factories and product smart contracts for 
Ethereum platforms.

WARNING: This code base and the contract framework it enables is *experimental*. It has not been audited or fully tested.  It still likely contains bugs in implimentation and integration.

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
* Added explicit reentry protection using `ReentryProtected` contract base

___
## Purpose
On Ethereum, immutible code in the form of smart contracts poses potential 
hazards when that code doesn't work as intended. It is by nature difficult to 
stop, correct and upgrade unless explicitly written to do so. Strategies to 
mitagate these hazards advise against writing complex contracts in the first 
place and instead encourage simplicity and atomicity of logic.  While there is 
utilitarian scope for contracts
of isolated simple function, it would seem an unlikely way to fully realise the 
potential of Ethereum as a distributed applications technology.

This framework seeks to provide a safe foundation for complex organisational
and functional structures to flourish on the Ethereum platform.

## Architecture
The Sandal Straps framework seeks to provide a modular kernel to manage a 
scalable and extensible body of interacting contracts, in order to develop 
complex upgradeable organisations from simple component contracts.

There are four primary categorys of contracts in the framework:

* **SandalStraps** kernel which holds and manages a registrar called `metaregistrar` in which *factories*, *registrars* and administerative contracts are registered.
* **Registrars** hold *Name->Index* and *Index->Address* mappings to registered 
contracts and can provide an iteration source for those entries.
* **Factories** are contracts containing bytecode of a product contract for 
deployment.
* **Product** contracts could be anything providing a required functionality and 
are created by a registered factory and registered in a `registrar` of the same name as the factory.  They may be independent from the framework or be an interactive component unto it.
* **Ancillary** contracts and any contracts that support the framework or organization by providing managment controls such as fee values, permissioning, or string mapping for contract resource lookup

A *SandalStraps* organization can be considered to be the sum total of contract functionally and data registered in its `metaRegistrar`.  In this way administrative and functional components can be added or updgraded by registering the necessary contracts and or their factories.  If the SandalStraps kernel requires upgrading then ownership of the `metaRegistrar` can simply be transferred to the new kernal.
  
## Protocol Requirments
*SandalStraps* compliant contracts MUST implement a common constructor and minimal API derived from the `RegBase` contract. This ensures that a contract has the minimum set of properties and methods in order to be managed by `registrar` and UI components:

* `<ContractName>(address _creator, bytes32 _regName, address _owner)` - The compliant constructor
* `address owner` - An addressed used for permissioned action upon the contract
* `bytes32 regName` - A name by which a contract is read by a `Registrar` contract
* `bytes32 resource` - A datum which can be interpreted to discover additional resources pertaining to the contract
* `changeOwner(address _addr)` - A function by which ownership transfer is initited

An initialization function may be required where a contract would normally initialize state during construction.

* `_init(<args>)`

Additional interfaces that are used in the framework consist of the `Value` and [`Withdrawable`](https://github.com/o0ragman0o/Withdrawable) API's and impliment:

* `function value() public constant returns (uint)`
* `function withdrawAll() public returns (bool)`

## Registrars
*SandalStraps Registrars* are Ethereum Name Service (ENS) compilant resolvers which impliment the [EIP137](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-137.md) `address` record interface to return the address of a registered name.

Internally, Registrars store lookup data by `Name->Index` and `Index->Address` mappings with the `regName` being returned from the contract being lookup.  This gives the lookup keys of `regName`,`index` and `address`.

Registrations can be added and removed by the `Registrar` `owner` and the registered contract's `owner`.

## Factories
A `Factory` extends the SandalStraps compliant RegBase and contains the compiled byte code of a *product* contract to allow self-contained deployment of a contract by a simple call to the function `createNew(bytes32 _regName, address _owner)`.

`Factory` also implements the `Value` and `Withdrawable` API's. The owner may set the `value` state which is interpreted as a price in ether that must be paid in order to create a product contract.

Typically a product is created and registered by an associated SandalStraps organisation by a call to `newProduct()`. Products can be created with a direct call to the factory but will not be advantaged by registration into a SandalStraps organization.

Although factories are independent of the the `SandalStraps` instance and can 
create products and collect fees without one, those products do not benefit 
from registration in the framework.

Adding a factory to a SandalStraps instance will register it into the `factories` 
registrar and also create a registrar of the factory's `regName` if it didn't 
already exist.  When a product is created through `newProduct()`, it is 
entered into the registrar of its factory's name.

## SandalStraps
`SandalStraps` provides the central interface and core management of a `SandalStraps` organization. It's primary purpose is to manage registrars, reserve name, provision product creation and collect and transfer fees. Proxying functionality allows it to own contracts and thereby hold value in value holding contracts such as ERC20 tokens.

A number of administritave names are reserved to which only the owner can register contracts of those names. While the owner can reserve any name, the initial reserved names are:

* `metaregistrar` - Being for the root level registrar
* `factories` - being for the registrar in which factory contracts are registered
* `registrar` - being for the registrar when product registrars are registered
* `sswallet` - being for an optional wallet contract to which funds are sent upon calling `withdrawAll()`.  If this name is not registered in `metaregistrar`, funds will be sent to the SandalStraps `creator` which is typically the SandalStraps factory.
* `sscommision` being for an optional `Value` contract which provides a divisor to calculate a commission payable to the SandalStraps contract on top of a factory price when a product contract is created.  A typical value might be in the range of 20~1000 which give percentages of 5% to 0.1%.
* `ssfactoryfee` being for an optional `Value` contract which provides a fee required to be paid when registering a factory. The owner is not charged the fee and may set it impossibly high to prevent 3rd parties registering factories.

## Ether Managment
*SandalStraps* compliant contracts which handle *ether* MUST impliment at least the [minimal `Withdrawable` API](https://github.com/o0ragman0o/Withdrawable) consisting of:

* `function WithdrawAll()`
* `event Deposit(address _from, uint _value)`
* `event Withdrawal(address _by, address _to, _value)`
___
## Fees and Fee Collection
The `SandalStraps` contract and compliant factories can collect optional fees.

An owner of a factory contract can set it's `value` by calling `changeValue(uint _value)`.
This value is interpreted as a price in ether which must be paid upon calling `createNew()`.

In addition to a possible `Factory` fee, fees can be charged by a `SandalStraps`
instance upon registering a new `Factory` through `addFactory()` and creating 
a new product by calling `newProduct()`.

In order for a `SandalStraps` instance to collect fees, one or both `Value` 
contracts with the `regName`s of `sscommision` and `ssfactoryfee` have to be registered in `metaregistrar`

The fees collected by the SandalStraps instance can be withdrawn to its `creator` 
or a contract called `sswallet` if one is registered in `metaregistrar`.

Fees collected by a `Factory` can be withdrawn to the factory owner.

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
___
# API's used by SandalStraps
* [ENS](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-137.md)
* [RegBase](https://github.com/o0ragman0o/SandalStraps/docs/RegBase.md)
* [Registrar](https://github.com/o0ragman0o/SandalStraps/docs/Registrar.md)
* [Factory](https://github.com/o0ragman0o/SandalStraps/docs/Factory.md)
* [SandalStraps](https://github.com/o0ragman0o/SandalStraps/docs/SandalStraps.md)
* [Value](https://github.com/o0ragman0o/SandalStraps/docs/Value.md)
* [StringsMap](https://github.com/o0ragman0o/SandalStraps/docs/StringsMap.md)
* [BytesMap](https://github.com/o0ragman0o/SandalStraps/docs/BytesMap.md)
* [Withdrawable](https://github.com/o0ragman0o/Withdrawable)
