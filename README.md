# SandalStraps
A extensible framework of registrars factories and product smart contracts for Etherium platforms.

## Purpose
On Ethereium, immutible code in the form of smart contracts poses potential hazards when that code doesn't work as intended. It is by nature difficult to stop, correct and upgrade unless explicitly written to do so.  Strategies to mitagate these hazards advise against writting complex contracts in the first place and instead encourage simplicity and atomicity of logic.  While there is utilitarian scope for contracts
of isolated simple function, it would seem an unlikely way to realise the potential of Ethereium as an applications technology in the blockchain field.

The Sandal Straps framework seeks to provide a modular kernal to manage a scalable and extensible body of interacting contracts, in order to develop complex upgradeable organisations from simple component contracts.

There are four primary catagorys of contracts in the framework
* The SandalStraps kernal which holds and manages a registrar of registrars.
* Registrars hold Name->Index and Index->Address mappings to component contracts and so can provide and iteration source for entries.
* Factories are contracts dedicated to creating a multiplicity of a single type of product contract.
* Product contracts could be anything providing a required functionality and creatable by a factory, including the SandalStraps and Registrar contracts themselves (implying that SandalStraps can selfspawn).

All contracts are required to present a minimum interface presenting public functions for `owner()` and `regName()`.
All product contracts require a standard contstructor:
    `function <contract>(address _creator, bytes32 _regName, address _owner)` 
in order to be referenced by registrars and created by factories. 
The `_owner` parameter is optional and exists to award ownership to a third-party upon creation.  If set to 0x0, it will give ownership to msg.sender which is passed to the `_creator` parameter by the SandalStraps `newFromFactory` function.

Any contract specific initialization that would normally be done by a constructor should instead be done post deployment by an init() function.

Factory contracts should be independant entities and agnostic towards the caller. 

** SandalStraps Kernal Contact
The SandalStraps kernel contains a minimal Registrar factory called `bootstrap`.  Once it is deployed, three initialization functions are require to be called in sequence in order to build the central `metaRegistrar` and ancilary registrar `factories` and register loopbacks for `metaRegistrar` and the SandalStraps instance.

Once initialized, adding a factory will register it into the `factories` registrar and also create a registrar of the `regName` of the factory if it didn't already exist.  When a product is created through `newFromfactory()`, it is entered into the registrar of its factory's name.

SandalStraps
    bootstrap

metaRegistrar
    metaRegistrar
    SandalStraps
    registrars
    	bootstrap
    factories
        factory_1
        factory_2
        ...
        factory_N
    factory_1
        product_1a
        product_1b
        ...
        product_1N
    factory_2
        product_2a
        product_2b
        ...
        product_2N
    factory_3
        product_3a
        product_3b
        ...
        product_3N

factory_1

factory_2

factory_3

## Administration

The SandalStraps contract owns the registries it creates and will only allow state mutations by the SandalStraps owner.  For multiple owners, an `Actor` interface can be set as the owner and be customised to manage permissions and authorisations for instance in the form of a multisig or further developed to provide voting functionalities as required by a large DAO.