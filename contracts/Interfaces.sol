/******************************************************************************\

file:   Interfaces.sol
ver:    0.0.6
updated:15-Jan-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

This file is part of the SandalStraps framework

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

\******************************************************************************/

pragma solidity ^0.4.7;

contract StrapsBase
{
    // An immutable identifier to be set in constructor and used by registrars
    bytes32 public regName;
    address public owner;
    event ChangedOwner(address indexed oldOwner, address indexed newOwner);

    modifier onlyOwner() {
        if (msg.sender != owner) throw;
        _;
    }

    function changeOwner(address _owner)
        public
    {
        if (msg.sender == owner) {
            owner = _owner;
        }
    }
}

contract ValueInterface
{
    function value() public constant returns (uint);
}

contract FactoryInterface
{
    address public last;
    
    event Created(address _creator, bytes32 _name, address _addr);
    function createNew(bytes32 _name, address _owner);
}


contract SandalStrapsInterface
{
    function getAddressByName(bytes32 _registrar, bytes32 _name)
        public constant returns (address addr_);

    function getNameByIdx(bytes32 _registrar, uint _idx)
        public constant returns (bytes32 name_);

    function getNameByAddress(bytes32 _registrar, address _addr)
        public constant returns (bytes32 name_);

    function getIdxByAddress(bytes32 _registrar, address _addr)
        public constant returns (uint idx_);

/* Public non-constant Functions */ 

    function addFactory(address _address);
    function setRegistrarEntry(bytes32 _registrar, address _addr);
    function newFromFactory(bytes32 _factory, bytes32 _name) payable;
}

contract EthenianDAOInterface
{

/* EthenianDAO Standard public functions */
    // Returns the attritian tax rate per block
    function attritionTaxRate() constant returns (uint aTR_);
    function withdrawalTaxRate() constant returns (uint wTR_);
    function minimumVoteBalance() constant returns (uint minVB_);
    function maximumVoteBalance() constant returns (uint maxVB_);
    function getMatter(bytes32 _name) constant returns (address matter_);
    function getMember (bytes32 _name) constant returns (address member_);
    function getMemberFromOwner (address ownerAddr_)
        constant returns (address member_);
    function authority() constant returns (address auth_);
}

contract MatterInterface
{
    string constant public VERSION = "Matter v0.0.6";
    bool constant CLOSED = false;
    bool constant OPEN = true;
    
    struct Option {
        // voter -> tokens -> voting power
        bool open;
        uint value;
        uint votes;
        bytes32 name;
        address recipient;
    }
    
    // TODO use constants and byte flags for bools
    bool public open;
    bool public recurrent;
    bool public scalar;
    bool public forTender;
    bool public tendering;
    bool public funding;
    bool public refunding;
    address public dao;
    uint public numOptions;
    uint public votesCast;
    uint public openTimeStamp;
    uint public period;
    uint public periods;
    mapping (uint => Option) public options;
    // voter -> optionId -> votes
    mapping (address => mapping (uint => uint)) public voters;

    function value() constant returns (uint value_);
    function average() constant returns (uint average_);
    function leader() constant returns (uint leader_);

/* External and Public functions */

    function touch();
    function vote(uint _optionId, uint _votes)external;
    function addOption(bytes32 _name, uint _value, address _recipient) external;
    function fund(uint _amount) payable;
}
