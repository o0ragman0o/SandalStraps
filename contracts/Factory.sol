/******************************************************************************\

file:   Factory.sol
ver:    0.0.8-sandalstraps
updated:28-Mar-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

This file is part of the SandalStraps framework

Factories are a core but independant concept of the SandalStraps framework.
It is compliant with `Registrar` by inhereting `RegBase` and compiant with 
`SandalStraps` through the `createNew(bytes32 _name, address _owner)` API.

Functions that change state cannot return a value so the the address of the
created contract is stored in `last` which can be refered back to by the calling
contract to discover the new address while still in the same transaction.

An optional creation fee can be set and manually collected by the owner.

The product contract of a factory must have a compiant constructor function 

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

\******************************************************************************/

pragma solidity ^0.4.10;

import "https://github.com/o0ragman0o/SandalStraps/contracts/RegBase.sol";

contract Factory is RegBase
{
    // `last` The address of the last product contract created.
    address public last;
    
    // `fee` The payment required to create the product contract.
    uint public fee;
    
    event Created(address _creator, bytes32 _regName, address _address);

    modifier feePaid() {
        require(msg.value == fee || msg.sender == owner);
        _;
    }

    function Factory( address _creator, bytes32 _regName, address _owner)
        RegBase(_creator, _regName, _owner)
    {
        // nothing left to construct
    }
    
    function Destroy()
        onlyOwner
    {
        selfdestruct(owner);
    }

    // Sets product creation fee
    function setFee(uint _fee)
        onlyOwner
    {
        fee = _fee;
    }

    // Withdraws collected fees to `owner`
    function withdraw()
        onlyOwner
    {
        owner.transfer(this.balance);
    }
    
    // Abstract function to be implimented in deriving Contracts
    function createNew(bytes32 _name, address _owner) payable; // {}
}

/* Example implimentation of `createNew()` for a deriving factory

    function createNew(bytes32 _regName, address _owner)
        payable
        feePaid
    {
        last = new Foo(msg.sender, _regName, _owner);
        Created(msg.sender, _regName, last);
    }

Example product contract with `Factory` compiant constructor and `Registrar`
compliant `regName`.

The owner will be the caller by default if the `_owner` value is `0x0`.

If the contract requires initialization that would normally be done in a
constructor, then a `init()` function can be used instead post deployment.

    contract Foo is RegBase
    {
        uint val;
        uint8 _initLevel = 1;
        
        function Foo(address _creator, bytes32 _regName, address _owner)
            RegBase(_creator, _regName, _owner)
        {
            // non-parametric constructor logic.
        }
        
        function _init(uint _val)
        {
            if (_initLevel != 1) throw;
            delete _initLevel;

            // put parametric contructor logic here and call _init() post 
            // deployment
            val = _val;
        }
    }

*/
