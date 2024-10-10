'use client';

// import MarketListCard from "./MarketListCard";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { useEffect, useState } from "react";
import { featureFlag } from "@/utils/feature-flag";
import { bettingContractAddress, bobMainnet, bobSepoliaTestnet } from "@/config/network";
import { bettingContractAbi } from "../../../../contracts/main";
import { transformMarketItemFromContract } from "@/transform/market";
import { useCrypto } from "@/context/CryptoContext";
import MarketListCard from "./v2/MarketListCard";
import UserCard from "./v2/UserCard";
import { cn } from "@/utils/cn";

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
          <div className="col-span-2 max-md:col-span-1">
            <UserCard />
          </div>
        )}
        <div className={`max-md:col-span-1 ${cn(address ? 'col-span-6' : 'col-span-8')}`}>
          <MarketListCard />
        </div>
      </div>
    </>
  )
}

export default MarketClientPage;