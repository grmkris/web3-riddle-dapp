// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {OnchainRiddle} from "../src/OnchainRiddle.sol";

contract OnchainRiddleScript is Script {
    OnchainRiddle public onchainRiddle;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        onchainRiddle = new OnchainRiddle();

        vm.stopBroadcast();
    }
}
