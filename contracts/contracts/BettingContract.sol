// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@api3/contracts/api3-server-v1/proxies/interfaces/IProxy.sol";

contract BettingContract {
    mapping(address => bool) public admins;
    uint256 public betCounter;
    uint256 public feePercentage = 1; // in percent (%)

    enum BetStatus {
        ACTIVE,
        FINISHED,
        CANCELED
    }

    struct Bet {
        string title;
        string category;
        bool isAIPick;
        string picture;
        uint256 executionTime;
        uint256 expirationDate;
        uint256 id;
        BetStatus status;
        mapping(string => uint256) options;
        string[] optionKeys;
        mapping(string => Bettor[]) bettors;
        string correctAnswer;
        uint256 oracleValue;
        string predictionType;
        uint256 predictionValue;
        bool isGreaterQuestion;
    }

    struct Bettor {
        address bettor;
        uint256 amount;
        uint256 datePurchased;
    }

    struct UserBet {
        uint256 betId;
        string optionChosen;
        uint256 amount;
    }

    uint256[] public betIds;
    mapping(uint256 => Bet) public bets;

    event BetRegistered(
        uint256 id,
        string title,
        string picture,
        string category,
        uint256 executionTime,
        string[] options,
        string predictionType,
        uint256 predictionValue,
        bool _isGreaterQuestion
    );
    event BetPlaced(uint256 id, address bettor, string option, uint256 value);
    event BetAdminExecuted(uint256 id, string correctAnswer);
    event BetOraclePredictionExecuted(uint256 id, string correctAnswer);
    event AdminAdded(address indexed newAdmin);
    event AdminRemoved(address indexed removedAdmin);
    event BetCanceled(uint256 id);
    event Withdrawal(uint256 amount, address walletAddress);
    event ChangeFeePercentage(uint256 amount);

    constructor() {
        admins[msg.sender] = true;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admins can call this function");
        _;
    }

    function addAdmin(address _newAdmin) external onlyAdmin {
        require(!admins[_newAdmin], "Address is already an admin");
        admins[_newAdmin] = true;
        emit AdminAdded(_newAdmin);
    }

    function removeAdmin(address _admin) external onlyAdmin {
        require(admins[_admin], "Address is not an admin");
        require(_admin != msg.sender, "Admin cannot remove themselves");
        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }

    function withdraw(uint256 amount) external onlyAdmin {
        require(amount > 0, "Amount must be greater than 0");
        require(
            address(this).balance >= amount,
            "Insufficient balance in contract"
        );

        // Transfer the specified amount to the admin
        payable(msg.sender).transfer(amount);

        emit Withdrawal(amount, msg.sender);
    }

    function setFeePercentage(uint256 amount) external onlyAdmin {
        require(amount >= 0, "Amount must be equal or greater than 0");

        feePercentage = amount;

        emit ChangeFeePercentage(amount);
    }

    // Oracle From API3
    function readOraclePriceDataFeed(
        address proxy
    ) public view returns (int224 value, uint32 timestamp) {
        (value, timestamp) = IProxy(proxy).read();
    }

    function registerBet(
        string memory _title,
        string memory _category,
        bool _isAIPick,
        string memory _picture,
        uint256 _executionTime,
        uint256 _expirationDate,
        string[] memory _options,
        string memory _predictionType,
        uint256 _predictionValue,
        bool _isGreaterQuestion
    ) external onlyAdmin {
        betCounter++;
        Bet storage newBet = bets[betCounter];
        newBet.title = _title;
        newBet.category = _category;
        newBet.isAIPick = _isAIPick;
        newBet.picture = _picture;
        newBet.executionTime = _executionTime;
        newBet.expirationDate = _expirationDate;
        newBet.id = betCounter;
        newBet.status = BetStatus.ACTIVE;
        newBet.predictionType = _predictionType;
        newBet.predictionValue = _predictionValue;
        newBet.isGreaterQuestion = _isGreaterQuestion;

        for (uint256 i = 0; i < _options.length; i++) {
            newBet.options[_options[i]] = 0;
            newBet.optionKeys.push(_options[i]);
        }

        betIds.push(betCounter);
        emit BetRegistered(
            betCounter,
            _title,
            _picture,
            _category,
            _executionTime,
            _options,
            _predictionType,
            _predictionValue,
            _isGreaterQuestion
        );
    }

    function checkOptionAvailable(
        Bet storage bet,
        string memory _option
    ) internal view returns (bool) {
        bool available = bet.options[_option] > 0;

        if (!available) {
            // Check valid option
            for (uint256 i = 0; i < bet.optionKeys.length; i++) {
                if (
                    keccak256(abi.encodePacked(bet.optionKeys[i])) ==
                    keccak256(abi.encodePacked(_option))
                ) {
                    available = true;
                    break;
                }
            }
        }

        return available;
    }

    function placeBet(uint256 _betId, string memory _option) external payable {
        Bet storage bet = bets[_betId];
        require(
            block.timestamp < bet.expirationDate,
            "Betting on this event has expired"
        );

        bool available = checkOptionAvailable(bet, _option);
        require(available, "Invalid option");

        bet.options[_option] += msg.value;
        bet.bettors[_option].push(
            Bettor(msg.sender, msg.value, block.timestamp)
        );

        emit BetPlaced(_betId, msg.sender, _option, msg.value);
    }

    function cancelBet(uint256 _betId) external onlyAdmin {
        Bet storage bet = bets[_betId];
        require(bet.status == BetStatus.ACTIVE, "Bet is not active");

        // Return the initial investments to the bettors
        for (uint256 i = 0; i < bet.optionKeys.length; i++) {
            string memory option = bet.optionKeys[i];
            Bettor[] storage optionBettors = bet.bettors[option];

            for (uint256 j = 0; j < optionBettors.length; j++) {
                payable(optionBettors[j].bettor).transfer(
                    optionBettors[j].amount
                );
            }
        }

        // Set the bet status to CANCELED
        bet.status = BetStatus.CANCELED;

        emit BetCanceled(_betId);
    }

    function adminExecuteBet(
        uint256 _betId,
        string memory _correctAnswer
    ) external onlyAdmin {
        Bet storage bet = bets[_betId];
        require(
            bet.status == BetStatus.ACTIVE,
            "Bet has already been executed"
        );

        bool available = checkOptionAvailable(bet, _correctAnswer);
        require(available, "Invalid option");

        distributeRewards(bet, _correctAnswer);

        bet.correctAnswer = _correctAnswer;
        bet.status = BetStatus.FINISHED;

        emit BetAdminExecuted(_betId, _correctAnswer);
    }

    function adminExecuteOraclePredictionBet(
        uint256 _betId,
        address _proxy
    ) external onlyAdmin {
        Bet storage bet = bets[_betId];
        require(
            bet.status == BetStatus.ACTIVE,
            "Bet has already been executed"
        );
        require(
            bet.predictionValue > 0,
            "Make sure the bet is price prediction"
        );

        int224 _value;
        uint32 _timestamp;

        // get oracle price
        (_value, _timestamp) = readOraclePriceDataFeed(_proxy);

        require(
            block.timestamp > _timestamp,
            "Oracle price time still not pass block timestamp"
        );

        // Now safely cast bet.predictionValue to int224 and compare
        require(
            uint(int256(_value)) != bet.predictionValue,
            "Market price is equal to the prediction value, please cancel bet"
        );

        // won side
        uint32 wonSide = 0;
        if (
            (uint(int256(_value)) < bet.predictionValue) !=
            bet.isGreaterQuestion
        ) {
            wonSide = 1;
        }

        distributeRewards(bet, bet.optionKeys[wonSide]);

        bet.status = BetStatus.FINISHED;

        emit BetOraclePredictionExecuted(_betId, bet.optionKeys[wonSide]);
    }

    function distributeRewards(
        Bet storage bet,
        string memory correctAnswer
    ) internal {
        uint256 totalPool = 0;
        for (uint256 i = 0; i < bet.optionKeys.length; i++) {
            totalPool += bet.options[bet.optionKeys[i]];
        }

        uint256 totalFee = (totalPool * feePercentage) / 100;
        require(totalPool >= totalFee, "Fee exceeds total reward");

        uint256 rewardPool = totalPool - totalFee;
        uint256 correctOptionBets = bet.options[correctAnswer];

        Bettor[] storage correctBettors = bet.bettors[correctAnswer];
        for (uint256 i = 0; i < correctBettors.length; i++) {
            uint256 reward = (rewardPool * correctBettors[i].amount) /
                correctOptionBets;
            payable(correctBettors[i].bettor).transfer(reward);
        }
    }

    function getOptionsWithAmounts(
        uint256 _betId
    ) public view returns (string[] memory, uint256[] memory) {
        Bet storage bet = bets[_betId];
        uint256 optionsCount = bet.optionKeys.length;
        string[] memory options = new string[](optionsCount);
        uint256[] memory amounts = new uint256[](optionsCount);

        for (uint256 i = 0; i < optionsCount; i++) {
            options[i] = bet.optionKeys[i];
            amounts[i] = bet.options[options[i]];
        }

        return (options, amounts);
    }

    function getBetDetails(
        uint256 _betId
    )
        public
        view
        returns (
            string memory title,
            string memory category,
            bool isAIPick,
            string memory picture,
            uint256 executionTime,
            uint256 expirationDate,
            uint256 id,
            BetStatus status,
            string[] memory optionKeys,
            uint256[] memory optionAmounts,
            string memory predictionType,
            uint256 predictionValue,
            uint256 oracleValue,
            bool isGreaterQuestion
        )
    {
        Bet storage bet = bets[_betId];
        (
            string[] memory options,
            uint256[] memory amounts
        ) = getOptionsWithAmounts(bet.id);
        return (
            bet.title,
            bet.category,
            bet.isAIPick,
            bet.picture,
            bet.executionTime,
            bet.expirationDate,
            bet.id,
            bet.status,
            options,
            amounts,
            bet.predictionType,
            bet.predictionValue,
            bet.oracleValue,
            bet.isGreaterQuestion
        );
    }

    function getTotalBetsOfUser(address _user) public view returns (uint256) {
        uint256 userBetCount = 0;
        for (uint256 i = 0; i < betIds.length; i++) {
            uint256 betId = betIds[i];
            Bet storage bet = bets[betId];

            for (uint256 j = 0; j < bet.optionKeys.length; j++) {
                string memory option = bet.optionKeys[j];
                Bettor[] storage bettors = bet.bettors[option];

                for (uint256 k = 0; k < bettors.length; k++) {
                    if (bettors[k].bettor == _user) {
                        userBetCount++;
                    }
                }
            }
        }
        return userBetCount;
    }

    function getAllBetIds() public view returns (uint256[] memory) {
        return betIds;
    }

    struct UserBetPosition {
        uint256 id;
        string image;
        string title;
        uint256 datePurchased;
        uint256 volume;
        string position;
        uint256 amount;
        uint256 potentialPrize;
    }

    function getUserBets(
        address _user
    ) public view returns (UserBetPosition[] memory) {
        uint256 totalUserBets = getTotalBetsOfUser(_user);
        UserBetPosition[] memory userBets = new UserBetPosition[](
            totalUserBets
        );
        uint256 betIndex = 0;

        for (uint256 i = 0; i < betIds.length; i++) {
            uint256 betId = betIds[i];
            Bet storage bet = bets[betId];

            for (uint256 j = 0; j < bet.optionKeys.length; j++) {
                string memory option = bet.optionKeys[j];
                Bettor[] storage bettors = bet.bettors[option];

                // Calculate Volume
                (, uint256[] memory amounts) = getOptionsWithAmounts(betId);
                uint256 volume = 0;
                for (uint256 k = 0; k < amounts.length; k++) {
                    volume += amounts[k];
                }

                for (uint256 k = 0; k < bettors.length; k++) {
                    if (bettors[k].bettor == _user) {
                        userBets[betIndex] = UserBetPosition({
                            id: betId,
                            image: bet.picture,
                            title: bet.title,
                            datePurchased: bettors[k].datePurchased, // Set to current block timestamp or actual purchase time
                            volume: bettors[k].amount, // Assuming volume is the amount of ETH staked
                            position: option,
                            amount: bettors[k].amount,
                            potentialPrize: calculatePotentialPrize(
                                bet,
                                option,
                                bettors[k].amount
                            ) // Add calculation logic
                        });
                        betIndex++;
                    }
                }
            }
        }

        return userBets;
    }

    function calculatePotentialPrize(
        Bet storage bet,
        string memory option,
        uint256 amount
    ) internal view returns (uint256) {
        uint256 totalPool = 0;
        for (uint256 i = 0; i < bet.optionKeys.length; i++) {
            totalPool += bet.options[bet.optionKeys[i]];
        }

        if (totalPool == 0) return 0;

        uint256 totalFee = (totalPool * feePercentage) / 100;

        uint256 rewardPool = totalPool - totalFee;
        uint256 correctOptionBets = bet.options[option];

        if (correctOptionBets == 0) return 0;

        return (rewardPool * amount) / correctOptionBets;
    }
}
