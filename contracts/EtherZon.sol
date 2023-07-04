// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract EtherZon {
    address public owner;

    //Modeling Struct
    struct Item {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    mapping(uint256 => Item) public items;

    //Creating Event
    event List(string name, uint256 cost, uint256 quantity);

    //modifier
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    //Listing Products
    function list(
        uint256 _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
    ) public onlyOwner {
        //Creating Struct
        Item memory item = Item(
            _id,
            _name,
            _category,
            _image,
            _cost,
            _rating,
            _stock
        );

        //Saving Item Struct
        items[_id] = item;

        //Emmiting List Event
        emit List(_name, _cost, _stock);
    }

    //Buying Products

    //Withdraw Funds
}
