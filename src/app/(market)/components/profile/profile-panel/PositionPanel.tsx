import { Select } from "@chakra-ui/react";
import { CalendarBlank, Circle } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Pagination from "../../v2/Pagination";
import useResizeWindow from "@/app/(market)/hooks/useResizeWindow";
import { useState } from "react";

export const PositionPanel: React.FC = () => {
  const [page, setPage] = useState<number>(1);

  const onPageChange = (pageSelected: number) => setPage(pageSelected)

  return (
    <div key="position-panel" className="flex flex-col gap-2">
      {/* Filter */}
      <div className="rounded-full bg-zinc-900 flex gap-2 p-3">
        <Select placeholder="Category" className="w-full !rounded-full !bg-zinc-950 !border !border-zinc-800 black-select">
          <option value='gaming'>Gaming</option>
          <option value='sports'>Sports</option>
          <option value='trending'>Trending</option>
        </Select>
        <Select placeholder="Status" className="w-full !rounded-full !bg-zinc-950 !border !border-zinc-800 black-select">
          <option value='active'>Active</option>
          <option value='canceled'>Canceled</option>
          <option value='finished'>Finished</option>
        </Select>
      </div>
      {/* Position List Available */}
      <div className="flex flex-col gap-2">
        <div className="rounded-[32px] bg-zinc-900 flex flex-col gap-5 p-3">
          <div className="flex justify-between items-center">
            <Image
              src='/images/my-position-1.png'
              width={40}
              height={40}
              alt="image"
              className="rounded-full"
            />
            <div className="flex justify-end items-center gap-2">
              <div className="bg-zinc-800 p-3 rounded-[20px] flex gap-1.5 items-center">
                <CalendarBlank weight="fill" size={14} className="text-zinc-400" />
                <span className="text-xs text-white">1 Aug 2024</span>
              </div>
              <div className="bg-zinc-800 p-3 rounded-[20px] flex gap-1.5 items-center">
                <Circle weight="fill" size={10} className="text-green-600" />
                <span className="text-xs text-white">Active</span>
              </div>
            </div>
          </div>
          <p className="text-white text-xl">
            Will Gen.G Win VALORANT Champions Tour 2024
          </p>
          <div className="flex justify-between items-center">
            <div className="flex justify-end items-center gap-2">
              <div className="bg-zinc-800 p-3 rounded-[20px] flex gap-1.5 items-center">
                <span className="text-xs text-white">Sports</span>
              </div>
              <div className="bg-zinc-800 p-3 rounded-[20px] flex gap-1.5 items-center">
                <span className="text-xs font-bold bg-primary-gradient bg-clip-text text-transparent">AI Picks</span>
              </div>
            </div>
            <div className="bg-zinc-950 p-3 rounded-[20px] flex gap-1.5 items-center text-xs">
              <span className="text-zinc-400">Total deposits</span>
              <span className="text-white">$169,4m</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="bg-zinc-800 rounded-[20px] p-5 flex flex-col gap-2 md:gap-4">
              <p className="text-zinc-400 text-lg">Position</p>
              <p className="text-green-600 text-[22px] md:text-[32px]">Yes</p>
            </div>
            <div className="bg-zinc-800 rounded-[20px] p-5 flex flex-col gap-2 md:gap-4">
              <p className="text-zinc-400 text-lg">Amount</p>
              <p className="text-white text-[22px] md:text-[32px]">50 ETH</p>
            </div>
            <div className="bg-zinc-800 rounded-[20px] p-5 flex flex-col gap-2 md:gap-4">
              <p className="text-zinc-400 text-lg">Potential Prize</p>
              <p className="text-green-600 text-[22px] md:text-[32px]">$500</p>
            </div>
          </div>
        </div>
        <div className="rounded-[32px] bg-zinc-900 flex flex-col gap-5 p-3">
          <div className="flex justify-between items-center">
            <Image
              src='/images/my-position-2.png'
              width={40}
              height={40}
              alt="image"
              className="rounded-full"
            />
            <div className="flex justify-end items-center gap-2">
              <div className="bg-zinc-800 p-3 rounded-[20px] flex gap-1.5 items-center">
                <CalendarBlank weight="fill" size={14} className="text-zinc-400" />
                <span className="text-xs text-white">1 Aug 2024</span>
              </div>
              <div className="bg-zinc-800 p-3 rounded-[20px] flex gap-1.5 items-center">
                <Circle weight="fill" size={10} className="text-green-600" />
                <span className="text-xs text-white">Active</span>
              </div>
            </div>
          </div>
          <p className="text-white text-xl">
            Will China Have The Most Gold Medals In Paris 2024 Olympics?
          </p>
          <div className="flex justify-between items-center">
            <div className="flex justify-end items-center gap-2">
              <div className="bg-zinc-800 p-3 rounded-[20px] flex gap-1.5 items-center">
                <span className="text-xs text-white">Sports</span>
              </div>
              <div className="bg-zinc-800 p-3 rounded-[20px] flex gap-1.5 items-center">
                <span className="text-xs font-bold bg-primary-gradient bg-clip-text text-transparent">AI Picks</span>
              </div>
            </div>
            <div className="bg-zinc-950 p-3 rounded-[20px] flex gap-1.5 items-center text-xs">
              <span className="text-zinc-400">Total deposits</span>
              <span className="text-white">$169,4m</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="bg-zinc-800 rounded-[20px] p-5 flex flex-col gap-2 md:gap-4">
              <p className="text-zinc-400 text-lg">Position</p>
              <p className="text-rose-600 text-[22px] md:text-[32px]">No</p>
            </div>
            <div className="bg-zinc-800 rounded-[20px] p-5 flex flex-col gap-2 md:gap-4">
              <p className="text-zinc-400 text-lg">Amount</p>
              <p className="text-white text-[22px] md:text-[32px]">10 ETH</p>
            </div>
            <div className="bg-zinc-800 rounded-[20px] p-5 flex flex-col gap-2 md:gap-4">
              <p className="text-zinc-400 text-lg">Potential Prize</p>
              <p className="text-green-600 text-[22px] md:text-[32px]">$1K</p>
            </div>
          </div>
        </div>
        <div className="rounded-[32px] bg-zinc-900 flex flex-col gap-5 p-3">
          <div className="flex justify-between items-center">
            <Image
              src='/images/my-position-3.png'
              width={40}
              height={40}
              alt="image"
              className="rounded-full"
            />
            <div className="flex justify-end items-center gap-2">
              <div className="bg-zinc-800 p-3 rounded-[20px] flex gap-1.5 items-center">
                <CalendarBlank weight="fill" size={14} className="text-zinc-400" />
                <span className="text-xs text-white">1 Aug 2024</span>
              </div>
              <div className="bg-zinc-800 p-3 rounded-[20px] flex gap-1.5 items-center">
                <Circle weight="fill" size={10} className="text-green-600" />
                <span className="text-xs text-white">Active</span>
              </div>
            </div>
          </div>
          <p className="text-white text-xl">
            Will Bitcoin Pass 70K USD In The End of A Year?
          </p>
          <div className="flex justify-between items-center">
            <div className="flex justify-end items-center gap-2">
              <div className="bg-zinc-800 p-3 rounded-[20px] flex gap-1.5 items-center">
                <span className="text-xs text-white">Sports</span>
              </div>
              <div className="bg-zinc-800 p-3 rounded-[20px] flex gap-1.5 items-center">
                <span className="text-xs font-bold bg-primary-gradient bg-clip-text text-transparent">AI Picks</span>
              </div>
            </div>
            <div className="bg-zinc-950 p-3 rounded-[20px] flex gap-1.5 items-center text-xs">
              <span className="text-zinc-400">Total deposits</span>
              <span className="text-white">$169,4m</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="bg-zinc-800 rounded-[20px] p-5 flex flex-col gap-2 md:gap-4">
              <p className="text-zinc-400 text-lg">Position</p>
              <p className="text-green-600 text-[22px] md:text-[32px]">Yes</p>
            </div>
            <div className="bg-zinc-800 rounded-[20px] p-5 flex flex-col gap-2 md:gap-4">
              <p className="text-zinc-400 text-lg">Amount</p>
              <p className="text-white text-[22px] md:text-[32px]">20 ETH</p>
            </div>
            <div className="bg-zinc-800 rounded-[20px] p-5 flex flex-col gap-2 md:gap-4">
              <p className="text-zinc-400 text-lg">Potential Prize</p>
              <p className="text-green-600 text-[22px] md:text-[32px]">$200</p>
            </div>
          </div>
        </div>
      </div>
      {/* Empty Position List */}
      {/* <div className="col-span-full bg-zinc-950 border border-zinc-800 rounded-3xl py-16 flex flex-col justify-center items-center">
        <Image
          src="/images/empty-folder.png"
          width={1000}
          height={1000}
          style={{ width: '200px', height: '200px' }}
          alt="Empty Image"
        />
        <p className="text-base mb-3 font-medium text-center">You have no position available, start predicting now!</p>
        <Link href={'/'} className="rounded-full bg-white py-2 text-zinc-900 text-base font-medium px-14">Go to market</Link>
      </div> */}
      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={15}
        onPageChange={onPageChange} />
    </div>
  )
}