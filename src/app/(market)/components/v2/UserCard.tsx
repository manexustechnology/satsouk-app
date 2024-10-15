"use cient";

import {
  ArrowUpRight,
  CaretLeft,
  FireSimple,
  CaretDown,
} from "@phosphor-icons/react/dist/ssr";
import Badge from "./Badge";
import { Progress } from "@chakra-ui/react";
import { CaretRight } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import Link from "next/link";

const UserCard = () => {
  const [isOpenDaily, setIsOpenDaily] = useState(false);

  const toggleAccordionDaily = () => {
    setIsOpenDaily(!isOpenDaily);
  };

  const [isOpenMission, setIsOpenMission] = useState(false);

  const toggleAccordionMission = () => {
    setIsOpenMission(!isOpenMission);
  };

  const [isMDorLarger, setIsMDorLarger] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMDorLarger(window.innerWidth >= 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <section className="grid grid-cols-1 gap-2 mb-2 px-1 md:px-0">
      {/* Daily Reward */}
      <div className="bg-zinc-900 p-5 rounded-3xl">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg">Daily reward streak</h2>
          <div className="flex gap-2">
            <Link href={'/profile'} className="p-3 rounded-full bg-zinc-800 transition-transform duration-150 active:scale-95">
              <ArrowUpRight color="#A1A1AA" size={16} />
            </Link>
            <button
              className={`md:hidden p-3 rounded-full bg-zinc-800 transition-transform duration-150 active:scale-95 ${isOpenDaily ? "rotate-180" : ""
                }`}
              onClick={toggleAccordionDaily}
            >
              <CaretDown color="#A1A1AA" size={16} />
            </button>
          </div>
        </div>

        {(isMDorLarger || isOpenDaily) && (
          <div className="mt-3 space-y-3">
            {/* Daily Content */}
            <div className="bg-zinc-800 p-3 rounded-3xl flex items-center gap-2">
              <FireSimple weight="fill" color="#FFFFFF" size={24} />
              <div className="grid grid-cols-1 gap-y-1">
                <p className="text-xs">Day 1 reward is ready to claim</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">5 SP</p>
                  <span className="bg-zinc-900 text-zinc-600 text-xs p-1 rounded">
                    Unclaimed
                  </span>
                </div>
              </div>
            </div>
            {/* Day Tracker */}
            <div className="grid grid-cols-8">
              <div className="col-span-1 grid grid-cols-1 gap-1 place-items-center">
                <FireSimple weight="fill" color="#FFFFFF" size={16} />
                <p className="text-zinc-200">1</p>
              </div>
              <div className="col-span-1 grid grid-cols-1 gap-1 place-items-center">
                <FireSimple weight="fill" color="#52525B" size={16} />
                <p className="text-zinc-200">2</p>
              </div>
              <div className="col-span-1 grid grid-cols-1 gap-1 place-items-center">
                <FireSimple weight="fill" color="#52525B" size={16} />
                <p className="text-zinc-200">3</p>
              </div>
              <div className="col-span-1 grid grid-cols-1 gap-1 place-items-center">
                <FireSimple weight="fill" color="#52525B" size={16} />
                <p className="text-zinc-200">4</p>
              </div>
              <div className="col-span-1 grid grid-cols-1 gap-1 place-items-center">
                <FireSimple weight="fill" color="#52525B" size={16} />
                <p className="text-zinc-200">5</p>
              </div>
              <div className="col-span-1 grid grid-cols-1 gap-1 place-items-center">
                <FireSimple weight="fill" color="#52525B" size={16} />
                <p className="text-zinc-200">6</p>
              </div>
              <div className="col-span-1 grid grid-cols-1 gap-1 place-items-center">
                <FireSimple weight="fill" color="#52525B" size={16} />
                <p className="text-zinc-200">7</p>
              </div>
              <div className="col-span-1 grid grid-cols-1 gap-1 place-items-center">
                <FireSimple weight="fill" color="#52525B" size={16} />
                <p className="text-zinc-200">&gt;7</p>
              </div>
            </div>
            {/* Claim Button */}
            <button className="bg-primary-gradient-2 py-2 rounded-full w-full font-medium text-base transition-transform duration-200 active:scale-95">
              Claim 5 SP
            </button>
          </div>
        )}
      </div>
      {/* End Daily Reward */}
      {/* Missions */}
      <div className="bg-zinc-900 p-5 rounded-3xl">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg">Missions</h2>
          <div className="flex gap-2">
            <Link href={'/profile'} className="p-3 rounded-full bg-zinc-800 transition-transform duration-150 active:scale-95">
              <ArrowUpRight color="#A1A1AA" size={16} />
            </Link>
            <button
              className={`md:hidden p-3 rounded-full bg-zinc-800 transition-transform duration-150 active:scale-95 ${isOpenMission ? "rotate-180" : ""
                }`}
              onClick={toggleAccordionMission}
            >
              <CaretDown color="#A1A1AA" size={16} />
            </button>
          </div>
        </div>

        {(isMDorLarger || isOpenMission) && (
          <div className="grid grid-cols-1 gap-3 mt-3">
            {/* Mission Lists */}
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex gap-2 justify-between">
                <div className="flex-1">
                  <p className="text-sm text-white">Share on X</p>
                  <p className="text-sm text-zinc-400">1/1</p>
                  <Progress
                    value={80}
                    colorScheme="pink"
                    color="pink"
                    height={2}
                    bgColor={"zinc.700"}
                    rounded={"full"}
                  />
                </div>
                <div className="rounded-full p-3 text-sm font-medium text-zinc-400 bg-zinc-800 flex items-center justify-center">
                  10 SP
                </div>
              </div>
            ))}
            {/* End Mission Items */}

            {/* Pagination */}
            <div className="flex justify-between gap-2">
              <button className="p-3 bg-zinc-800 rounded-full">
                <CaretLeft color="#A1A1AA" size={16} />
              </button>
              <div className="p-3 bg-zinc-800 rounded-full flex-1 flex justify-center items-center gap-2">
                <div className="bg-zinc-400 w-6 h-2 rounded-full" />
                <div className="bg-zinc-600 w-2 h-2 rounded-full" />
                <div className="bg-zinc-600 w-2 h-2 rounded-full" />
              </div>
              <button className="p-3 bg-zinc-800 rounded-full">
                <CaretRight color="#A1A1AA" size={16} />
              </button>
            </div>
            {/* End Pagination */}
          </div>
        )}
      </div>
      {/* End Missions */}
    </section>
  );
};

export default UserCard;
