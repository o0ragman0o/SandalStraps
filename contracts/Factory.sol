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

pragma solidity ^0.4.13;

import "./RegBase.sol";

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

/* Example implimentation of `createNew()` for a deriving factory

    function createNew(bytes32 _regName, address _owner)
        payable
        feePaid
        returns (address kAddr_)
    {
        require(_regName != 0x0);
        address kAddr_ = address(new Foo(msg.sender, _regName, _owner));
        Created(msg.sender, _regName, kAddr);
    }

Example product contract with `Factory` compiant constructor and `Registrar`
compliant `regName`.

The owner will be the caller by default if the `_owner` value is `0x0`.

If the contract requires initialization that would normally be done in a
constructor, then a `init()` function can be used instead post deployment.

    contract Foo is RegBase
    {
        bytes32 constant public VERSION = "Foo v0.0.1";
        uint val;
        uint8 public __initFuse = 1;
        
        function Foo(address _creator, bytes32 _regName, address _owner)
            RegBase(_creator, _regName, _owner)
        {
            // put non-parametric constructor code here.
        }
        
        function _init(uint _val)
        {
            require(__initFuse == 1);

            // put parametric constructor code here and call _init() post 
            // deployment
            val = _val;
            delete __initFuse;
        }
    }

*/