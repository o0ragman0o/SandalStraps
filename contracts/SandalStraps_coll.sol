/******************************************************************************\

file:   SandalStraps_coll.sol
ver:    0.4.0
updated:21-Nov-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

A collation of all SandalStraps related contracts for the purpose of deployment
and post deployment validation.

Contracts included are:
* ReentryProtected
* OwnedAbstract
* Owned is OwnedAbstract
* Owning is Owned
* WithdrawableMinItfc
* RegBaseAbstract
* RegBase is Owned, RegBaseAbstract
* Factory is Regbase
* Registrar is RegBase
* RegistrarFactory is Factory
* Value is RegBase
* ValueFactory is Factory
* BytesMap is RegBase
* BytesMapFactory is Factory
* SandalStraps is ReentryProtected, RegBase, OwningItfc, WithdrawableMinItfc
* SandalStrapsFactory is Factory

\******************************************************************************/

pragma solidity ^0.4.17;




/******************************************************************************\

file:   ReentryProtection.sol
ver:    0.3.0
updated:6-April-2016
author: Darryl Morris
email:  o0ragman0o AT gmail.com

Mutex based reentry protection protect.

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU lesser General Public License for more details.
<http://www.gnu.org/licenses/>.

\******************************************************************************/

contract ReentryProtected
{
    // The reentry protection state mutex.
    bool __reMutex;

    // This modifier can be used on functions with external calls to
    // prevent reentry attacks.
    // Constraints:
    //   Protected functions must have only one point of exit.
    //   Protected functions cannot use the `return` keyword
    //   Protected functions return values must be through return parameters.
    modifier preventReentry() {
        require(!__reMutex);
        __reMutex = true;
        _;
        delete __reMutex;
        return;
    }

    // This modifier can be applied to public access state mutation functions
    // to protect against reentry if a `preventReentry` function has already
    // set the mutex. This prevents the contract from being reenter under a
    // different memory context which can break state variable integrity.
    modifier noReentry() {
        require(!__reMutex);
        _;
    }
}



/******************************************************************************\

file:   Owned.sol
ver:    0.3.0
updated:8-Nov-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

An expanded `Owned` API for user and inter-contract ownership and safe ownership
transfers.

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

\******************************************************************************/

contract OwnedAbstract {

//
// State Variable
//

    /// @return The address of the contract's owner
    address public owner;

    /// @dev optional
    /// @return An address which can accept ownership.
    address public newOwner;

    /// @dev Logged on initiation of change owner address
    event ChangeOwnerTo(address indexed _newOwner);

    /// @dev Logged on change of owner address
    event ChangedOwner(address indexed _oldOwner, address indexed _newOwner);

//
// Modifiers
//

    modifier onlyOwner {
        require (msg.sender == owner);
        _;
    }
    
//
// Function Abstracts
//

    /// @notice Initiate a change of owner to `_newOwner`
    /// @param _newOwner The address to which ownership is to be transfered
    /// @return A boolean success value
    function changeOwner(address _newOwner) public returns (bool);

    /// @dev optional
    /// @notice Finalise change of ownership to newOwner
    /// @return A boolean success value
    function acceptOwnership() public returns (bool);
}


// Example implementation.
contract Owned is OwnedAbstract{

    function changeOwner(address _newOwner)
        public
        onlyOwner
        returns (bool)
    {
        newOwner = _newOwner;
        ChangeOwnerTo(_newOwner);
        return true;
    }

    function acceptOwnership()
        public
        returns (bool)
    {
        require(msg.sender == newOwner);
        ChangedOwner(owner, msg.sender);
        owner = msg.sender;
        return true;
    }
}



/*****************************************************************************\

file:   Owning.sol
ver:    0.3.1
updated:21-Nov-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

To provision a contract to own another contract which has implemented the
`Owned` API  

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

Change Log
----------
* Added OwningItfc
\*****************************************************************************/

interface OwningItfc
{
    /// @dev Logged when the contract accepts ownership of another contract.
    event ReceivedOwnership(address indexed _kAddr);

    /// @dev Logged when the contract initiates an ownership change in a
    /// contract it owns.
    event ChangeOwnerOf(address indexed _kAddr, address indexed _owner);

    /// @notice Contract to recieve ownership of `_kAddr`
    /// @param _kAddr An address of an `Owned` contract
    function receiveOwnershipOf(address _kAddr) public returns (bool);

    /// @notice Change the owner of the owned contract `_kAddr` to `_owner`
    /// @param _kAddr The address of the owned contract
    /// @param _owner The address of the new owner
    /// @dev could be used to migrate to an upgraded SandalStraps
    /// @return bool value indicating success
    function changeOwnerOf(address _kAddr, address _owner)
        public returns (bool);
}



/******************************************************************************\

file:   Withdrawable.sol
ver:    0.4.2
updated:25-Oct-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

A contract interface presenting an API for withdrawal functionality of ether
balances and inter-contract pull and push payments. Caller permissions should
be left permissive to facilitate 'clearing house' operations.

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

\******************************************************************************/

// The minimum interface supporting pull payments with deposits and withdrawl
// events
interface WithdrawableMinItfc
{
//
// Events
//

    /// @dev Logged upon receiving a deposit
    /// @param _from The address from which value has been recieved
    /// @param _value The value of ether received
    event Deposit(address indexed _from, uint _value);
    
    /// @dev Logged upon a withdrawal
    /// @param _from the address accounted to have owned the ether
    /// @param _to Address to which value was sent
    /// @param _value The value in ether which was withdrawn
    event Withdrawal(address indexed _from, address indexed _to, uint _value);

    /// @notice withdraw total balance from account `msg.sender`
    /// @return success
    function withdrawAll() public returns (bool);
}




/******************************************************************************\

file:   RegBase.sol
ver:    0.4.0
updated:8-Nov-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

This file is part of the SandalStraps framework

`RegBase` provides an inheriting contract the minimal API to be compliant with 
`Registrar`.  It includes a set-once, `bytes32 public regName` which is refered
to by `Registrar` lookups.

An owner updatable `address public owner` state variable is also provided and is
required by `Factory.createNew()`.

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

Release notes:
* Frameworking changing to Factory v0.4.0 usage
* Importing and inheriting from `Owning` 
* pragma solidity 0.4.17 

\******************************************************************************/

contract RegBaseAbstract
{
    /// @dev A static identifier, set in the constructor and used for registrar
    /// lookup
    /// @return Registrar name SandalStraps registrars
    bytes32 public regName;

    /// @dev An general purpose resource such as short text or a key to a
    /// string in a StringsMap
    /// @return resource
    bytes32 public resource;

//
// Events
//

    /// @dev Logged on change of resource
    event ChangedResource(bytes32 indexed _resource);

//
// Function Abstracts
//

    /// @notice Will selfdestruct the contract
    function destroy() public;

    /// @notice Change the resource to `_resource`
    /// @param _resource A key or short text to be stored as the resource.
    function changeResource(bytes32 _resource) public returns (bool);
}


contract RegBase is Owned, RegBaseAbstract
{
//
// Constants
//

    bytes32 constant public VERSION = "RegBase v0.4.0";

//
// Functions
//

    /// @param _creator The calling address passed through by a factory,
    /// typically msg.sender
    /// @param _regName A static name referenced by a Registrar
    /// @param _owner optional owner address if creator is not the intended
    /// owner
    /// @dev On 0x0 value for owner, ownership precedence is:
    /// `_owner` else `_creator` else msg.sender
    function RegBase(address _creator, bytes32 _regName, address _owner)
        public
    {
        require(_regName != 0x0);
        regName = _regName;
        owner = _owner != 0x0 ? _owner : 
                _creator != 0x0 ? _creator : msg.sender;
    }
    
    /// @notice Will selfdestruct the contract
    function destroy()
        public
        onlyOwner
    {
        selfdestruct(msg.sender);
    }
    
    /// @notice Change the resource to `_resource`
    /// @param _resource A key or short text to be stored as the resource.
    function changeResource(bytes32 _resource)
        public
        onlyOwner
        returns (bool)
    {
        resource = _resource;
        ChangedResource(_resource);
        return true;
    }
}



/******************************************************************************\

file:   Factory.sol
ver:    0.4.0
updated:9-Oct-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

This file is part of the SandalStraps framework

Factories are a core but independant concept of the SandalStraps framework and 
can be used to create SandalStraps compliant 'product' contracts from embed
bytecode.

The abstract Factory contract is to be used as a SandalStraps compliant base for
product specific factories which must impliment the createNew() function.

is itself compliant with `Registrar` by inhereting `RegBase` and
compiant with `Factory` through the `createNew(bytes32 _name, address _owner)`
API.

An optional creation fee can be set and manually collected by the owner.

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

Release Notes
-------------
* Changed from`withdaw(<value>)` to `withdrawAll()`
* Set default function to be payable to recieve product commissions
* Changed _fee to _price
\******************************************************************************/

contract Factory is RegBase
{
//
// Constants
//

    // Deriving factories should have `bytes32 constant public regName` being
    // the product's contract name, e.g for products "Foo":
    // bytes32 constant public regName = "Foo";

    // Deriving factories should have `bytes32 constant public VERSION` being
    // the product's contract name appended with 'Factory` and the version
    // of the product, e.g for products "Foo":
    // bytes32 constant public VERSION "FooFactory 0.0.1";

//
// State Variables
//

    /// @return The payment in wei required to create the product contract.
    uint public value;

//
// Events
//

    // Is triggered when a product is created
    event Created(address indexed _creator, bytes32 indexed _regName, address indexed _kAddr);
    
    // Logged upon receiving a deposit
    event Deposit(address indexed _from, uint _value);
    
    // Logged upon a withdrawal
    event Withdrawal(address indexed _by, address indexed _to, uint _value);

//
// Modifiers
//

    // To check that the correct fee has bene paid
    modifier pricePaid() {
        require(msg.value == value);
        if(msg.value > 0)
            // Log deposit if fee was paid
            Deposit(msg.sender, msg.value);
        _;
    }

//
// Functions
//

    /// @param _creator The calling address passed through by a factory,
    /// typically msg.sender
    /// @param _regName A static name referenced by a Registrar
    /// @param _owner optional owner address if creator is not the intended
    /// owner
    /// @dev On 0x0 value for _owner or _creator, ownership precedence is:
    /// `_owner` else `_creator` else msg.sender
    function Factory(address _creator, bytes32 _regName, address _owner)
        public
        RegBase(_creator, _regName, _owner)
    {
        // nothing left to construct
    }
    
    function ()
        public
        payable
    {
        Deposit(msg.sender, msg.value);
    }

    /// @notice Set the product creation fee
    /// @param _price The desired fee in wei
    function set(uint _price)
        public
        onlyOwner
        returns (bool)
    {
        value = _price;
        return true;
    }

    /// @notice Send contract balance to `owner`
    function withdrawAll()
        public
        returns (bool)
    {
        Withdrawal(msg.sender, owner, this.balance);
        owner.transfer(this.balance);
        return true;
    }

    /// @notice Create a new product contract
    /// @param _regName A unique name if the the product is to be registered in
    /// a SandalStraps registrar
    /// @param _owner An address of a third party owner.  Will default to
    /// msg.sender if 0x0
    /// @return kAddr_ The address of the new product contract
    function createNew(bytes32 _regName, address _owner)
        public payable returns(address kAddr_);
}



/******************************************************************************\

file:   Registrar.sol
ver:    0.4.0
updated:13-Nov-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

This file is a part of the SandalStraps framework

Registrars are a core but independant concept of the SandalStraps framework.
They provide indexed name/address storage and lookup functionality to compliant
contracts.  A compliant contract requires `RegBase` as a minimum API.

A registered contract can be looked up by unique keys of, `regName`, `address` 
and `index`.

Only the `address` and `index` are stored in the registrar while `regName` is
stored in and looked up from the registered contract.

`Registrar` is itself Registrar compliant and so can be self registered or
registered in another `Registrar` instance.

`Registrar` is an ENS compliant resolver for the contracts registered in it.
It impliments the EIP137 `address` record interface.

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

\******************************************************************************/

contract Registrar is RegBase
{

//
// Constants
//

    /// @return The contract version number
    bytes32 constant public VERSION = "Registrar v0.4.0";

//
// State Variables
//

    // `size` is the index of the most rescent registration and does not 
    // decrease with removals.
    // Indexing begins at 1 and not 0, so to avoid out-by-one errors, iterate
    // in the form:
    //     for(i = 1; i <= size; i++) {...}
    uint public size;

    /// @dev `indexAddress` maps Index -> Address
    /// @return The registered address at an index
    mapping (uint => address) public addressByIndex;
    
    /// @dev `indexByName` maps a contracts `regName` -> Index
    /// @return The registration index of a registered contracts name
    mapping (bytes32 => uint) public indexByName;

//
//Modifiers
//

    // Test if sender is the registrar owner or registered contract owner
    modifier onlyOwners(address _contract)
    {
        require(msg.sender == owner ||
            msg.sender == Owned(_contract).owner());
        _;
    }

//
// Events
//

    // Triggered when an address is registered
    event Registered(bytes32 indexed _regName, address indexed _address);
    
    // Triggered when an address is unregistered
    event Removed(bytes32 indexed _regName, address indexed _address);
    
//
// Functions
//

    /// @param _creator The calling address passed through by a factory,
    /// typically msg.sender
    /// @param _regName A static name referenced by a Registrar
    /// @param _owner optional owner address if creator is not the intended
    /// owner
    /// @dev On 0x0 value for _owner or _creator, ownership precedence is:
    /// `_owner` else `_creator` else msg.sender
    function Registrar(address _creator, bytes32 _regName, address _owner)
        public
        RegBase(_creator, _regName, _owner)
    {
        // nothing to construct
    }
    
    /// @dev Return the registered address named `_regName`
    /// @param _regName A registered name
    /// @param kAddr_ The registered address
    /// @return kAddr_
    function addressByName(bytes32 _regName)
        public
        view
        returns (address kAddr_)
    {
        kAddr_ = addressByIndex[indexByName[_regName]];
    }
    
    /// @dev Returns a contracts `index` given its address
    /// @param _addr A registered address
    /// @param idx_ The registration index
    /// @return idx_
    function indexByAddress(address _addr)
        public
        view
        returns (uint idx_)
    {
        idx_ = indexByName[RegBase(_addr).regName()];
    }

    /// @dev Returns a contracts `regName` given its index
    /// @param _idx a registration index
    /// @param regName_ The name of a registered contract 
    /// @return regName_
    function nameByIndex(uint _idx)
        public
        view
        returns (bytes32 regName_)
    {
        regName_ = RegBase(addressByIndex[_idx]).regName();
    }
    
    /// @notice Add contract address `_addr` to the registrar.
    /// Sender must be Registrar owner or owner of new contract to add.
    /// Sender must be Registrar owner or owner of both new and registered
    /// contracts to update.
    /// Update is determined by prior registration of a `regName`.
    /// @dev Providing a prior address of an updated entry to `indexByAddress()`
    /// can be used to discover the newer contract. This is useful for upgrade
    /// path discovery
    /// @param _addr An address of a SandalStraps compliant contract
    /// @return bool indicating call success
    function register(address _addr)
        public
        onlyOwners(_addr)
        returns (bool)
    {
        // Get and validate regName from contract to be registered 
        bytes32 regName = RegBase(_addr).regName();
        require(regName != 0x0);
        
        // Get the index of the regName. 0 == not registered
        uint idx = indexByName[regName];

        // Prevent overwritting registrations if not the registrar owner or
        // contract's owner 
        if (0 != idx)
        {
            require(msg.sender == owner || 
                msg.sender == RegBase(addressByIndex[idx]).owner());
        } else {
            idx = ++size;
        }
        
        // Register the contract
        addressByIndex[idx] = _addr;
        indexByName[regName] = idx;
        Registered(regName, _addr);
        return true;
    }
    
    /// @notice Delete the registration of contract at `_addr`
    /// @param _addr The address of a registered contract
    /// @dev Sender must be Registrar owner or owner of the registered contract
    /// @return bool indicating call success
    function remove(address _addr)
        public
        onlyOwners(_addr)
        returns (bool)
    {
        bytes32 regName = RegBase(_addr).regName();
        delete addressByIndex[indexByAddress(_addr)];
        delete indexByName[regName];
        Removed(regName, _addr);
        return true;
    }
}


// Deployed on live chain at 0xDFd6dCCF429Fe7d4e8bba3f9c29c2C7CbA4f52EF
contract RegistrarFactory is Factory
{
//
// Constants
//

    bytes32 constant public regName = "registrar";
    bytes32 constant public VERSION = "RegistrarFactory v0.4.0";

//
// Functions
//

    /// @param _creator The calling address passed through by a factory,
    /// typically msg.sender
    /// @param _regName A static name referenced by a Registrar
    /// @param _owner optional owner address if creator is not the intended
    /// owner
    /// @dev On 0x0 value for _owner or _creator, ownership precedence is:
    /// `_owner` else `_creator` else msg.sender
    function RegistrarFactory(address _creator, bytes32 _regName, address _owner)
        public
        Factory(_creator, regName, _owner)
    {
        _regName; // Not passed to super. Quiet compiler warning
    }

    /// @notice Create a new product contract
    /// @param _regName A unique name if the the product is to be registered in
    /// a SandalStraps registrar
    /// @param _owner An address of a third party owner.  Will default to
    /// msg.sender if 0x0
    /// @return kAddr_ The address of the new product contract
    function createNew(bytes32 _regName, address _owner)
        public
        payable
        pricePaid
        returns(address kAddr_)
    {
        kAddr_ = address(new Registrar(msg.sender, _regName, _owner));
        Created(msg.sender, _regName, kAddr_);
    }
}



/******************************************************************************\

file:   BytesMap.sol
ver:    0.4.0
updated:8-Nov-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

This file is part of the SandalStraps framework

BytesMap is a SandalStraps compliant wrapper to store bytes arrays keyed by
their sha3 hash with the sender address and masked with a 4 byte type descriptor
prefix. It can be used as a lookup for RegBase resources. The type descriptor
could be for example an ENS interface signatures or IPFS multihash, Swarm
address or UTF8 string.


This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

\******************************************************************************/

contract BytesMap is RegBase
{
//
// Constants
//

    bytes32 constant public VERSION = "BytesMap v0.4.0";
    bytes32 constant TYPE_MASK =
        0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff;

//
// State Variables
//

    mapping (bytes32 => bytes) public bytesMap;

//
// Events
//

    event Stored(bytes32 indexed _hash);

//
// Functions
//

    /// @param _creator The calling address passed through by a factory,
    /// typically msg.sender
    /// @param _regName A static name referenced by a Registrar
    /// @param _owner optional owner address if creator is not the intended
    /// owner
    /// @dev On 0x0 value for _owner or _creator, ownership precedence is:
    /// `_owner` else `_creator` else msg.sender
    function BytesMap(address _creator, bytes32 _regName, address _owner)
        public
        RegBase(_creator, _regName, _owner)
    {
        // nothing to construct
    }

    /// @notice Store bytes `_bytes` of descriptor type `_type`
    /// @dev Stores an owned bytes array in the mapping keyed by a sha3
    /// contatination of `_bytes` and `msg.sender` which is then prefixed with a
    /// usage type.
    /// @param _type a 4 byte descriptor type, e.g. an ENS record interface or
    /// IPFS multihash signature
    /// @param _bytes a bytes array to be stored
    function store(bytes4 _type, bytes _bytes)
        public
        returns (bytes32 hash_)
    {
        hash_ = keccak256(msg.sender, _bytes) & TYPE_MASK | _type;
        bytesMap[hash_] = _bytes;
        Stored(hash_);
    }
    
    /// @notice Clear `_bytes`. Must be bytes owner or contract owner
    function clear(bytes4 _type, bytes _bytes)
        public
    {
        bytes32 hash = keccak256(msg.sender, _bytes) & TYPE_MASK | _type;
        delete bytesMap[hash];
    }
    
    /// @notice Clear string at hash key of `_hash`
    /// @dev can be cleared by ownr or string owner
    function clearHash(bytes32 _hash)
        public
        returns (bool)
    {
        bytes32 check = keccak256(msg.sender, bytesMap[_hash]) & TYPE_MASK;
        bytes32 hash = _hash & TYPE_MASK;
        require(hash == check || msg.sender == owner);
        delete bytesMap[_hash];
        return true;
    }
}

// Deployed on live chain at 0x7d51af57518f4cdfcfbbd38f93758f92cc218ba1
contract BytesMapFactory is Factory
{
//
// Constants
//

    /// @return registrar name
    bytes32 constant public regName = "bytesmap";
    
    /// @return version string
    bytes32 constant public VERSION = "BytesMapFactory v0.4.0";

//
// Functions
//

    /// @param _creator The calling address passed through by a factory,
    /// typically msg.sender
    /// @param _regName A static name referenced by a Registrar
    /// @param _owner optional owner address if creator is not the intended
    /// owner
    /// @dev On 0x0 value for _owner or _creator, ownership precedence is:
    /// `_owner` else `_creator` else msg.sender
    function BytesMapFactory(
            address _creator, bytes32 _regName, address _owner)
        public
        Factory(_creator, regName, _owner)
    {
        _regName; // Not passed to super. quite compiler warning
    }

    /// @notice Create a new product contract
    /// @param _regName A unique name if the the product is to be registered in
    /// a SandalStraps registrar
    /// @param _owner An address of a third party owner.  Will default to
    /// msg.sender if 0x0
    /// @return kAddr_ The address of the new product contract
    function createNew(bytes32 _regName, address _owner)
        public
        payable
        pricePaid
        returns (address kAddr_)
    {
        kAddr_ = address(new BytesMap(msg.sender, _regName, _owner));
        Created(msg.sender, _regName, kAddr_);
    }
}



/******************************************************************************\

file:   Value.sol
ver:    0.4.0
updated:26-Nov-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

This file is part of the SandalStraps framework

`Value` is a SandalStraps Registrar compliant ownable metric contract.
It can be set by the owner and `value()` read publicly returning a `uint256`
value.
The `function value() returns (uint);` API is intended as a modualar parameter
or value source for other utilising contracts. 

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

Release Notes
-------------
* Using Factory 0.4.0 for `withdrawAll()` instead of `withdraw(<value>)`
* changed from `fee` to `price`
* pragma solidity 0.4.17 
* added `decimals` and `function setDecimals(uint8)`

\******************************************************************************/

contract Value is RegBase
{
    bytes32 constant public VERSION = "Value v0.4.0";
    
    /// @return The current set value
    uint public value;
    
    /// @return The fix poitn decimal place
    uint8 public decimals;

    function Value(address _creator, bytes32 _regName, address _owner)
        public
        RegBase(_creator, _regName, _owner)
    {
        // nothing to construct
    }
    
    /// @notice Set the value to `_value`
    /// @param _value An unsigned integer
    /// @return Boolean success value
    function set(uint _value)
        public
        onlyOwner
        returns (bool)
    {
        value = _value;
        return true;
    }

    /// @notice Set the decimal places to `_decimal`
    /// @param _decimals A fixed point decimal place value
    /// @return Boolean success value
    function setDecimals(uint8 _decimals)
        public
        onlyOwner
        returns (bool)
    {
        decimals = _decimals;
        return true;
    }
}

// Deployed on live chain at 0x96916b453016feE13f5490d74984f485b484D355
contract ValueFactory is Factory
{
//
// Constants
//

    /// @return registrar name
    bytes32 constant public regName = "value";

    /// @return version string
    bytes32 constant public VERSION = "ValueFactory v0.4.0";

//
// Function
//

    /// @param _creator The calling address passed through by a factory,
    /// typically msg.sender
    /// @param _regName A static name referenced by a Registrar
    /// @param _owner optional owner address if creator is not the intended
    /// owner
    /// @dev On 0x0 value for _owner or _creator, ownership precedence is:
    /// `_owner` else `_creator` else msg.sender
    function ValueFactory(address _creator, bytes32 _regName, address _owner)
        public
        Factory(_creator, regName, _owner)
    {
        _regName; // Not passed to super. Quiet compiler warning
    }

    /// @notice Create a new product contract
    /// @param _regName A unique name if the the product is to be registered in
    /// a SandalStraps registrar
    /// @param _owner An address of a third party owner.  Will default to
    /// msg.sender if 0x0
    /// @return kAddr_ The address of the new product contract
    function createNew(bytes32 _regName, address _owner)
        public
        payable
        pricePaid
        returns (address kAddr_)
    {
        kAddr_ = address(new Value(msg.sender, _regName, _owner));
        Created(msg.sender, _regName, kAddr_);
    }
}



/******************************************************************************\

file:   SandalStraps.sol
ver:    0.4.0
updated:13-Nov-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

This file is part of the SandalStraps framework

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

\******************************************************************************/

contract SandalStraps is
    ReentryProtected,
    RegBase,
    OwningItfc,
    WithdrawableMinItfc
{
//
// Constants
//

    bytes32 constant public VERSION = "SandalStraps v0.4.0";

    // Pre-deployed registrar factory address
    address constant BOOTSTRAP = 0xDFd6dCCF429Fe7d4e8bba3f9c29c2C7CbA4f52EF;

//
// State Variables
//

    // Value to track contract initialization state 
    uint8 public __initFuse = 1;
    
    // Address of creator
    address public creator;

    // RegistrarFactory bootstrap;
    RegistrarFactory public bootstrap = RegistrarFactory(BOOTSTRAP);
    
    // The root level registrar
    Registrar public metaRegistrar;
    
    // A mapping of regNames that can only be added by the owner
    mapping (bytes32 => bool) public reservedNames;

//
// Events
//

    // Logged when a factory product is created
    event ProductCreated(
        address indexed _by,
        bytes32 indexed _factoryName,
        bytes32 indexed _regName,
        address _kAddr);
    
    // Logged when a registrar entry is changed
    event RegistrarRegister(bytes32 indexed _registrar, address indexed _kAddr);

    // Logged when a registrar entry is removed
    event RegistrarRemove(bytes32 indexed _registrar, address indexed _kAddr);

//
// Functions - Constructor and Default
//

    /// @param _creator The calling address passed through by a factory,
    /// typically msg.sender
    /// @param _regName A static name referenced by a Registrar
    /// @param _owner optional owner address if creator is not the intended
    /// owner
    /// @dev On 0x0 value for _owner or _creator, ownership precedence is:
    /// `_owner` else `_creator` else msg.sender
    function SandalStraps(address _creator, bytes32 _regName, address _owner)
        public
        RegBase(_creator, _regName, _owner)
    {
        creator = _creator;
        metaRegistrar = Registrar(bootstrap.createNew("metaregistrar", this));
        ProductCreated(msg.sender,
            "registrar",
            "metaregistrar",            
            address(metaRegistrar));
        reservedNames["metaregistrar"] = true;
        reservedNames["factories"] = true;
        reservedNames["registrar"] = true;
        reservedNames["sswallet"] = true;
        reservedNames["sscommision"] = true;
        reservedNames["ssfactoryfee"] = true;
        reservedNames["ssbytes"] = true;
    }

    /// @dev Accepts funds to the default function
    function ()
        public
        payable
    {
        Deposit(msg.sender, msg.value);
    }
    
/* Public Constant functions */

    /// @param _registrar The name of a registered registrar
    /// @param _regName The name of a registed contract to query
    /// @return kAddr_ The address of the contract `_regName` registered in
    /// `_registrar`
    function addressByNameFrom(bytes32 _registrar, bytes32 _regName)
        public
        view
        returns (address kAddr_)
    {
        kAddr_ = Registrar(metaRegistrar.addressByName(_registrar))
            .addressByName(_regName);
    }
    
    /// @param _registrar The name of a registered registrar
    /// @param _regName The name of a registed contract to query
    /// @return idx_ The registration index of the contract `_regName` registered
    /// in `_registrar`
    function indexByNameFrom(bytes32 _registrar, bytes32 _regName)
        public
        view
        returns (uint idx_)
    {
        idx_ = Registrar(metaRegistrar.addressByName(_registrar))
            .indexByName(_regName);
    }

    /// @param _registrar The name of a registered registrar
    /// @param _kAddr The address of a contract registered in `_registrar`
    /// @return idx_ The registration index of the contract `_kAddr` registered
    /// in `_registrar`
    function indexByAddressFrom(bytes32 _registrar, address _kAddr)
        public
        view
        returns (uint idx_)
    {
        idx_ = Registrar(metaRegistrar.addressByName(_registrar))
            .indexByAddress(_kAddr);
    }

    /// @param _registrar The name of a registered registrar
    /// @param _kAddr The address of a contract registered in `_registrar`
    /// @return regName_ The name of the contract registered in `_registrar`
    function nameByAddressFrom(bytes32 _registrar, address _kAddr)
        public
        view
        returns (bytes32 regName_)
    {
        regName_ = nameByIndexFrom(
            _registrar, indexByAddressFrom(_registrar, _kAddr));
    }

    /// @param _registrar The name of a registered registrar
    /// @param _idx The registration index of a contract
    /// @return regName_ The name of the contract registered in `_registrar`
    function nameByIndexFrom(bytes32 _registrar, uint _idx)
        public
        view
        returns (bytes32 regName_)
    {
        regName_ = Registrar(metaRegistrar.addressByName(_registrar))
            .nameByIndex(_idx);
    }
    
    /// @return fee_ The fee in wei required to register a factory contract
    function getRegisterFactoryFee()
        public
        view
        returns (uint fee_)
    {
        // Get fee for adding a factory if a fee value exists
        address feeAddr = metaRegistrar.addressByName("ssfactoryfee");
        fee_ = 0x0 == feeAddr ? 0 : Value(feeAddr).value();
    }
    
    /// @return div_ The commision divisor if `sscomission` Value is registered
    function getCommissionDivisor()
        public
        view
        returns (uint div_)
    {
        address commissionAddr = metaRegistrar.addressByName("sscommission");
        div_ = (0x0 == commissionAddr) ? 0 : Value(commissionAddr).value();
    }
    
    /// @param _factory The regName of a product factory
    /// @return price_ The price in wei required to create a `_factory` product
    function getProductPrice(bytes32 _factory)
        public
        view
        returns (uint price_)
    {
        // Get fee from chosen factory        
        price_ = Factory(addressByNameFrom("factories", _factory)).value();

        // Get Straps fee if a value is registered. Straps owner gets free.
        address commissionAddr = metaRegistrar.addressByName("sscommission");
        uint divisor = (0x0 == commissionAddr) ? 0 : 
                Value(commissionAddr).value();

        // Need to protect against divide by 0 on unset commision divisor value
        price_ = (0 == divisor) ? price_ : 
                price_ + price_ / divisor;
    }
    

/* Public non-constant Functions */ 

    /// @dev Creates and registers 'factories' and 'registrar' registrars
    function _init1()
        public
        onlyOwner
        noReentry
        returns (bool)
    {
        require(1 == __initFuse);
        
        // Create and add 'factories' registrar to metaregistrar
        address factoriesReg = bootstrap.createNew("factories", this);
        ProductCreated(this, "registrar", "factories", factoriesReg);
        metaRegistrar.register(factoriesReg);
        RegistrarRegister("metaregistrar", factoriesReg);
        
        // Create and register the 'registrar' registrar
        address registrarReg = bootstrap.createNew("registrar", this);
        ProductCreated(this, "registrar", "registrar", registrarReg);
        metaRegistrar.register(registrarReg);
        RegistrarRegister("metaregistrar", registrarReg);

        __initFuse++;
        return true;
    }
    
    /// @dev Registers own and metaregistrar addresses in metaRegistrar.
    /// Registers bootstrap factory address in factories
    function _init2()
        public
        onlyOwner
        noReentry
        returns (bool)
    {
        require(2 == __initFuse);
        
        // Add this to metaregistrar
        metaRegistrar.register(this);
        RegistrarRegister("metaregistrar", this);
        
        // Add 'metaregistrar' to metaregistrar
        metaRegistrar.register(metaRegistrar);
        RegistrarRegister("metaregistrar", metaRegistrar);
        
        // Register the bootstrap registrar factory in 'factories' registrar
        Registrar(metaRegistrar.addressByName("factories")).register(BOOTSTRAP);
        RegistrarRegister("factories", BOOTSTRAP);
        
        delete __initFuse;
        return true;
    }
    
    /// @notice Register a Sandalstraps compliant fractory at address `_kAddr`
    /// @param _kAddr The address of a SandalStraps compiant factory
    /// @dev Registers a factory contract in the `factories` registrar then
    /// creates a registrar of the same name into which the product contracts of
    /// the factory are registered
    /// @return bool value indicating success
    function registerFactory(address _kAddr)
        public
        payable
        preventReentry
        returns (bool)
    {
        if (msg.value > 0) { Deposit(msg.sender, msg.value); }

        // Get the factories registrar
        address factories = metaRegistrar.addressByName("factories");
        
        // Get the registrars registrar
        Registrar registrars = Registrar(metaRegistrar.addressByName("registrar"));
        
        // Get the registrar factory
        address regFactory = addressByNameFrom("factories", "registrar");
        
        // Get registrar factory price
        uint price = Value(regFactory).value();

        // Get factory registration fee. Owner pays only factory price
        address feeValue = metaRegistrar.addressByName("ssfactoryfee");
        uint fee = feeValue == 0x0 ? 0 :
                    msg.sender == owner ? 0 :
                    Value(feeValue).value();

        require(msg.value == fee + price);
        
        // Get the added factory's `regName` and validate it
        bytes32 factoryName = RegBase(_kAddr).regName();
        require(factoryName != 0x0);
        Registrar(factories).register(_kAddr);
        RegistrarRegister("factories", _kAddr);

        // Create a registrar of same factory name if one doesn't exist
        if (0x0 == Registrar(registrars).addressByName(factoryName)) {
            if (price > 0) { Withdrawal(msg.sender, regFactory, price); }

            address registrar = Factory(regFactory)
                    .createNew
                    .value(price)(factoryName, this);
            ProductCreated(this, "registrar", factoryName, registrar);
            // Register the new registrar in the registrars ragistrar
            Registrar(registrars).register(registrar);
            RegistrarRegister("registrar", registrar);
            metaRegistrar.register(registrar);
            RegistrarRegister("metaregistrar", registrar);
        }
        return true;
    }

    /// @notice Create a new contract with name `_regName` from factory
    /// `_factory`
    /// @param _factory The registered name of a factory
    /// @param _regName the name to register the new product contract under
    /// @param _prodOwner product owner address. msg.sender if == 0x0
    /// @dev a fee may be payable consisting of a 'newFromFactoryFee' and/or
    /// the factory fee itself. If the caller is the SandalStraps owner,
    /// 'newFromFactoryFee' is 0.
    /// @return bool value indicating success
    function newProduct(bytes32 _factory, bytes32 _regName, address _prodOwner)
        public
        payable
        preventReentry
        returns (address kAddr_)
    {
        // Only owner can use reserved regNames
        require(msg.sender == owner || !reservedNames[_regName]);
        
        if (msg.value > 0) { Deposit(msg.sender, msg.value); }
        
        _prodOwner = _prodOwner != 0x0 ? _prodOwner : msg.sender;
        
        // Get chosen factory and ensure it exists
        Factory factory = Factory(addressByNameFrom("factories", _factory));
        
        // Get the factory's registrar and ensure `_regName` is not registered
        Registrar registrar = Registrar(metaRegistrar.addressByName(_factory));

        // Get price from factory        
        uint256 price = factory.value();
        
        // Get product commission divisor if a value is registered.
        address commissionAddr = metaRegistrar.addressByName("sscommission");
        uint divisor = (0x0 == commissionAddr) ? 0 :
                Value(commissionAddr).value();

        // Get full price (need to protect against divide by 0 on unset
        // commision divisor value)
        uint fullPrice = (0 == divisor) ? price : price + price / divisor;
        require(msg.value == fullPrice);
        
        // Create the product contract
        if (price > 0) { Withdrawal(msg.sender, kAddr_, price); }
        kAddr_ = factory.createNew.value(price)(_regName, _prodOwner);
        ProductCreated(msg.sender, _factory, _regName, kAddr_);

        // Register The product contract. Will throw if product failed creation
        require(registrar.register(kAddr_));
        RegistrarRegister(_factory, kAddr_);
    }
    
    /// @notice Register contract at address `_kAddr` into registrar `_registrar`
    /// @param _registrar The registered name of a registrar
    /// @param _kAddr the address of a compliant contract to be registered
    /// @return bool value indicating success
    function registerIn(bytes32 _registrar, address _kAddr)
        public
        onlyOwner
        noReentry
        returns (bool)
    {
        Registrar registrar = Registrar(metaRegistrar.addressByName(_registrar));
        require(registrar.register(_kAddr));
        RegistrarRegister(_registrar, _kAddr);
        
        return true;
    }

    /// @notice Register contract at address `_kAddr` into registrar `_registrar`
    /// @param _registrar The registered name of a registrar
    /// @param _kAddr the address of a compliant contract to be deregistered
    /// @return bool value indicating success
    function removeFrom(bytes32 _registrar, address _kAddr)
        public
        onlyOwner
        noReentry
        returns (bool)
    {
        Registrar registrar = Registrar(metaRegistrar.addressByName(_registrar));
        require(registrar.remove(_kAddr));
        RegistrarRemove(_registrar, _kAddr);

        return true;    
    }
    
    /// @notice Set array of reserved `_regNames` to `_reserved`
    /// @param _regNames An array of registry name to reserve
    /// @param _reserved An array of boolean reservations.
    /// @return bool value indicating success
    function reserveNames(bytes32[] _regNames, bool[] _reserved)
        public
        onlyOwner
        noReentry
        returns (bool)
    {
        uint l = _regNames.length;
        for (uint i; i < l; i++) {
            reservedNames[_regNames[i]] = _reserved[i];
        }
        return true;
    }
    
    /// @notice Withdraw the contract balance to the feeCollector address
    /// @return bool value indicating success
    function withdrawAll()
        public
        noReentry
        returns (bool)
    {
        address wallet = metaRegistrar.addressByName("sswallet");
        // If no wallet specified, funds go to creator (typically the factory)
        if (0x0 == wallet) wallet = creator;

        Withdrawal(msg.sender, wallet, this.balance);
        wallet.transfer(this.balance);

        return true;
    }
    
    /// @dev Allows the owner to make an arbitrary low level call as the
    /// contract
    /// @param _kAddr the address of the contract to call
    /// @param _callData The RLP encoded call data
    /// @return bool value indicating success
    function callAsContract(address _kAddr, bytes _callData)
        public
        payable
        onlyOwner
        preventReentry
        returns (bool)
    {
        require(_kAddr.call.value(msg.value)(_callData));
        return true;
    }

    // Proxy functions to interact with contracts owned by the SandalStraps
    // Instance.

    /// @notice Contract to recieve ownership of `_kAddr`
    /// @param _kAddr An address of an `Owned` contract
    function receiveOwnershipOf(address _kAddr)
         public
         returns (bool)
     {
         require(OwnedAbstract(_kAddr).acceptOwnership());
         ReceivedOwnership(_kAddr);
         return true;
     }

    /// @notice Change the owner of the owned contract `_kAddr` to `_owner`
    /// @param _kAddr The address of the owned contract
    /// @param _owner The address of the new owner
    /// @dev could be used to migrate to an upgraded SandalStraps
    /// @return bool value indicating success
    function changeOwnerOf(address _kAddr, address _owner)
        public
        onlyOwner
        returns (bool)
    {
        require(OwnedAbstract(_kAddr).changeOwner(_owner));
        ChangeOwnerOf(_kAddr, _owner);
        return true;
    }
    /// @notice Change the resource of owned contract `_kAddr` to `_resource`
    /// @param _kAddr The address of the owned contract
    /// @param _resource The new resource value
    /// @return bool value indicating success
    function changeResourceOf(address _kAddr, bytes32 _resource)
        public
        onlyOwner
        noReentry
        returns (bool)
    {
        require(RegBase(_kAddr).changeResource(_resource));
        return true;
    }
    /// @notice Set the value at `_kAddr` to `_value`
    /// @param _kAddr The address of an owned Value contract
    /// @param _value The new value to store in `_regName`
    /// @return bool value indicating success
    function setValueOf(address _kAddr, uint _value)
        public
        onlyOwner
        noReentry
        returns (bool)
    {
        require(Value(_kAddr).set(_value));
        return true;
    }
}


// Deployed on live chain at 0xBFAa15b22dc8130816D27961834Bc9c7f5EFDA8c
contract SandalStrapsFactory is Factory
{
//
// Constants
//

    /// @return registrar name
    bytes32 constant public regName = "sandalstraps";

    /// @return version string
    bytes32 constant public VERSION = "SandalStrapsFactory v0.4.0";

//
// Functions
//

    /// @param _creator The calling address passed through by a factory,
    /// typically msg.sender
    /// @param _regName A static name referenced by a Registrar
    /// @param _owner optional owner address if creator is not the intended
    /// owner
    /// @dev On 0x0 value for _owner or _creator, ownership precedence is:
    /// `_owner` else `_creator` else msg.sender
    function SandalStrapsFactory(
        address _creator, bytes32 _regName, address _owner)
        public
        Factory(_creator, regName, _owner)
    {
        _regName; // Not passed to super. Quiet compiler warning
    }

    /// @notice Create a new product contract
    /// @param _regName A unique name if the the product is to be registered in
    /// a SandalStraps registrar
    /// @param _owner An address of a third party owner.  Will default to
    /// msg.sender if 0x0
    /// @return kAddr_ The address of the new product contract
    function createNew(bytes32 _regName, address _owner)
        public
        payable
        pricePaid
        returns (address kAddr_)
    {
        kAddr_ = address(new SandalStraps(
                this,
                _regName,
                _owner != 0x0 ? owner : msg.sender)
            );
        Created(this, _regName, kAddr_);
    }
}
