pragma solidity >= 0.7.3;

import "./IERC721Enumerable.sol";

interface ICard {


    function mintPublic() external;

    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256 tokenId);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function balanceOf(address owner) external view virtual returns (uint256);

}