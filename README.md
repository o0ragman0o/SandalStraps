# SandalStraps
v0.4.0

An extensible framework of registrars, factories and product smart contracts for the 
Ethereum platform.

WARNING: This code base and the contract framework it enables is *experimental* and has not yet been independently audited.

___
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
* added ENS `content(address _regName) publiv view returns (bytes32 resource_);`
* pragma solidity 0.4.17

### SandalStraps.sol
* Completely breaking changes
* Added minimum Withdrawable API compliance
* Change factoryFee to productPrice
* Changed newFromFactoryFee to commission
* Changed "newfromfactoryfee" to "sswallet"
* Hardcoded predeployed bootstrap address
* removed __init3()
* Renamed registrar proxy getters according to registrar getter name changes
* Removed `event RegistrarChange(bytes32 indexed _registrar, address indexed _kAddr);`
* Added `function removeFrom(bytes32 _registrar, address _kAddr)`
* Added `event RegistrarRegister(bytes32 indexed _registrar, address indexed _kAddr);`
* Added `event RegistrarRemove(bytes32 indexed _registrar, address indexed _kAddr);`
* Added `reservedNames` mapping for to allow only owner to add reserved name contracts
* Added `function changeReservedName(bytes32 _regName, bool _reserved) returns (bool);
* Added explicit reentry protection with `ReentryProtected` contract
* `addFactory()` to `registerFactory(address _kAddr)`
* `addTo()` to `registerIn()
* pragma solidity 0.4.17


___
## Purpose
On Ethereum, immutible code in the form of smart contracts poses potential 
hazards when that code doesn't work as intended. It is by nature difficult to 
stop, correct and upgrade unless explicitly written to do so. Strategies to 
mitagate these hazards advise against writing complex contracts in the first 
place and instead encourage simplicity and atomicity of logic.  While there is 
utilitarian scope for contracts
of isolated simple function, it would seem an unlikely way to fully realise the 
potential of Ethereum as a distributed organisation and applications technology.

This framework seeks to provide a modular foundation for complex organisational
and functional structures to flourish on the Ethereum platform.

## Architecture
The Sandal Straps framework seeks to provide a modular kernel to manage a 
scalable and extensible body of interacting contracts, in order to develop 
complex upgradeable organisations from simpler component contracts.

There are four primary categorys of contracts in the framework:

* **SandalStraps** kernel which holds and manages a registrar called
`metaregistrar` in which *factories*, *registrars* and administerative contracts
are registered.
* **Registrars** hold *Name->Index* and *Index->Address* mappings to registered.
They also implement then ENS `addr()` and `content()` interfaces
contracts and can provide an iteration source for those entries.
* **Factories** are contracts containing bytecode of a product contract for 
deployment.
* **Product** contracts could be anything providing a required functionality and 
are created by a registered factory and registered in a `registrar` of the same
name as the factory.  They may be independent from the framework or be an
interactive component unto it.
* **Ancillary** contracts are any contracts that support the framework or
organization by providing managment controls such as fee values, permissioning,
and string of `bytes` mappings for contract resource lookup.

A *SandalStraps* organization can be considered to be the sum total of contract
functionally and data registered in its `metaRegistrar`.  In this way
administrative and functional components can be added or updgraded by
registering the necessary contracts and their factories.  If and organizations
SandalStraps kernel itself requires upgrading then ownership of its
`metaRegistrar` can simply be transferred to the new kernal.
  
## Protocol Requirments
*SandalStraps* compliant contracts MUST implement a common constructor and
minimal API derived from the `RegBase` contract. This ensures that a contract
has the minimum set of properties and methods in order to be managed by
`registrar` and UI components:

* `<ContractName>(address _creator, bytes32 _regName, address _owner)` - The compliant constructor
* `address owner` - An addressed used for permissioned action upon the contract
* `bytes32 regName` - A name by which a contract is read by a `Registrar` contract
* `bytes32 resource` - A datum which can be interpreted to discover additional resources pertaining to the contract
* `changeOwner(address _addr)` - A function by which contract ownership transfer is initited

An initialization function may be required where a contract would normally initialize state during construction, e.g.,

* `_init(<args>)`

Additional interfaces that are used in the framework consist of the `Value` API and [`Withdrawable`](https://github.com/o0ragman0o/Withdrawable) ether payments API which implement:

* `function value() public constant returns (uint)`
* `function withdrawAll() public returns (bool)`

## Registrars
*SandalStraps Registrars* are Ethereum Name Service (ENS) compilant resolvers
which impliment the
[EIP137](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-137.md) `address`
and `content` record interfaces to return the address and resource from a
registered contract.

Internally, Registrars store lookup data by `Name->Index` and `Index->Address`
mappings with the `regName` being returned from the contract being looked up.
This gives the lookup keys of `regName`,`index` and `address`.

Registrations can be added and removed by the `Registrar` `owner` and the
registered contract's `owner`.

## Factories
A `Factory` extends the SandalStraps compliant `RegBase` API and contains the
compiled byte code of a *product* contract.  This allows self-contained
deployment of a contract by a simple call to the function
`createNew(bytes32 _regName, address _owner)` together with an ether value if
the factory specifies a product price.

`Factory` also implements the `Value` and `Withdrawable` API's. The owner may
set the `value` state which is interpreted as a price in ether that must be paid
in order to create a product contract.

Typically a product is created and registered into an associated SandalStraps
organisation by a call to `newProduct()`. Products can be created with a direct
call to the factory but will not be advantaged by registration into a
SandalStraps organization.

Adding a factory to a SandalStraps instance will register it into the `factories` 
registrar and also create a registrar of the factory's `regName` if it didn't 
already exist.  When a product is created through `newProduct()`, it is 
entered into the registrar of its factory's name.

## SandalStraps
`SandalStraps` provides the central interface and core management of a
`SandalStraps` organization. Its primary purpose is to manage registrars,
reserved names, provision product creation and collect and transfer fees.
Proxying functionality allows it to arbitrarily own and call contracts and
thereby hold value in value holding contracts such as ERC20 tokens. Only the
owner is permissioned to used the `callAsContract()` function.

A number of administrative names are reserved to which only the owner can
register contracts of those names. While the owner can reserve any name, the
following names are explicity reserved in code:

* `metaregistrar` - Being for the root level registrar
* `factories` - being for the registrar in which factory contracts are
registered
* `registrar` - being for the registrar when product registrars are registered
* `sswallet` - being for an optional wallet contract to which funds are sent
upon calling `withdrawAll()`.  If this name is not registered in
`metaregistrar`, funds will be sent to the SandalStraps `creator` which is
typically the SandalStraps factory.
* `sscommision` being for an optional `Value` contract which provides a divisor
to calculate a commission payable to the SandalStraps contract on top of a
factory price when a product contract is created.  A typical value might be in
the range of 20~1000 which give percentages of 5% to 0.1%.
* `ssfactoryfee` being for an optional `Value` contract which provides a fee
required to be paid when registering a factory. The owner is not charged the fee
and may set it impossibly high to prevent 3rd parties registering factories.

## Ether Managment
*SandalStraps* compliant contracts which handle *ether* MUST implement at least
the [minimal `Withdrawable` API](https://github.com/o0ragman0o/Withdrawable)
consisting of:

* `function WithdrawAll()`
* `event Deposit(address _from, uint _value)`
* `event Withdrawal(address _by, address _to, _value)`

If a contract handles ether for multiple addresses, it SHOULD implement:

* `function WithdrawAllFor(address[] _addrs)`
___

## Fees and Fee Collection
The `SandalStraps` contract and compliant factories may collect optional fees
and commissions.

An owner of a factory contract can set its `value` by calling
`changeValue(uint _value)`.
This value is interpreted as a price in ether which must be paid upon calling
`createNew()`.

In addition to a possible `Factory` fee, fees can be charged by a `SandalStraps`
instance upon registering a new `Factory` through `addFactory()` and creating 
a new product by calling `newProduct()`.

In order for a `SandalStraps` instance to collect fees, one or both `Value` 
contracts with the `regName` of `sscommision` and `ssfactoryfee` need to be
registered in `metaregistrar`

The fees collected by the SandalStraps instance can be withdrawn to its
`creator` or a contract called `sswallet` if one is registered in
`metaregistrar`.

Fees collected by a `Factory` can be withdrawn to the factory owner.

___
## Writing SandalStraps Compliant Contracts

Any contract can be written as `SandalStraps` compliant by importing 
`Factory.sol` which will in turn import `RegBase` as in the following
boilerplate `RegBase` and `Factory` examples.

```
import "https://github.com/o0ragman0o/SandalStraps/contracts/Factory.sol";

pragma solidity ^0.4.17;

contract SS_Foo is RegBase
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
        Factory(_creator, regName, _owner)
    {
        // note that the constant `regName` is passed to the super rather
        // than parameter `_regname`
        _regName; // to quiet compiler warning
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
to a `SandalStraps` kernel instance by calling the function
`registerFactory(address _factoryAddress)` the add factory fee if one is
specified by `ssfactoryfee`.

Adding a `Factory` in this way will also create an associated `Registrar` of 
the `regName` of the `Factory`.  All product contracts of that factory which 
are created by calling:

`function newFromFactory(bytes32 _factoryRegName, bytes32 _newContractRegName)` 

will be registered in that registrar.
___
# API's used by SandalStraps
* [ENS](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-137.md)
* [Owned](https://github.com/o0ragman0o/Owned)
* [RegBase](https://github.com/o0ragman0o/SandalStraps/blob/master/docs/RegBase.md)
* [Registrar](https://github.com/o0ragman0o/SandalStraps/blob/master/docs/Registrar.md)
* [Factory](https://github.com/o0ragman0o/SandalStraps/blob/master/docs/Factory.md)
* [SandalStraps](https://github.com/o0ragman0o/SandalStraps/blob/master/docs/SandalStraps.md)
* [Value](https://github.com/o0ragman0o/SandalStraps/blob/master/docs/Value.md)
* [StringsMap](https://github.com/o0ragman0o/SandalStraps/blob/master/docs/StringsMap.md)
* [BytesMap](https://github.com/o0ragman0o/SandalStraps/blob/master/docs/BytesMap.md)
* [Withdrawable](https://github.com/o0ragman0o/Withdrawable)
