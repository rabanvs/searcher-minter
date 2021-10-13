pragma solidity >=0.7.3;

import "./Proxy.sol";

contract CreateProxies {

    address[] public proxies;
    function createProxies(uint256 amount) public {
        address[] memory temp = new address[](amount);
        for (uint i = 0; i < amount; i++) {
            Proxy newProxy = new Proxy();
            temp[i] = address(newProxy);
        }
        proxies = temp;
    }

    function getProxies () public view returns (address[] memory) {
        return proxies;
    }

}
 