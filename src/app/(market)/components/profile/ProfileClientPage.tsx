"use client";

// import MarketListCard from "./MarketListCard";
import { useEffect, useState } from "react";
import { useCrypto } from "@/context/CryptoContext";
import ProfileTabsMenu from "./ProfileTabsMenu";
import { IProfileTabsMenuItem } from "@/types/profile";
import { useAccount } from "wagmi";
import { ProfilePanel } from "./ProfilePanel";

const tabList: IProfileTabsMenuItem[] = [
  {
    slug: 'profile',
    label: 'Profile',
  },
  {
    slug: 'referral',
    label: 'Referral',
  },
  {
    slug: 'positions',
    label: 'Your Positions',
  },
];

const ProfileClientPage: React.FC = () => {
  const { address } = useAccount();
  const { fetchPrice } = useCrypto();
  const [domLoaded, setDomLoaded] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  useEffect(() => {
    if (domLoaded) {
      fetchPrice("eth");
    }
  }, [domLoaded]);

  if (!domLoaded) return <></>;

  if (!address) return (
    <div className="flex justify-center items-center h-screen">
      Page not found
    </div>
  )

  return (
    <>
      <div className="flex flex-col p-6 max-md:p-2 gap-2">
        <ProfileTabsMenu tabList={tabList} onTabChange={(index) => setSelectedTabIndex(index)} selectedTabIndex={selectedTabIndex} />
        <ProfilePanel />
      </div>
    </>
  );
};

export default ProfileClientPage;
