"use client";
import { bettingContractAddress } from "@/config/network";
import { useCrypto } from "@/context/CryptoContext";
import { IMarketDataItem } from "@/types/market";
import { capitalizeWords, formatNumberToUSD } from "@/utils/string";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Box,
  Flex,
  Image,
  Progress,
  Stack,
  Button,
  Input,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { MinusCircle } from "@phosphor-icons/react";
import { Heart } from "@phosphor-icons/react/dist/csr/Heart";
import {
  Calendar,
  Circle,
  ArrowRight,
  ArrowsClockwise,
  Plus,
  Minus,
  PlusCircle,
} from "@phosphor-icons/react/dist/ssr";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { bettingContractAbi } from "../../../../contracts/main";
import { parseUnits } from "viem";
import { truncateNumber } from "@/utils/number";
import { Dropdown, MenuProps } from "antd";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import toast from "react-hot-toast";
import { bridgeBTC } from "@/lib/bridgeBTC";

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessBet: () => void;
  data?: IMarketDataItem;
  optionSelected?: string
}

const BuyModal: React.FC<BuyModalProps> = ({ isOpen, onClose, onSuccessBet, data, optionSelected = '' }) => {
  const { address, isConnected } = useAccount();
  const { data: evmBalance, isError, isLoading } = useBalance({
    address: address,
  });

  console.log('evmBalance', evmBalance);

  const { price } = useCrypto();
  const [isSide1, setIsSide1] = useState(true);
  const [amountBuyValue, setAmountBuyValue] = useState<string>('0');
  const [selectedCoin, setSelectedCoin] = useState<string>('eth');
  const { primaryWallet } = useDynamicContext();
  const [currentBalance, setCurrentBalance] = useState<number>(0);

  const {
    data: hash,
    error,
    isPending,
    writeContract: placeBet
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (selectedCoin === 'btc') {
      if (primaryWallet?.connector?.key !== 'okxwallet') {
        toast.error('Only okxwallet supported for btc');
        setSelectedCoin('eth');
      } else {
        fetchBTCBalance();
      }
    } else {
      setCurrentBalance(Number(evmBalance?.formatted || 0));
    }
  }, [selectedCoin, evmBalance]);

  useEffect(() => {
    setIsSide1(optionSelected === data?.options?.[0]?.label);
  }, [optionSelected]);

  useEffect(() => {
    if (isConfirmed) {
      onClose();
      onSuccessBet();
    }
  }, [isConfirmed]);

  const getBTCInterface = async () => {
    const bitcoinInterface = (window.okxwallet as any)?.bitcoin;

    if (!bitcoinInterface.selectedAccount) {
      await bitcoinInterface.connect();
    }

    return bitcoinInterface;
  }

  const fetchBTCBalance = async () => {
    const bitcoinInterface = await getBTCInterface();

    const balance = await bitcoinInterface.getBalance();

    if (balance) {
      setCurrentBalance(balance.confirmed > 0 ? balance.confirmed / (10 ** 8) : 0);
    } else {
      setCurrentBalance(0);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    setAmountBuyValue(value);
  };

  const [isFilled, setIsFilled] = useState(false);

  const handleLikeClick = () => {
    setIsFilled(!isFilled);
  };

  const handleBuyClick = async () => {
    const amount = Number(amountBuyValue);

    if (selectedCoin === 'btc') {
      const bitcoinInterface = await getBTCInterface();
      const btcAddress = bitcoinInterface.selectedAccount.address;
      const evmAddress = primaryWallet?.address;

      if (!evmAddress) {
        toast.error('EVM Address not found');
        return;
      }

      await bridgeBTC({ bitcoinInterface, btcAddress, evmAddress, amount });
    }

    placeBet({
      address: bettingContractAddress as `0x${string}`,
      abi: bettingContractAbi,
      functionName: "placeBet",
      args: [BigInt(data?.id || 0), String(isSide1 ? data?.options?.[0]?.label || '' : data?.options?.[1]?.label || '')],
      value: parseUnits(amount.toString(), 18)
    })
  }

  const [potentialReturnInUSD, potentialReturnPercentage] = useMemo(() => {
    const amount = Number(amountBuyValue);
    if (amount > 0) {
      const amountBuyValueInUSD = amount * (price || 0);
      const pickSideVolumeInUSD = ((isSide1 ? (data?.options?.[0]?.volume || 0) : (data?.options?.[1]?.volume || 0)) * (price || 0)) + amountBuyValueInUSD;
      const oppositeVolumeInUSD = (isSide1 ? (data?.options?.[1]?.volume || 0) : (data?.options?.[0]?.volume || 0)) * (price || 0);
      const fee = 0.01; // 1%
      const oppositeVolumeInUSDWithFee = oppositeVolumeInUSD > 0 ? oppositeVolumeInUSD * (1 - fee) : 0;
      const potentialReturnInUSD = (amountBuyValueInUSD / pickSideVolumeInUSD) * oppositeVolumeInUSDWithFee;
      const potentialReturnPercentage = (potentialReturnInUSD / amountBuyValueInUSD) * 100;
      return [Number((potentialReturnInUSD || 0).toFixed(2)), Number((potentialReturnPercentage || 0).toFixed(2))];
    }

    return [0, 0];
  }, [amountBuyValue, isSide1]);

  const currencyItems: MenuProps['items'] = [
    {
      key: 'eth',
      label: (
        <a onClick={() => setSelectedCoin('eth')}>
          ETH
        </a>
      ),
    },
    {
      key: 'btc',
      label: (
        <a onClick={() => setSelectedCoin('btc')}>
          BTC
        </a>
      ),
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="rgba(9, 9, 11, 0.8)" />
      <ModalContent
        width="full"
        height="fit-content"
        backgroundColor="transparent"
        borderRadius="24px"
        position="relative"
      >
        <ModalCloseButton
          width="40px"
          height="40px"
          backgroundColor="#27272A"
          borderRadius="12px"
          color="#FFFFFF"
          position="absolute"
          top="-35px"
          right="15px"
          zIndex="1"
        />
        <ModalBody width="full" padding="3">
          {data && (
            <>
              <Flex
                mb={2}
                direction="row"
                alignItems="center"
                padding="24px"
                gap="24px"
                backgroundColor="#18181B"
                borderRadius="24px"
                width="full"
                height="full"
              >
                <Flex
                  direction="row"
                  alignItems="center"
                  gap="12px"
                  width="full"
                  height="fit-content"
                >
                  <Image
                    src={data.image}
                    alt="Image"
                    width="72px"
                    height="72px"
                    borderRadius="md"
                    boxShadow="md"
                  />
                  <Flex
                    direction="column"
                    alignItems="start"
                    gap="10px"
                    width="full"
                    height="full"
                  >
                    <Flex
                      direction="row"
                      alignItems="center"
                      gap="12px"
                      width="full"
                      height="16px"
                    >
                      <Flex
                        direction="row"
                        alignItems="center"
                        gap="4px"
                        height="16px"
                      >
                        <Calendar size={16} color="#A1A1AA" />
                        <p className="text-xs font-regular text-zinc-400">
                          {data.executionTime ? dayjs(data.executionTime).format('D MMM YYYY') : 'N/A'}
                        </p>
                      </Flex>
                      <Circle size={4} weight="fill" color="#71717A" />
                      <Flex
                        direction="row"
                        alignItems="center"
                        gap="6px"
                        height="16px"
                      >
                        <p className="text-xs font-regular text-zinc-400">Volume</p>
                        <p className="text-xs font-medium text-white">{formatNumberToUSD((data.volume || 0) * (price || 0))}</p>
                      </Flex>
                    </Flex>
                    <p className="text-sm font-medium text-white max-h-[56px]">
                      {data.title}
                    </p>
                    <Flex
                      direction="row"
                      alignItems="start"
                      gap="4px"
                      width="full"
                      height="20px"
                    >
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        paddingX="8px"
                        paddingY="2px"
                        gap="10px"
                        backgroundColor="#3F3F46"
                        borderRadius="full"
                        width="64px"
                        height="20px"
                      >
                        <p className="text-xs font-regular text-zinc-400">
                          {capitalizeWords(data.category)}
                        </p>
                      </Box>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        paddingX="8px"
                        paddingY="2px"
                        gap="10px"
                        backgroundColor="#3F3F46"
                        borderRadius="full"
                        width="64px"
                        height="20px"
                      >
                        {data.isAIPick && (
                          <p className="text-xs font-regular bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-300">
                            AI Picks
                          </p>
                        )}
                      </Box>
                    </Flex>
                  </Flex>
                </Flex>

                <Flex
                  direction="row"
                  alignItems="center"
                  gap="4px"
                  width="54px"
                  height="24px"
                >
                  {isFilled ? (
                    <Heart
                      size={20}
                      weight="fill"
                      color="#FFFFFF"
                      onClick={handleLikeClick}
                    />
                  ) : (
                    <Heart size={20} color="#FFFFFF" onClick={handleLikeClick} />
                  )}

                  <p className="text-sm font-regular text-white">1.7k</p>
                </Flex>
              </Flex>

              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                padding="6"
                gap="6px"
                width="full"
                backgroundColor="#18181B"
                borderRadius="24px"
              >
                <Flex
                  mt={2}
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  gap="2.5"
                  width="100%"
                  height="auto"
                >
                  <Progress
                    value={data.options?.[0]?.percentage === data.options?.[1]?.percentage ? 50 : data.options?.[0]?.percentage}
                    className="!bg-rose-600"
                    size="sm"
                    rounded="100px"
                    hasStripe
                    isAnimated
                    width="100%"
                  />
                </Flex>

                <Flex
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  padding="0"
                  gap="4"
                  width="full"
                  height="16px"
                >
                  <Flex
                    flexDirection="row"
                    alignItems="center"
                    padding="0"
                    gap="1"
                    height="16px"
                    justifyContent="flex-start"
                  >
                    <p className="text-xs font-normal text-green-500">
                      {" "}
                      {formatNumberToUSD((data.options?.[0]?.volume || 0) * (price || 0))}
                    </p>
                    <Circle size={4} weight="fill" color="#22C55E" />
                    <p className="text-xs font-normal text-green-500">
                      {" "}
                      {capitalizeWords(data.options?.[0]?.label || '')} {data.options?.[0]?.percentage.toFixed(2)}%
                    </p>
                  </Flex>

                  <Flex
                    flexDirection="row"
                    alignItems="center"
                    padding="0"
                    gap="1"
                    height="16px"
                    justifyContent="flex-end"
                  >
                    <p className="text-xs font-regular text-rose-500">{formatNumberToUSD((data.options?.[1]?.volume || 0) * (price || 0))}</p>
                    <Circle size={4} weight="fill" color="#F43F5E" />
                    <p className="text-xs font-regular text-rose-500">{capitalizeWords(data.options?.[1]?.label || '')} {data.options?.[1]?.percentage.toFixed(2)}%</p>
                  </Flex>
                </Flex>

                {/*Yes or No*/}
                <div className="flex flex-col items-start gap-2 w-full h-[68px] mt-4">
                  <div className="flex flex-row justify-between items-center gap-2  h-[20px]">
                    <div className="text-sm font-normal text-zinc-400">
                      Pick a side
                    </div>
                  </div>
                  <div className="flex flex-row items-start gap-2 w-full h-[40px]">
                    <Button
                      bg={isSide1 ? "#052E16" : "#27272A"}
                      colorScheme={isSide1 ? "green" : "gray"}
                      width="50%"
                      height="40px"
                      borderRadius="12px"
                      boxShadow="inset 0px -2.5px 0px rgba(0, 0, 0, 0.24)"
                      _hover={{ bg: isSide1 ? "#052E16" : "#27272A" }}
                      _active={{ bg: isSide1 ? "#052E16" : "#27272A" }}
                      _focus={{ boxShadow: "none" }}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      p={2}
                      onClick={() => setIsSide1(true)}
                    >
                      <span
                        className={`text-sm font-medium ${isSide1 ? "text-green-500" : "text-zinc-500"
                          }`}
                      >
                        {capitalizeWords(data.options?.[0]?.label || '')}
                      </span>
                    </Button>
                    <Button
                      bg={!isSide1 ? "#4C0519" : "#27272A"}
                      colorScheme={!isSide1 ? "rose" : "gray"}
                      color={!isSide1 ? "#F43F5E" : "#27272A"}
                      width="50%"
                      height="40px"
                      borderRadius="12px"
                      boxShadow="inset 0px -2.5px 0px rgba(0, 0, 0, 0.24)"
                      _hover={{ bg: !isSide1 ? "#4C0519" : "#27272A" }}
                      _active={{ bg: !isSide1 ? "#4C0519" : "#27272A" }}
                      _focus={{ boxShadow: "none" }}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      p={2}
                      onClick={() => setIsSide1(false)}
                    >
                      <span
                        className={`text-sm font-medium ${!isSide1 ? "text-f43f5e" : "text-zinc-500"
                          }`}
                      >
                        {capitalizeWords(data.options?.[1]?.label || '')}
                      </span>
                    </Button>
                  </div>
                </div>

                {/*Amount Input*/}
                <Flex
                  mt={4}
                  direction="column"
                  align="flex-start"
                  p={0}
                  gap="2"
                  w="100%"
                >
                  {/* Label */}
                  <div className="flex justify-between items-center w-full">
                    <p className="font-normal text-[14px] leading-[20px] text-[#A1A1AA]">
                      Amount
                    </p>
                  </div>

                  {/* Value Field */}
                  <Flex
                    backgroundColor="#09090B"
                    direction="row"
                    p={0}
                    gap="1.5"
                    w="100%"
                    h="40px"
                    rounded="12px"
                  >
                    {/* Input Field */}
                    <input
                      type="number"
                      value={amountBuyValue}
                      onChange={handleInputChange}
                      className="w-full h-10 bg-[#09090B] rounded-lg text-[#A1A1AA] text-sm border-none focus:outline-none p-4"
                    />

                    {/* Symbol */}
                    <Dropdown
                      menu={{ items: currencyItems }}
                      className="px-3 rounded-r-lg bg-[#52525B] text-sm flex justify-center items-center cursor-pointer"
                      trigger={['click']}
                      overlayClassName="bg-[#52525B]"
                      overlayStyle={{
                        zIndex: 2000,
                      }}
                    >
                      <a onClick={(e) => e.preventDefault()}>{selectedCoin.toUpperCase()}</a>
                    </Dropdown>
                  </Flex>

                  <div className="flex justify-between items-center w-full">
                    <p className="font-normal text-[12px] leading-[20px] text-[#A1A1AA]">
                      ${(Number(amountBuyValue) * (price || 0)).toFixed(2)}
                    </p>
                    <p className="font-normal text-[14px] leading-[20px] text-[#A1A1AA]">
                      {isConnected && (
                        <>
                          <span className="text-white">Balance:</span> {currentBalance.toFixed(8)} {selectedCoin.toUpperCase()}
                        </>
                      )}
                    </p>
                  </div>
                </Flex>

                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  padding="12px"
                  gap="10px"
                  width="full"
                  height="44px"
                  bg="#052E16"
                  borderRadius="12px"
                  mt={4}
                >
                  <div className="flex flex-row justify-between items-start p-0 gap-6 w-full h-[20px]">
                    <div className=" h-[20px]">
                      <p className="font-normal text-[14px] leading-[20px] text-[#A1A1AA]">
                        Potential return
                      </p>
                    </div>
                    <div className=" h-[20px] flex justify-end">
                      <p className="font-normal text-[14px] leading-[20px] text-[#22C55E]">
                        {formatNumberToUSD(potentialReturnInUSD)} ({potentialReturnPercentage}%)
                      </p>
                    </div>
                  </div>
                </Box>

                {/*Buy Sell Button*/}
                <Button
                  w="100%"
                  h="40px"
                  bg="linear-gradient(90deg, #F43F5E 0%, #F59E0B 100%)"
                  boxShadow="inset 0px -2.5px 0px rgba(0, 0, 0, 0.24)"
                  borderRadius="12px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  p="10px 18px"
                  gap="6px"
                  className="z-[5]"
                  marginTop={4}
                  onClick={handleBuyClick}
                  isLoading={isPending || isConfirming}
                >
                  <p className="w-[27px] h-[20px]  font-semibold text-[14px] leading-[20px] text-[#FFFFFF]">
                    Buy
                  </p>
                </Button>
                {error && (
                  <p className="text-sm text-red-500 w-full mt-1 text-center">
                    {error.message.split('.')[0]}
                  </p>
                )}
              </Box>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal >
  );
};

export default BuyModal;
