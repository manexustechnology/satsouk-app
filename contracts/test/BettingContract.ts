import { expect } from "chai";
import { ethers } from "hardhat";
import { BettingDataForContract } from "../data/betting-data";
import { BettingContract } from "../typechain-types";
import { vars } from "hardhat/config";
import { parseEther } from "ethers";

describe("BettingContract", function () {
  let bettingContract: BettingContract;
  let owner: any;
  let addr1: any;

  const BTC_PROXY_ADDRESS = vars.get("BTC_PROXY_ADDRESS") as string;

  beforeEach(async function () {
    const BettingContractFactory = await ethers.getContractFactory(
      "BettingContract"
    );
    [owner, addr1] = await ethers.getSigners();
    bettingContract = (await BettingContractFactory.connect(
      owner
    ).deploy()) as BettingContract;
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await bettingContract.admins(owner.address)).to.be.true;
    });
  });

  describe("Admin Functions", function () {
    it("Should add a new admin", async function () {
      await bettingContract.addAdmin(addr1.address);
      expect(await bettingContract.admins(addr1.address)).to.be.true;
    });

    it("Should remove an admin", async function () {
      await bettingContract.addAdmin(addr1.address);
      await bettingContract.removeAdmin(addr1.address);
      expect(await bettingContract.admins(addr1.address)).to.be.false;
    });

    it("Should set the fee percentage", async function () {
      await bettingContract.setFeePercentage(5);
      const feePercentage = await bettingContract.feePercentage();
      expect(feePercentage).to.equal(5);
    });
  });

  describe("Bet Functions", function () {
    it("Should register a new bet", async function () {
      const betData = BettingDataForContract[0];
      await bettingContract.registerBet(
        betData.title,
        betData.category,
        betData.isAiPick,
        betData.picture,
        betData.executionTime,
        betData.expirationDate,
        betData.options,
        betData.predictionType,
        betData.predictionValue.toString(),
        betData.isGreaterQuestion
      );

      const betDetails = await bettingContract.getBetDetails(1);
      expect(betDetails.title).to.equal(betData.title);
      expect(betDetails.category).to.equal(betData.category);
    });

    it("Should place a bet", async function () {
      const betData = BettingDataForContract[0];
      await bettingContract.registerBet(
        betData.title,
        betData.category,
        betData.isAiPick,
        betData.picture,
        betData.executionTime,
        betData.expirationDate,
        betData.options,
        betData.predictionType,
        betData.predictionValue.toString(),
        betData.isGreaterQuestion
      );

      await bettingContract
        .connect(addr1)
        .placeBet(1, "yes", { value: parseEther("1.0") });
      const bet = await bettingContract.getBetDetails(1);
      expect(bet.optionAmounts[0]).to.equal(parseEther("1.0"));
    });

    it("Should cancel a bet and refund bettors", async function () {
      const betData = BettingDataForContract[0];
      await bettingContract.registerBet(
        betData.title,
        betData.category,
        betData.isAiPick,
        betData.picture,
        betData.executionTime,
        betData.expirationDate,
        betData.options,
        betData.predictionType,
        betData.predictionValue.toString(),
        betData.isGreaterQuestion
      );

      await bettingContract
        .connect(addr1)
        .placeBet(1, "yes", { value: parseEther("1.0") });

      // Check balance of addr1
      const addr1BalanceBefore = BigInt(
        await ethers.provider.getBalance(addr1.address)
      );

      await bettingContract.connect(owner).cancelBet(1);

      const addr1BalanceAfter = BigInt(
        await ethers.provider.getBalance(addr1.address)
      );
      expect(addr1BalanceAfter > addr1BalanceBefore).to.be.true;
    });

    it("Should execute bet and distribute rewards", async function () {
      const betData = BettingDataForContract[0];
      await bettingContract.registerBet(
        betData.title,
        betData.category,
        betData.isAiPick,
        betData.picture,
        betData.executionTime,
        betData.expirationDate,
        betData.options,
        betData.predictionType,
        betData.predictionValue.toString(),
        betData.isGreaterQuestion
      );

      await bettingContract
        .connect(addr1)
        .placeBet(1, "yes", { value: parseEther("1.0") });

      await bettingContract.connect(owner).adminExecuteBet(1, "yes");
      const bet = await bettingContract.getBetDetails(1);
      expect(bet.status).to.equal(1); // Finished
    });

    it("Should execute oracle prediction bet", async function () {
      const betData = BettingDataForContract[0];
      await bettingContract.registerBet(
        betData.title,
        betData.category,
        betData.isAiPick,
        betData.picture,
        betData.executionTime,
        betData.expirationDate,
        betData.options,
        betData.predictionType,
        betData.predictionValue.toString(),
        betData.isGreaterQuestion
      );

      await bettingContract
        .connect(addr1)
        .placeBet(1, "yes", { value: parseEther("1.0") });

      await bettingContract
        .connect(owner)
        .adminExecuteOraclePredictionBet(1, BTC_PROXY_ADDRESS);
      const bet = await bettingContract.getBetDetails(1);
      expect(bet.status).to.equal(1); // Finished
    });

    it("Should return user bets", async function () {
      const betData = BettingDataForContract[0];
      await bettingContract.registerBet(
        betData.title,
        betData.category,
        betData.isAiPick,
        betData.picture,
        betData.executionTime,
        betData.expirationDate,
        betData.options,
        betData.predictionType,
        betData.predictionValue.toString(),
        betData.isGreaterQuestion
      );

      await bettingContract
        .connect(addr1)
        .placeBet(1, "yes", { value: parseEther("1.0") });

      const userBets = await bettingContract.getUserBets(addr1.address);
      expect(userBets.length).to.equal(1);
      expect(userBets[0].title).to.equal(betData.title);
    });
  });
});
