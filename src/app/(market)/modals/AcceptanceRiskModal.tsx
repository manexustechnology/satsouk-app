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
import { Divider } from "antd";

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

const AcceptanceRiskModal: React.FC<BuyModalProps> = ({ isOpen, onClose, onAgree }) => {
  const handleAgree = () => {
    onAgree();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="rgba(9, 9, 11, 0.8)" />
      <ModalContent
        width="500px"
        height="fit-content"
        backgroundColor="transparent"
        borderRadius="24px"
        position="relative"
      >
        <ModalBody width="500px" padding="0">
          <div className="w-full bg-[#18181B] rounded-2xl flex flex-col gap-3 p-6">
            <h2 className="font-bold text-2xl">Disclaimer</h2>
            <Divider className="!border-zinc-800 !m-0 z-10" />
            <p className="text-md font-medium">
              By using this Satsouk product, you acknowledge and accept the inherent risks, including the potential loss of funds. This product is still in development, and there are no guarantees of returns. You agree to proceed at your own risk and understand that we are not liable for any losses or damages that may occur. By continuing, you confirm your understanding and acceptance of these terms.
            </p>
            <Divider className="!border-zinc-800 !m-0 z-10" />
            <div className="flex justify-end items-center gap-2">
              <button className="px-4 py-2 bg-green-500 text-white font-md rounded-full" onClick={handleAgree}>Accept</button>
              <button className="px-4 py-2 bg-rose-500 text-white font-md rounded-full" onClick={onClose}>Reject</button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AcceptanceRiskModal;
