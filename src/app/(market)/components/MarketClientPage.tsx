'use client';

import UserCard from "@/components/UserCard";
// import MarketListCard from "./MarketListCard";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { useEffect, useState } from "react";
import { featureFlag } from "@/utils/feature-flag";
import { bettingContractAddress, bobMainnet, bobSepoliaTestnet } from "@/config/network";
import { bettingContractAbi } from "../../../../contracts/main";
import { transformMarketItemFromContract } from "@/transform/market";
import { useCrypto } from "@/context/CryptoContext";
import MarketListCard from "./v2/MarketListCard";

const MarketClientPage: React.FC = () => {
  const { address } = useAccount();
  const { fetchPrice } = useCrypto();
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  useEffect(() => {
    if (domLoaded) {
      fetchPrice('eth');
    }
  }, [domLoaded])

  if (!domLoaded) return <></>

  return (
    <>
      <div className="grid grid-cols-8 py-4 relative">
        {address && (
          <div className="col-span-2 flex flex-col gap-4 sticky top-[90px]">
            <UserCard />
            {/* Will be used later */}
            {/* <UserStatisticsCard />
            <SidebarMenu /> */}
          </div>
        )}
        <div className={`${address ? 'col-span-6' : 'col-span-full'}`}>
          <MarketListCard />
        </div>
      </div>
    </>
  )
}

export default MarketClientPage;