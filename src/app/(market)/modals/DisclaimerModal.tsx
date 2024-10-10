import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  CloseButton,
  Box,
  Input,
  Text,
} from "@chakra-ui/react";

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const handleContinue = () => {
    // Contnue
    console.log("Continue");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="#09090BB2" />

      <ModalContent
        bg="zinc.900"
        boxShadow="0px 1px 2px rgba(16, 24, 40, 0.06), 0px 1px 3px rgba(16, 24, 40, 0.1)"
        borderRadius="10px"
        position="absolute"
        padding="16px"
        gap="12px"
        className="!w-full md:min-w-[616px]"
      >
        <Flex direction="row" justify="space-between" align="start">
          <div className="flex gap-[6px] flex-col">
            <h1 className="text-white text-[22px]">
              Disclaimer: Early Access Product
            </h1>
            <p className="font-normal text-[13px] text-zinc-400">
              Thank you for exploring our platform! Please note that our product
              is still in its early stages of development.
            </p>
            <p className="font-normal text-[13px] text-zinc-400">
              While we're excited to bring this to you, there may be some
              technical issues, and certain features might not be fully
              developed or may not cover all edge cases just yet. We're working
              hard to improve everything, and your feedback is incredibly
              valuable in helping us make this the best experience possible.
            </p>
          </div>
        </Flex>

        <ModalFooter padding="0px" mt="20px">
          <Button
            width="100%"
            bgGradient="linear(90deg, #F43F5E 0%, #F59E0B 100%)"
            borderRadius="100px"
            color="white"
            padding="12px 16px"
            fontSize="14px"
            fontWeight="500"
            onClick={handleContinue}
            _focus={{ bgGradient: "linear(90deg, #F43F5E 0%, #F59E0B 100%)" }}
            _hover={{ bgGradient: "linear(90deg, #F43F5E 0%, #F59E0B 100%)" }}
          >
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DisclaimerModal;
