const hre = require("hardhat");
require('dotenv').config();
const fs = require('fs');

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const PUBLIC_KEY_1 = process.env.PUBLIC_KEY_1
  const PUBLIC_KEY_2 = process.env.PUBLIC_KEY_2
  const PUBLIC_KEY_3 = process.env.PUBLIC_KEY_3

  const PUBLIC_KEY_ARR = [PUBLIC_KEY_1, PUBLIC_KEY_2, PUBLIC_KEY_3];

  const NUM_1 =  process.env.NUM_1;
  const NUM_2 =  process.env.NUM_2;
  const NUM_3 =  process.env.NUM_3;

  const NUM_ARR = [NUM_1, NUM_2, NUM_3];

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );
  
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy(PUBLIC_KEY_ARR, NUM_ARR);
  await token.deployed();

  console.log("Token deployed to:", token.address);

  fs.writeFileSync('./src/config.js', `
  const tokenAddress = "${token.address}"
  const PUBLIC_KEY_ARR = "${PUBLIC_KEY_ARR}"
  const NUM_ARR = "${NUM_ARR}"
  export { tokenAddress, PUBLIC_KEY_ARR, NUM_ARR}
  `)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });