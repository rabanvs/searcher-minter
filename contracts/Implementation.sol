// SPDX-License-Identifier: MIT
pragma solidity  >=0.7.3;

import "@nomiclabs/buidler/console.sol";
import "./Card.sol";

interface ICard {
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256 tokenId);
}

contract Implementation{

    Card constant card = Card(0x5081a39b8A5f0E35a8D959395a630b68B74Dd30f);
    address constant recipient = address(0x2ffDFda4CB958A0eEa3040c0D18c17bAAF53D7B4);
    function shoot() public payable  {

        address(card).call(abi.encodeWithSignature("mintPublic()", ""));
        address(card).call(abi.encodeWithSignature("mintPublic()", ""));

        console.log("Public Issued: ", card.publicIssued());

        uint256 index = card.tokenOfOwnerByIndex(address(this), 0);

        address(card).call(abi.encodeWithSignature("safeTransferFrom(address,address,uint256)", address(this), recipient, index));
        address(card).call(abi.encodeWithSignature("safeTransferFrom(address,address,uint256)", address(this), recipient, index+1));
    }
}
