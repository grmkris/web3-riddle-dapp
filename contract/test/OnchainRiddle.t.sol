// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {OnchainRiddle} from "../src/OnchainRiddle.sol";

contract CounterTest is Test {
    OnchainRiddle public onchainRiddle;

    function setUp() public {
        onchainRiddle = new OnchainRiddle();
    }
}
