// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

contract Whitelist {
    uint8 public maxWhitelistedAddresses;

    mapping(address => bool) public whitelistedAddresses;

    uint8 public numAddressesWhitelisted;

    // This is set while deplying the contract
    // constructor is executed only once during deploying
    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    // add sender address to whitelist
    function addAddressToWhitelist() public {
        require(! whitelistedAddresses[msg.sender], "Sender had already been whitelisted");

        require(numAddressesWhitelisted < maxWhitelistedAddresses, "More addresses cannot be added to whitelist");

        // change state -> add sender to whitelist and then increment the total whitelisted addresses count
        whitelistedAddresses[msg.sender] = true;
        numAddressesWhitelisted += 1;
    }
}