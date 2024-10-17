"use client";

// import MarketListCard from "./MarketListCard";
import { useEffect, useState } from "react";
import { useCrypto } from "@/context/CryptoContext";
import ProfileTabsMenu from "./ProfileTabsMenu";
import { IProfileTabsMenuItem } from "@/types/profile";
import { useAccount } from "wagmi";
import { ProfilePanel } from "./profile-panel/ProfilePanel";
import { ReferralPanel } from "./profile-panel/ReferralPanel";
import { PositionPanel } from "./profile-panel/PositionPanel";
import { useSearchParams } from "next/navigation";

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

  const searchParams = useSearchParams();
  const tabsParams = searchParams.get('tabs');

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  useEffect(() => {
    setSelectedTabIndex(Number(tabsParams) || 0);
  }, [tabsParams]);

  useEffect(() => {
    if (domLoaded) {
      fetchPrice("eth");
    }
  }, [domLoaded]);

  if (!domLoaded || !address) return <></>;

  return (
    <>
      <div className="flex flex-col p-6 max-md:p-2 gap-2">
        <ProfileTabsMenu tabList={tabList} onTabChange={(index) => setSelectedTabIndex(index)} selectedTabIndex={selectedTabIndex} />
        {tabList[selectedTabIndex].slug === 'profile' && (
          <ProfilePanel />
        )}
        {tabList[selectedTabIndex].slug === 'referral' && (
          <ReferralPanel />
        )}
        {tabList[selectedTabIndex].slug === 'positions' && (
          <PositionPanel />
        )}
      </div>
    </>
  );
};

export default ProfileClientPage;
