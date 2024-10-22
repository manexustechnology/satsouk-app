"use client";

// import MarketListCard from "./MarketListCard";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useCrypto } from "@/context/CryptoContext";
import MarketListCard from "./v2/MarketListCard";
import UserCard from "./v2/UserCard";
import { cn } from "@/utils/cn";
import { useDynamicContext, useIsLoggedIn, useTelegramLogin } from "@dynamic-labs/sdk-react-core";

const MarketClientPage: React.FC = () => {
  const { sdkHasLoaded } = useDynamicContext();
  const { address } = useAccount();
  const { fetchPrice } = useCrypto();
  const [domLoaded, setDomLoaded] = useState(false);
  const { telegramSignIn, isAuthWithTelegram } = useTelegramLogin();
  const isLoggedIn = useIsLoggedIn();
  const [alreadyCheckTelegramAccount, setAlreadyCheckTelegramAccount] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  useEffect(() => {
    if (domLoaded) {
      fetchPrice("eth");
    }
  }, [domLoaded]);

  useEffect(() => {
    if (domLoaded && sdkHasLoaded && !isLoggedIn && !alreadyCheckTelegramAccount && (window as any)?.Telegram && sessionStorage) {
      checkTelegramConnection();
    }
  }, [domLoaded, isLoggedIn, sdkHasLoaded, alreadyCheckTelegramAccount, (window as any)?.Telegram, sessionStorage]);

  const checkTelegramConnection = async () => {
    const isLinkedWithTelegram = await isAuthWithTelegram();

    if (!isLoggedIn) {
      if (isLinkedWithTelegram) {
        await telegramSignIn();
      } else {
        await telegramSignIn({ forceCreateUser: true })
      }
    }

    setAlreadyCheckTelegramAccount(true);
  };

  if (!domLoaded) return <></>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-8 p-6 max-md:p-2 relative">
        {address && (
          <div className="col-span-2 max-md:col-span-1">
            <UserCard />
          </div>
        )}
        <div
          className={`max-md:col-span-1 ${cn(
            address ? "col-span-6" : "col-span-8"
          )}`}
        >
          <MarketListCard />
        </div>
      </div>
    </>
  );
};

export default MarketClientPage;
