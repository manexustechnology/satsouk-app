'use client';

import { IMarketDataItem } from "@/types/market";
import { capitalizeWords, formatNumber, formatNumberToUSD } from "@/utils/string";
import { CaretRight, HeartStraight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import React, { useState } from "react";
import BuyModal from "@/app/(market)/modals/BuyModal";
import { useCrypto } from "@/context/CryptoContext";
import AcceptanceRiskModal from "@/app/(market)/modals/AcceptanceRiskModal";
import ProgressBar from "./ProgressBar";

interface MarketItemProps {
  data: IMarketDataItem;
  showAcceptanceModal: boolean;
  onSuccessPlaceBet: () => void;
}

const MarketItem: React.FC<MarketItemProps> = ({
  data,
  showAcceptanceModal,
  onSuccessPlaceBet = () => { },
}) => {
  const { price } = useCrypto();

  const [viewAll, setViewAll] = useState<boolean>(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState<boolean>(false);
  const [isAcceptanceRiskModalOpen, setIsAcceptanceRiskModalOpen] = useState<boolean>(false);
  const [optionSelected, setOptionSelected] = useState<string>('');

  const renderBinary = (): React.ReactNode => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 w-full justify-end">
          <ProgressBar
            totalYes={data.options?.[0]?.percentage || 50}
            totalNo={data.options?.[1]?.percentage || 50}
            volumeYes={(data.options?.[0]?.volume || 0) * (price || 0)}
            volumeNo={(data.options?.[1]?.volume || 0) * (price || 0)}
          />
        </div>
        <div className="flex gap-2 w-full justify-between">
          <button className="bg-green-950 text-green-500 py-3 px-5 w-full h-auto rounded-xl text-sm font-medium hover:bg-green-900" onClick={() => handleClick('yes')}>
            {capitalizeWords(data.options?.[0]?.label || '')}
          </button>
          <button className="bg-rose-950 text-rose-500 py-3 px-5 w-full h-auto rounded-xl text-sm font-medium hover:bg-rose-900" onClick={() => handleClick('no')}>
            {capitalizeWords(data.options?.[1]?.label || '')}
          </button>
        </div>
      </div>
    )
  }

  const renderSelection = (): React.ReactNode => {
    let filteredSelectionOptions = data.options && data.options.length > 5 && !viewAll ? data.options.slice(0, 5) : data.options;

    return (
      <div className="flex flex-col gap-2">
        {data.options && data.options.length > 0 && (
          <>
            {filteredSelectionOptions?.map((item, index) => {
              return (
                <div className="flex gap-2 items-center" key={index}>
                  <div className="flex justify-between items-center bg-zinc-900 rounded-xl p-3 w-full">
                    <p className="text-sm">{item.label}</p>
                    <p className="text-sm">{item.percentage.toFixed(2)}%</p>
                  </div>
                  <button className="bg-green-950 text-green-500 py-3 px-5 w-[100px] h-auto rounded-xl text-sm font-medium hover:bg-green-900">
                    Bet
                  </button>
                </div>
              )
            })}
            {data.options.length > 5 && !viewAll && (
              <button className="flex justify-center items-center bg-zinc-900 rounded-xl p-3 w-full gap-3" onClick={() => setViewAll(true)}>
                <p className="text-sm font-medium text-zinc-400">+{data.options.length - 5} More</p>
                <div className="flex items-center gap-0.5">
                  <p className="text-sm">View All </p>
                  <CaretRight weight="bold" size={16} />
                </div>
              </button>
            )}
          </>
        )}
      </div>
    )
  }

  const handleClick = (option: string) => {
    if (showAcceptanceModal) {
      setIsAcceptanceRiskModalOpen(true);
    } else {
      setIsBuyModalOpen(true);
    }
    setOptionSelected(option);
  }

  const agreeAcceptance = () => {
    setIsBuyModalOpen(true);
  }

  return (
    <div className="flex flex-col gap-4 bg-[#18181B] p-3 rounded-3xl justify-between">
      <div className="flex justify-between">
        <Image
          src={data.image}
          width={1200}
          height={1200}
          alt="image"
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          className="rounded-full"
        />
        <div className="bg-[#27272A] rounded-full px-3 py-2 flex gap-x-2 items-center">
          <span className="w-2 h-2 bg-[#16A34A] rounded-full" />
          <span className="text-sm">Active</span>
        </div>
      </div>
      <p className="text-xl font-medium">{data.title}</p>
      <div className="flex gap-2">
        <div className="bg-[#27272A] rounded-full px-3 py-2 flex gap-x-2 items-center">
          <span className="text-sm">Gaming</span>
        </div>
        <div className="bg-[#27272A] rounded-full px-3 py-2 flex gap-x-2 items-center">
          <span className="text-sm bg-gradient-to-r from-[#F43F5E] to-[#FCD34D] bg-clip-text text-transparent">AI Picks</span>
        </div>
      </div>
      {data.type === 'binary' && renderBinary()}
      {data.type === 'selection' && renderSelection()}
      <div className="flex justify-between items-center flex-row-reverse gap-x-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-zinc-400 cursor-pointer bg-zinc-950 px-3 py-2 rounded-full">
            <HeartStraight weight="bold" size={21} />
            <p className="text-xs">{formatNumber(data.totalLikes || 0)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-zinc-950 p-3 rounded-full flex-1">
          <p className="text-xs text-zinc-400">Total deposits</p>
          <p className="text-xs font-medium">{formatNumberToUSD((data.volume || 0) * (price || 0))}</p>
        </div>
      </div>
      <BuyModal isOpen={isBuyModalOpen} onClose={() => setIsBuyModalOpen(false)} onSuccessBet={() => onSuccessPlaceBet()} data={data} optionSelected={optionSelected} />
      <AcceptanceRiskModal isOpen={isAcceptanceRiskModalOpen} onClose={() => setIsAcceptanceRiskModalOpen(false)} onAgree={() => agreeAcceptance()} />
    </div>
  )
}

export default MarketItem;