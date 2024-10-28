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

interface GetUpdatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GetUpdatesModal: React.FC<GetUpdatesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [emailValue, setEmailValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
    } else {
      setErrorMessage("");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailValue(value);
    validateEmail(value);
  };

  const handleSubscribe = () => {
    if (!errorMessage && emailValue) {
      // Subscribe Logiv
      console.log("Subscribed with email:", emailValue);
    }
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
            <h1 className="text-white text-[22px]">Be the First to Know!</h1>
            <p className="font-normal text-[13px] text-zinc-400">
              Want to be notified when our product is fully ready? Enter your
              email, and we’ll let you know as soon as it’s launched!
            </p>
          </div>
          <CloseButton onClick={onClose} size="md" color="#71717A" />
        </Flex>

        <Flex direction="column" gap="6px" mt={2}>
          <Flex direction="column" gap="4px" width="100%">
            <p className="font-normal text-[13px] text-zinc-400">Email</p>
            <Input
              placeholder="example@domain.com"
              bg="#09090B"
              borderRadius="100px"
              padding="10px 12px"
              width="100%"
              fontSize="14px"
              color="stone.100"
              value={emailValue}
              onChange={handleEmailChange}
            />
            {errorMessage && (
              <Text color="red.500" fontSize="12px">
                {errorMessage}
              </Text>
            )}
          </Flex>
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
            onClick={handleSubscribe}
            _focus={{ bgGradient: "linear(90deg, #F43F5E 0%, #F59E0B 100%)" }}
            _hover={{ bgGradient: "linear(90deg, #F43F5E 0%, #F59E0B 100%)" }}
            isDisabled={!!errorMessage || !emailValue}
          >
            Subscribe
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GetUpdatesModal;
