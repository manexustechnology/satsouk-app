"use cient";

import {
  ArrowUpRight,
  CaretLeft,
  FireSimple,
  CaretDown,
} from "@phosphor-icons/react/dist/ssr";
import { Progress } from "@chakra-ui/react";
import { CaretRight } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FireGradient } from "../icons/FireIcon";
import ApiService from "@/lib/api-service";
import { AxiosError } from "axios";
import { generateJWTBearerToken } from "@/utils/string";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { calculatePoints } from "@/utils/number";
import dayjs from "dayjs";
import { JWTConfig } from "@/config/jwt";

const UserCard = () => {
  const { address } = useAccount();
  const user: any = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;
  const [isOpenDaily, setIsOpenDaily] = useState(false);
  const [missions, setMission] = useState<any[]>([]);

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

  const getMissions = async () => {
    await ApiService.get("/missions", {
      headers: {
        Authorization: `Bearer ${await generateJWTBearerToken(
          address as string,
          ""
        )}`,
      },
    })
      .then((res) => {
        setMission(res.data.data);
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data.message);
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      });
  };

  useEffect(() => {
    if (address) {
      getMissions();
    }
  }, [address]);

  const claimStreak = async () => {
    await ApiService.post(
      "/missions/claim-streaks",
      {
        userId: user.id,
        streakDays: user?.currentLoginStreak,
      },
      {
        headers: {
          Authorization: `Bearer ${await generateJWTBearerToken(
            address as string,
            ""
          )}`,
        },
      }
    )
      .then((res) => {
        toast.success(res.data.message);
        setTimeout(() => {
          location.reload();
        }, 2000);
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data.message);
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      });
  };

  const claimMission = async (id: string) => {
    await ApiService.post(
      `/missions/complete-mission`,
      {
        userId: user.id,
        missionId: id,
        timestamp: dayjs().unix(),
      },
      {
        headers: {
          Authorization: `Bearer ${await generateJWTBearerToken(
            address as string,
            ""
          )}`,
        },
      }
    )
      .then((res) => {
        toast.success(res.data.message);
        setTimeout(() => {
          location.reload();
        }, 2000);
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data.message);
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      });
  };

  return (
    <section className="grid grid-cols-1 gap-2 mb-2 px-1 md:px-0">
      {/* Daily Reward */}
      <div className="bg-zinc-900 p-5 rounded-3xl">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg">Daily reward streak</h2>
          <div className="flex gap-2">
            <Link
              href={"/profile"}
              className="p-3 rounded-full bg-zinc-800 transition-transform duration-150 active:scale-95"
            >
              <ArrowUpRight color="#A1A1AA" size={16} />
            </Link>
            <button
              className={`md:hidden p-3 rounded-full bg-zinc-800 transition-transform duration-150 active:scale-95 ${
                isOpenDaily ? "rotate-180" : ""
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
                <p className="text-xs">
                  Day {user?.currentLoginStreak} reward is ready to claim
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">
                    {calculatePoints(user?.currentLoginStreak)} SP
                  </p>
                  {/* Unclaimed */}
                  <span className="bg-zinc-900 text-zinc-600 text-xs py-1 px-2 rounded-[20px]">
                    {user?.currentLoginStreak > 0 ? "Unclaimed" : "Claimed"}
                  </span>
                  {/* Claimed */}
                  {/* <span className="bg-zinc-900 text-zinc-600 text-xs py-1 px-2 rounded-[20px] flex gap-1 items-center">
                    <CheckCircle weight="fill" size={12} className="text-green-600" />
                    <p className="text-white">Claimed</p>
                  </span> */}
                </div>
              </div>
            </div>
            {/* Day Tracker */}
            <div className="grid grid-cols-8">
              <div className="col-span-1 grid grid-cols-1 gap-1 place-items-center">
                {user?.currentLoginStreak === 1 ? (
                  <FireGradient size={16} className={"text-white"} />
                ) : (
                  <FireSimple
                    size={16}
                    weight="fill"
                    className={"text-zinc-600"}
                  />
                )}
                <p className="text-zinc-200">1</p>
              </div>
              <div className="col-span-1 grid grid-cols-1 gap-1 place-items-center">
                {user?.currentLoginStreak === 2 ? (
                  <FireGradient size={16} className={"text-white"} />
                ) : (
                  <FireSimple
                    size={16}
                    weight="fill"
                    className={"text-zinc-600"}
                  />
                )}
                <p className="text-zinc-200">2</p>
              </div>
              <div className="col-span-1 grid grid-cols-1 gap-1 place-items-center">
                {user?.currentLoginStreak === 3 ? (
                  <FireGradient size={16} className={"text-white"} />
                ) : (
                  <FireSimple
                    size={16}
                    weight="fill"
                    className={"text-zinc-600"}
                  />
                )}
                <p className="text-zinc-200">3</p>
              </div>
              <div className="col-span-1 grid grid-cols-1 gap-1 place-items-center">
                {user?.currentLoginStreak === 4 ? (
                  <FireGradient size={16} className={"text-white"} />
                ) : (
                  <FireSimple
                    size={16}
                    weight="fill"
                    className={"text-zinc-600"}
                  />
                )}
                <p className="text-zinc-200">4</p>
              </div>
              <div className="col-span-1 grid grid-cols-1 gap-1 place-items-center">
                {user?.currentLoginStreak === 5 ? (
                  <FireGradient size={16} className={"text-white"} />
                ) : (
                  <FireSimple
                    size={16}
                    weight="fill"
                    className={"text-zinc-600"}
                  />
                )}
                <p className="text-zinc-200">5</p>
              </div>
              <div className="col-span-1 grid grid-cols-1 gap-1 place-items-center">
                {user?.currentLoginStreak === 6 ? (
                  <FireGradient size={16} className={"text-white"} />
                ) : (
                  <FireSimple
                    size={16}
                    weight="fill"
                    className={"text-zinc-600"}
                  />
                )}
                <p className="text-zinc-200">6</p>
              </div>
              <div className="col-span-1 grid grid-cols-1 gap-1 place-items-center">
                {user?.currentLoginStreak === 7 ? (
                  <FireGradient size={16} className={"text-white"} />
                ) : (
                  <FireSimple
                    size={16}
                    weight="fill"
                    className={"text-zinc-600"}
                  />
                )}
                <p className="text-zinc-200">7</p>
              </div>
              <div className="col-span-1 grid grid-cols-1 gap-1 place-items-center">
                {user?.currentLoginStreak > 7 ? (
                  <FireGradient size={16} className={"text-white"} />
                ) : (
                  <FireSimple
                    size={16}
                    weight="fill"
                    className={"text-zinc-600"}
                  />
                )}
                <p className="text-zinc-200">&gt;7</p>
              </div>
            </div>
            {/* Claim Button */}
            {user?.currentLoginStreak > 0 && (
              <button
                className="bg-primary-gradient-2 rounded-full px-3 py-2 font-medium text-sm text-white transition-transform duration-200 active:scale-95"
                onClick={claimStreak}
              >
                Claim
              </button>
            )}
            {/* Claimed */}
            {/* <div className="bg-zinc-800 py-2 rounded-full w-full font-medium text-base text-zinc-400 flex justify-center items-center">
              Today’s reward claimed
            </div> */}
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
            <Link
              href={"/profile"}
              className="p-3 rounded-full bg-zinc-800 transition-transform duration-150 active:scale-95"
            >
              <ArrowUpRight color="#A1A1AA" size={16} />
            </Link>
            <button
              className={`md:hidden p-3 rounded-full bg-zinc-800 transition-transform duration-150 active:scale-95 ${
                isOpenMission ? "rotate-180" : ""
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
            {missions.length > 0 &&
              missions.map((mission, index) => (
                <div key={index} className="flex gap-2 justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-white">{mission.title}</p>
                    <p className="text-sm text-zinc-400">
                      {user?.completedMissions?.find(
                        (item: any) => item.missionId === mission.id
                      )
                        ? 1
                        : 0}
                      /1
                    </p>
                    <Progress
                      value={
                        user?.completedMissions?.find(
                          (item: any) => item.missionId === mission.id
                        )
                          ? 100
                          : 0
                      }
                      colorScheme="pink"
                      color="pink"
                      height={2}
                      bgColor={"zinc.700"}
                      rounded={"full"}
                    />
                  </div>
                  {user?.completedMissions?.find(
                    (item: any) => item.missionId === mission.id
                  ) ? (
                    <div className="rounded-full px-3 py-2 text-sm font-medium text-zinc-400 bg-zinc-800 flex items-center justify-center">
                      {mission.rewardPoint} SP
                    </div>
                  ) : (
                    <button
                      onClick={() => claimMission(mission.id)}
                      className="bg-primary-gradient-2 rounded-full px-3 py-2 font-medium text-sm text-white transition-transform duration-200 active:scale-95"
                    >
                      Claim
                    </button>
                  )}
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
