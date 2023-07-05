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

    struct Order {
        uint256 time;
        Item item;
    }

    mapping(uint256 => Item) public items;
    mapping(address => uint256) public orderCount;
    mapping(address => mapping(uint256 => Order)) public orders;

    //Creating Event
    event Buy(address buyer, uint256 orderId, uint256 itemId);
    event List(string name, uint256 cost, uint256 quantity);

    //Modifier
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

        //Emiting List Event
        emit List(_name, _cost, _stock);
    }

    //Buying Products
    function buy(uint256 _id) public payable {
        //Fetch item
        Item memory item = items[_id];

        //Require Enough ether to buy
        require(msg.value >= item.cost);

        //Require item is in stock
        require(item.stock > 0);

        //Create an Order
        Order memory order = Order(block.timestamp, item);

        //order count
        //Adding order for user
        orderCount[msg.sender]++;
        orders[msg.sender][orderCount[msg.sender]] = order;

        //Substracting Stock
        items[_id].stock = item.stock - 1;

        //emit event
        emit Buy(msg.sender, orderCount[msg.sender], item.id);
    }

    //Withdraw Funds
}
