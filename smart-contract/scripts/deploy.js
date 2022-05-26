const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const Minter = await ethers.getContractFactory("NFTMinter");
  const token = await Minter.deploy();

  console.log("Deplyed", token.deployTransaction.hash);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
