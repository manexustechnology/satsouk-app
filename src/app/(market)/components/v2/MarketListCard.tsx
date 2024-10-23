'use client';

import MarketTabsMenu from "@/app/(market)/components/v2/MarketTabsMenu";
import { IMarketDataItem, IMarketTabsMenuItem } from "@/types/market";
import React, { useEffect, useState } from "react";
import MarketItem from "@/app/(market)/components/v2/MarketItem";
import { cn } from "@/utils/cn";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAccount } from "wagmi";
import { getBettingList, getMyPositionList } from "@/contract-call/market";
import { IMyPositionDataItem } from "@/types/my-position";
import { useDisclaimer } from "@/context/DisclaimerContext";
import Pagination from "./Pagination";
import useResizeWindow from "../../hooks/useResizeWindow";
import GetUpdatesModal from "../../modals/GetUpdatesModal";

const tabList: IMarketTabsMenuItem[] = [
  {
    slug: 'for-you',
    label: 'For you',
  },
  {
    slug: 'gaming',
    label: 'Gaming',
    image: '/images/gaming-tab.png'
  },
  {
    slug: 'sports',
    label: 'Sports',
    image: '/images/sports-tab.png'
  },
  {
    slug: 'trending',
    label: 'Trending',
    image: '/images/trending-tab.png'
  },
];

const MarketListCard: React.FC = ({
}) => {
  const { address, isConnected } = useAccount();
  const { isAcceptDisclaimerRisk } = useDisclaimer();
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const [marketListData, setMarketListData] = useState<IMarketDataItem[]>([]);
  const [myPositionListData, setMyPositionListData] = useState<IMyPositionDataItem[]>([]);
  const [getUpdatesModalOpen, setGetUpdatesModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const { windowSize } = useResizeWindow();

  useEffect(() => {
    if (search && search.length > 0) {
      setMarketListData([]);
      setSelectedTabIndex(-1);
    } else {
      fetchBettingList();
      setSelectedTabIndex(0);
    }
  }, [search]);

  const fetchBettingList = async () => {
    const data = await getBettingList();

    setMarketListData(data);
  }

  const fetchMyPositionList = async () => {
    const data = await getMyPositionList(address as any);
    setMyPositionListData(data);
  }

  const onPageChange = (pageSelected: number) => setPage(pageSelected)

  const onPageBack = (currentPage: number) => {
    const result = currentPage - 1

    if (result === 0) return

    setPage(currentPage - 1)
  }

  const onPageNext = (currentPage: number) => {
    const result = currentPage + 1

    if (result > 15) return

    setPage(currentPage + 1)
  }

  const onLastPage = () => setPage(15)

  const onFirstPage = () => setPage(1)

  useEffect(() => {
    if (address) {
      fetchMyPositionList();
    }
  }, [address])

  let listCounter = 0;

  return (
    <>
      <div className="bg-zinc-950 rounded-[24px] gap-8 px-1 md:px-3">
        <MarketTabsMenu tabList={tabList} onTabChange={(index) => setSelectedTabIndex(index)} selectedTabIndex={selectedTabIndex} />
        {marketListData.length > 0 ? (
          <div className="relative">
            {tabList[selectedTabIndex]?.slug === 'sports' && (
              <div className="absolute top-0 left-0 bottom-0 right-0 z-20 w-full h-full m-auto flex justify-center items-center">
                <div className="rounded-xl px-4 py-2 text-white text-base bg-zinc-800">Coming soon</div>
              </div>
            )}
            <div className={cn(
              "grid grid-cols-3 gap-2 max-md:grid-cols-1 mb-3",
              tabList[selectedTabIndex]?.slug === 'sports' ? 'blur-md pointer-events-none' : ''
            )}>
              {marketListData.map((item, dataIndex) => {
                if (['gaming', 'trending'].includes(tabList[selectedTabIndex]?.slug || '') && item.category !== tabList[selectedTabIndex]?.slug || '') {
                  return null;
                }

                if (item.type === 'selection') {
                  return null;
                }
                return (
                  <MarketItem
                    data={item}
                    showAcceptanceModal={!(myPositionListData.length > 0) && !isAcceptDisclaimerRisk}
                    onSuccessPlaceBet={() => fetchBettingList()}
                    key={dataIndex} />
                )
              })}

              <div className="col-span-full bg-zinc-950 border border-zinc-800 rounded-3xl py-8 flex flex-col justify-center items-center max-md:px-9 max-md:py-16">
                <p className="text-base mb-3 font-medium text-center">Exciting markets will be coming soon!</p>
                <button className="rounded-full bg-white py-2 text-zinc-900 text-base font-medium px-14" onClick={() => setGetUpdatesModalOpen(true)}>Get updates</button>
              </div>
            </div>
            <Pagination
              isMobile={windowSize?.width <= 768}
              totalPage={15}
              currentPage={page}
              onPageChange={onPageChange}
              onBack={onPageBack}
              onNext={onPageNext}
              onLastPage={onLastPage}
              onFirstPage={onFirstPage} />
          </div>
        ) : (
          <div className="col-span-full bg-zinc-950 border border-zinc-800 rounded-3xl py-16 flex flex-col justify-center items-center">
            <Image
              src="/images/magnifying-glass.png"
              width={1000}
              height={1000}
              style={{ width: '200px', height: '200px' }}
              alt="Empty Image"
            />
            <p className="text-base mb-3 font-medium text-center">Exciting markets will be coming soon!</p>
            <button className="rounded-full bg-white py-2 text-zinc-900 text-base font-medium px-14" onClick={() => setGetUpdatesModalOpen(true)}>Get updates</button>
          </div>
        )}
      </div>
      <GetUpdatesModal isOpen={getUpdatesModalOpen} onClose={() => setGetUpdatesModalOpen(false)} />
      {/* Will be used later */}
      {/* <button className="flex justify-center items-center bg-zinc-950 rounded-[24px] gap-3 p-2.5 cursor-pointer text-zinc-400">
        <p className="text-base">Load more</p>
        <CaretDown weight="bold" size={16} />
      </button> */}
    </>
  )
}

export default MarketListCard;