// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
//Deployed EtherZon Contract at: 0x96e10A2a50df957e9c48C9872eA56cC0448C024e

const hre = require("hardhat");
const { items } = require("../src/items.json");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

async function main() {
  //Setup Account
  const [deployer] = await hre.ethers.getSigners();

  //DEploy COntract
  const EtherZon = await hre.ethers.getContractFactory("EtherZon");
  const etherZon = await EtherZon.deploy();
  await etherZon.deployed();

  console.log(`Deployed EtherZon Contract at: ${etherZon.address}\n`);

  //Listing items
  for (i = 0; i < items.length; i++) {
    const transaction = await etherZon
      .connect(deployer)
      .list(
        items[i].id,
        items[i].name,
        items[i].category,
        items[i].image,
        tokens(items[i].price),
        items[i].rating,
        items[i].stock
      );
    await transaction.wait();

    console.log(`Listed item ${items[i].id} : ${items[i].name}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
