/******************************************************************************\

file:   Authority.sol
ver:    0.0.5-sandalstraps
updated:6-Jan-2017
author: Darryl Morris (o0ragman0o)
email:  o0ragman0o AT gmail.com

This file is part of the Ethenian DAO framework

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

\******************************************************************************/

pragma solidity ^0.4.0;

contract Authority
{
    string constant public VERSION = "Authority v0.0.5-sandalstraps";

    // Basic Permissions
    bytes8 constant public IS_MEMBER =                 0x0000000000000001;
    bytes8 constant public IS_MATTER =                 0x0000000000000002;
    bytes8 constant public CAN_FUND =                  0x0000000000000004;
    bytes8 constant public CAN_VOTE =                  0x0000000000000008;
    bytes8 constant public CAN_RAISE_MATTER =          0x0000000000000010;
    bytes8 constant public CAN_BE_DELEGATE =           0x0000000000000020;
    bytes8 constant public CAN_TENDER =                0x0000000000000040;
    
    // Member Admin Permissions
    bytes8 constant public CHANGE_MEMBER_PERMISSIONS = 0x0000000000000100;
    bytes8 constant public ALLOW_MEMBER =              0x0000000000000200;
    bytes8 constant public DECLINE_MEMBER =            0x0000000000000400;
    bytes8 constant public REMOVE_MEMBER =             0x0000000000000800;
    bytes8 constant public TRANSFER_TAX =              0x0000000000001000;

    // Matter Admin Permissions
    bytes8 constant public CHANGE_MATTER_PERMISSIONS = 0x0000000000010000;
    bytes8 constant public ALLOW_MATTER =              0x0000000000020000;
    bytes8 constant public DECLINE_MATTER =            0x0000000000040000;
    bytes8 constant public CLOSE_MATTER =              0x0000000000080000;

    // DAO Admin Permissions
    bytes8 constant public ADD_CONTRACT =              0x0000000001000000;
    bytes8 constant public CHANGE_CONTRACT =           0x0000000002000000;

    
    // Compound Permissions
    // Standard Member
    bytes8 constant public FULL_MEMBER = IS_MEMBER | CAN_VOTE | CAN_FUND | 
        CAN_RAISE_MATTER | CAN_BE_DELEGATE | CAN_TENDER;
        
    // Members Admin
    bytes8 constant public MEMBERS_ADMIN = CHANGE_MEMBER_PERMISSIONS | ALLOW_MEMBER |
        DECLINE_MEMBER | REMOVE_MEMBER | TRANSFER_TAX;
        
    // Matters Admin
    bytes8 constant public MATTERS_ADMIN = CHANGE_MATTER_PERMISSIONS | ALLOW_MATTER |
        DECLINE_MATTER | CLOSE_MATTER;

    // DAO Admin
    bytes8 constant public  DAO_ADMIN = ADD_CONTRACT | CHANGE_CONTRACT;
    
    // SUPERUSER
    bytes8 constant public SUPER_USER = FULL_MEMBER | MEMBERS_ADMIN | MATTERS_ADMIN;

    // EthenianDAOInterface dao;
    
    // mapping (address => bytes4) permissions;

    function validate(bytes8 _permissions, bytes8 _accessReq)
        public
        constant
        returns (bool authorized_)
    {
        authorized_ = bytes8(0x0) != _accessReq & _permissions ? true : false;
    }
}