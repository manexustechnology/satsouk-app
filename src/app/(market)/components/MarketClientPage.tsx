"use client";

// import MarketListCard from "./MarketListCard";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useCrypto } from "@/context/CryptoContext";
import MarketListCard from "./v2/MarketListCard";
import UserCard from "./v2/UserCard";
import { cn } from "@/utils/cn";
import { useDynamicContext, useIsLoggedIn, useTelegramLogin } from "@dynamic-labs/sdk-react-core";
import { useSearchParams } from "next/navigation";

const MarketClientPage: React.FC = () => {
  const { sdkHasLoaded, user } = useDynamicContext();
  const { address } = useAccount();
  const { fetchPrice } = useCrypto();
  const [domLoaded, setDomLoaded] = useState(false);
  const { telegramSignIn, isAuthWithTelegram } = useTelegramLogin();
  const isLoggedIn = useIsLoggedIn();
  const [alreadyCheckTelegramAccount, setAlreadyCheckTelegramAccount] = useState(false);
  const [sessionStorageLoaded, setSessionStorageLoaded] = useState(false);

  const searchParams = useSearchParams();
  const telegramAuthToken = searchParams.get('telegramAuthToken');

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  useEffect(() => {
    let intervalIdWindow: NodeJS.Timeout;
    let intervalIdSessionStorage: NodeJS.Timeout;

    if (domLoaded) {
      fetchPrice("eth");

      // session storage
      intervalIdSessionStorage = setInterval(() => {
        if (sessionStorage) {
          clearInterval(intervalIdSessionStorage);
          setSessionStorageLoaded(true);
        }
      }, 500);
      setTimeout(() => {
        clearInterval(intervalIdSessionStorage);
      }, 600 * 1000);
    }

    return () => {
      clearInterval(intervalIdWindow);
      clearInterval(intervalIdSessionStorage);
    };
  }, [domLoaded]);

  useEffect(() => {
    console.log('=================');
    console.log('domLoaded', domLoaded);
    console.log('sdkHasLoaded', sdkHasLoaded);
    console.log('isLoggedIn', isLoggedIn);
    console.log('alreadyCheckTelegramAccount', alreadyCheckTelegramAccount);
    console.log('sessionStorageLoaded', sessionStorageLoaded);
    console.log('=================');
    if (domLoaded && sdkHasLoaded && !isLoggedIn && !alreadyCheckTelegramAccount && sessionStorageLoaded && !user && telegramAuthToken) {
      checkTelegramConnection();
    }
  }, [domLoaded, isLoggedIn, sdkHasLoaded, alreadyCheckTelegramAccount, sessionStorageLoaded, user, telegramAuthToken]);

  const checkTelegramConnection = async () => {
    const isLinkedWithTelegram = await isAuthWithTelegram();

    console.log('isLinkedWithTelegram', isLinkedWithTelegram);
    console.log('window', (window as any).Telegram);
    console.log('user', user);

    if (isLinkedWithTelegram) {
      await telegramSignIn();
    } else {
      try {
        await telegramSignIn({ forceCreateUser: true })
      } catch (error) {
        console.error(error);
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
