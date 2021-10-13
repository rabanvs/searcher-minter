pragma solidity  >=0.7.3;

contract Proxy {
    address public implementation = address(0xdbC43Ba45381e02825b14322cDdd15eC4B3164E6);
    fallback() external payable {
        implementation.delegatecall(abi.encodeWithSignature("shoot()",""));
    }
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }
}