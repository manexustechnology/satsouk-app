import { ethers } from "hardhat";
import { BettingContract } from "../typechain-types"; // Import the correct type for your contract
import { BettingDataForContract } from "../data/betting-data";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the BettingContract
  const BettingContractFactory = await ethers.getContractFactory(
    "BettingContract"
  );
  const bettingContract = await BettingContractFactory.deploy();
  await bettingContract.waitForDeployment();
  const bettingContractAddress = await bettingContract.getAddress();
  console.log("BettingContract deployed to:", bettingContractAddress);

  // Register each bet from BettingDataForContract
  for (const bet of BettingDataForContract) {
    const tx = await bettingContract.registerBet(
      bet.title,
      bet.category,
      bet.isAiPick,
      bet.picture,
      bet.executionTime,
      bet.expirationDate,
      bet.options,
      bet.predictionType,
      bet.predictionValue,
      bet.isGreaterQuestion
    );

    console.log(`Bet registered: ${bet.title}`);
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log("Bet registration confirmed.");
  }

  console.log("Deployment and bet registration complete.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
