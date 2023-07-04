const { expect } = require("chai");
const { randomBytes } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

// Constants for listing item
const ID = 1;
const NAME = "Shoes";
const CATEGORY = "Chothing";
const IMAGE =
  "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg";
const COST = tokens(1);
const RATING = 4;
const STOCK = 5;

describe("EtherZon", () => {
  let etherZon;
  let deployer, buyer;

  beforeEach(async () => {
    //Setup Account
    [deployer, buyer] = await ethers.getSigners();

    //Deploying Contract
    const EtherZon = await ethers.getContractFactory("EtherZon");
    etherZon = await EtherZon.deploy();
  });

  describe("Deployments", () => {
    it("Sets the owner", async () => {
      const owner = await etherZon.owner();
      expect(owner).to.equal(deployer.address);
    });
  });

  describe("Listing", () => {
    let transacton;

    beforeEach(async () => {
      transacton = await etherZon
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);

      await transacton.wait();
    });

    it("Returns Item attributes", async () => {
      const item = await etherZon.items(1);
      expect(item.id).to.equal(1);
      expect(item.name).to.equal(NAME);
      expect(item.category).to.equal(CATEGORY);
      expect(item.image).to.equal(IMAGE);
      expect(item.cost).to.equal(COST);
      expect(item.rating).to.equal(RATING);
      expect(item.stock).to.equal(STOCK);
    });

    it("Emits List Event", async () => {
      expect(transacton).to.emit(etherZon, "List");
    });
  });
});
