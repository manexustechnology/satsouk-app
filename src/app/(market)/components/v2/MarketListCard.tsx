'use client';

import MarketTabsMenu from "@/app/(market)/components/v2/MarketTabsMenu";
import { IMarketDataItem, IMarketTabsMenuItem } from "@/types/market";
import { useEffect, useState } from "react";
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
      <div className="bg-zinc-950 rounded-[24px] gap-8 p-6">
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
                    key={dataIndex}/>
                )
              })}
              {/* {(tabList[selectedTabIndex]?.slug || false) && tabList[selectedTabIndex].slug !== 'sports' && (
                <div className="relative">
                  <div className="absolute top-0 left-0 bottom-0 right-0 z-20 w-full h-full m-auto flex justify-center items-center">
                    <div className="rounded-xl px-4 py-2 text-white text-base bg-zinc-800">Coming soon</div>
                  </div>
                  <div className="flex flex-col gap-8 blur-md">
                    <Divider className="!border-zinc-800 !m-0 z-10" />
                    <MarketItem data={MarketListData[3]} showAcceptanceModal={!(myPositionListData.length > 0)} onSuccessPlaceBet={() => fetchBettingList()} />
                  </div>
                </div>
              )} */}
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
          <div className="p-6">
            <div className="h-[500px] flex flex-col gap-4 justify-center items-center">
              <Image
                src={'/images/empty-search-icon.png'}
                width={100}
                height={100}
                alt="empty icon"
              />
              <div className="flex flex-col gap-2 w-1/3 justify-center items-center text-center">
                <p className="text-sm font-medium text-white">We couldn&apos;t find anything</p>
                <p className="text-xs text-zinc-500">Try using different keywords to find what you&apos;re looking for.</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Will be used later */}
      {/* <button className="flex justify-center items-center bg-zinc-950 rounded-[24px] gap-3 p-2.5 cursor-pointer text-zinc-400">
        <p className="text-base">Load more</p>
        <CaretDown weight="bold" size={16} />
      </button> */}
    </>
  )
}

export default MarketListCard;