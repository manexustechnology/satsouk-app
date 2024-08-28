export interface IBettingDataForContract {
  title: string;
  category: string;
  isAiPick: boolean;
  picture: string;
  executionTime: number;
  expirationDate: number;
  options: string[];
  predictionType: string;
  predictionValue: bigint;
  isGreaterQuestion: boolean;
}

export const BettingDataForContract: IBettingDataForContract[] = [
  {
    title: "Will BTC price be above or below 70k end of September?",
    category: "trending",
    isAiPick: true,
    picture: "https://app.satsouk.xyz/images/market-3.png",
    executionTime: 1727740800,
    expirationDate: 1727222400,
    options: ["yes", "no"],
    predictionType: "coin-price-prediction-btc",
    predictionValue: BigInt(70000000000000000000000),
    isGreaterQuestion: true,
  },
  {
    title: "Will Top Ranked Vitality Win or Lose This Tournament?",
    category: "gaming",
    isAiPick: true,
    picture:
      "https://liquipedia.net/commons/images/5/55/Team_Vitality_2021_allmode.png",
    executionTime: 1726963200,
    expirationDate: 1726790400,
    options: ["yes", "no"],
    predictionType: "normal",
    predictionValue: BigInt(0),
    isGreaterQuestion: false,
  },
  {
    title: "Will Last Year Winner Team Spirit Repeat?",
    category: "gaming",
    isAiPick: true,
    picture:
      "https://ih1.redbubble.net/image.4338518766.9319/mo,medium,flatlay,product_square,600x600.webp",
    executionTime: 1726358400,
    expirationDate: 1726099200,
    options: ["yes", "no"],
    predictionType: "normal",
    predictionValue: BigInt(0),
    isGreaterQuestion: false,
  },
];
