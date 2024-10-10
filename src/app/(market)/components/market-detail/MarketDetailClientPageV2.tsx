"use client"

import { formatNumber, formatNumberToUSD } from "@/utils/string"
import { ArrowLeft, CalendarBlank, HeartStraight } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import ProgressBar from "../v2/ProgressBar"
import VoteAction from "../v2/VoteAction"
import Badge from "../v2/Badge"
import CardSummary from "../v2/CardSummary"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import '@/app/(market)/styles/marketDetailClientPageV2.css'
import { useAccount } from "wagmi"
import MarketDetailDailyReward from "./MarketDetailDailyReward"
import { cn } from "@/utils/cn"

const MarketDetailClientPageV2 = () => {
  const { address } = useAccount()

  const goBack = () => {
    history.back()
  }

  return (
    <main className="max-md:p-2 mt-20 p-6 grid grid-cols-8 gap-2 max-md:grid-cols-1">
      <div className="col-span-2 max-md:col-span-1">
        <MarketDetailDailyReward />
      </div>
      <div className="col-span-6 max-md:col-span-1">
        <button className="bg-zinc-800 py-5 px-10 rounded-full font-medium text-base mb-3 flex gap-x-3 items-center max-md:hidden" onClick={() => goBack()}>
          <ArrowLeft /> Back
        </button>
        <div className={`grid gap-2 max-md:grid-cols-1 ${cn( address ? 'grid-cols-1' : 'grid-cols-8')}`}>
          <div className="col-span-3 max-md:col-span-1">
            <div className="bg-zinc-900 p-3 rounded-3xl">
              {/* header */}
              <div className="flex justify-between mb-6">
                <Image src="" alt="replace image here" className="w-10 h-10 rounded-full" width={40} height={40} />
                <div className="flex gap-x-2">
                  <Badge className="flex gap-x-2 items-center">
                    <CalendarBlank />
                    <span className="text-sm">1 Aug 2024</span>
                  </Badge>
                  <Badge className="flex gap-x-2 items-center">
                    <span className="w-2 h-2 bg-[#16A34A] rounded-full" />
                    <span className="text-sm">Active</span>
                  </Badge>
                </div>
              </div>
              {/* End Header */}
              {/* Title */}
              <h1 className="text-xl mb-6">Will China Have The Most Gold Medals In Paris 2024 Olympics?</h1>
              {/* End Title */}
              {/* Category */}
              <div className="flex gap-2 mb-6">
                <div className="bg-[#27272A] rounded-full px-3 py-2 flex gap-x-2 items-center">
                  <span className="text-sm">Gaming</span>
                </div>
                <div className="bg-[#27272A] rounded-full px-3 py-2 flex gap-x-2 items-center">
                  <span className="text-sm bg-gradient-to-r from-[#F43F5E] to-[#FCD34D] bg-clip-text text-transparent">AI Picks</span>
                </div>
              </div>
              {/* End Category */}
              {/* Deposit and Like */}
              <div className="flex justify-between items-center flex-row-reverse gap-x-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-zinc-400 cursor-pointer bg-zinc-950 px-3 py-2 rounded-full">
                    <HeartStraight weight="bold" size={21} />
                    <p className="text-xs">{formatNumber(12400)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-zinc-950 p-3 rounded-full flex-1">
                  <p className="text-xs text-zinc-400">Total deposits</p>
                  <p className="text-xs font-medium">{formatNumberToUSD(1694000000)}</p>
                </div>
              </div>
              {/* End Deposit and Like */}
            </div>
          </div>
          <div className="col-span-5 bg-zinc-900 p-3 rounded-3xl flex flex-col gap-y-2 max-md:col-span-1">
            <ProgressBar
              totalYes={30}
              totalNo={70}
              volumeYes={640000000}
              volumeNo={10000000000}
            />
            <VoteAction />
            <div className="flex gap-2 max-md:flex-col">
              <CardSummary
                className="flex-1"
                title="Amount"
                value="0"
                suffix="ETH"
              />
              <CardSummary
                className="flex-1"
                title="Potential prize"
                value="$0"
                suffix="(0%)"
              />
            </div>
            {address ? (
              <button className="bg-gradient-to-r from-[#F43F5E] to-[#F59E0B] py-2 rounded-full w-full font-medium text-base transition-transform duration-200 active:scale-95">
                Buy
              </button>
            ) : (
              <div id="connect-button" className="relative">
                <ConnectButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default MarketDetailClientPageV2
