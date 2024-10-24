import { CheckCircle, FireSimple, Info } from "@phosphor-icons/react/dist/ssr";
import { Progress } from "antd";
import { FireGradient } from "../../icons/FireIcon";
import CustomAvatar from "@/components/CustomAvatar";
import { generateJWTBearerToken, renderWalletAddress } from "@/utils/string";
import { useAccount, useEnsName, useEnsAvatar } from "wagmi";
import ApiService from "@/lib/api-service";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export const ProfilePanel: React.FC = () => {
  const { address } = useAccount();
  const {
    data: ensName,
    isLoading: ensNameLoading,
    error: ensNameError,
  } = useEnsName({
    address,
    chainId: 1, // Ethereum mainnet
  });
  const {
    data: avatar,
    isLoading: avatarLoading,
    error: avatarError,
  } = useEnsAvatar({
    name: ensName || "", // Use the resolved ENS name or an empty string
    chainId: 1, // Ethereum mainnet
  });
  const user: any = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;
  const [missions, setMission] = useState<any[]>([]);

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
    <div key="profile-panel" className="flex flex-col gap-2">
      <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full col-span-1 md:col-span-2">
          <div className="rounded-[32px] p-5 w-full text-zinc-400 bg-zinc-900 min-h-[100px] md:min-h-[200px] flex flex-col justify-between">
            <div>
              <CustomAvatar
                address={address as string}
                ensImage={avatar}
                size={40}
              />
            </div>
            <p className="text-lg text-white">
              {renderWalletAddress(address, 5)}
            </p>
          </div>
          <div className="rounded-[32px] p-5 w-full text-zinc-400 min-h-[100px] md:min-h-[200px] flex flex-col justify-between bg-gradient-to-r from-zinc-900 to-[#5a3427]">
            <div className="flex gap-2 items-center">
              <p className="text-white text-lg">Satsouk Points</p>
              <Info weight="fill" size={24} className="text-zinc-600" />
            </div>
            <p className="text-[32px] bg-primary-gradient bg-clip-text text-transparent w-fit justify-self-end">
              {user?.point} SP
            </p>
          </div>
          <div className="rounded-[32px] p-5 w-full text-zinc-400 bg-zinc-900 min-h-[100px] md:min-h-[200px] flex flex-col justify-between">
            <p className="text-lg">Total position</p>
            <p className="text-[32px] text-white">$12,099,232.43</p>
          </div>
          <div className="rounded-[32px] p-5 w-full text-zinc-400 bg-zinc-900 min-h-[100px] md:min-h-[200px] flex flex-col justify-between">
            <p className="text-lg">Potential prize</p>
            <p className="text-[32px] text-green-600">+$356,438,006.033</p>
          </div>
        </div>
        <div className="w-full">
          <div className="rounded-[32px] p-5 w-full text-zinc-400 bg-zinc-900 h-full flex flex-col gap-2">
            <div className="flex gap-2 items-center p-2">
              <p className="text-white text-lg">Daily Reward Streak</p>
              <Info weight="fill" size={24} className="text-zinc-600" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div
                className={
                  user?.currentLoginStreak === 1
                    ? "bg-primary-gradient p-[1px] rounded-[20px]"
                    : "bg-zinc-800 rounded-[20px] p-3 flex flex-col justify-between items-center w-full gap-2"
                }
              >
                <div className="flex gap-1 justify-center items-center">
                  {user?.currentLoginStreak === 1 ? (
                    <FireGradient size={16} />
                  ) : (
                    <FireSimple
                      weight="fill"
                      size={16}
                      className="text-white"
                    />
                  )}
                  <p className="text-[10px] leading-4 text-zinc-200">Day 1</p>
                </div>
                <p className="font-medium text-sm text-white">5 SP</p>
                {user?.currentLoginStreak === 1 ? (
                  <div className="rounded-full bg-zinc-900 pl-1 pr-2 py-0.5 flex gap-0.5 justify-center items-center">
                    <CheckCircle
                      weight="fill"
                      size={12}
                      className="text-green-600"
                    />
                    <p className="text-[10px] leading-4 text-zinc-50">
                      Claimed
                    </p>
                  </div>
                ) : (
                  <div className="rounded-full bg-zinc-900 px-1.5 py-0.5 flex gap-0.5 justify-center items-center">
                    <p className="text-[10px] leading-4 text-zinc-400">
                      Unclaimed
                    </p>
                  </div>
                )}
              </div>
              <div
                className={
                  user?.currentLoginStreak === 2
                    ? "bg-primary-gradient p-[1px] rounded-[20px]"
                    : "bg-zinc-800 rounded-[20px] p-3 flex flex-col justify-between items-center w-full gap-2"
                }
              >
                <div className="flex gap-1 justify-center items-center">
                  {user?.currentLoginStreak === 2 ? (
                    <FireGradient size={16} />
                  ) : (
                    <FireSimple
                      weight="fill"
                      size={16}
                      className="text-white"
                    />
                  )}
                  <p className="text-[10px] leading-4 text-zinc-200">Day 2</p>
                </div>
                <p className="font-medium text-sm text-white">10 SP</p>
                {user?.currentLoginStreak === 2 ? (
                  <div className="rounded-full bg-zinc-900 pl-1 pr-2 py-0.5 flex gap-0.5 justify-center items-center">
                    <CheckCircle
                      weight="fill"
                      size={12}
                      className="text-green-600"
                    />
                    <p className="text-[10px] leading-4 text-zinc-50">
                      Claimed
                    </p>
                  </div>
                ) : (
                  <div className="rounded-full bg-zinc-900 px-1.5 py-0.5 flex gap-0.5 justify-center items-center">
                    <p className="text-[10px] leading-4 text-zinc-400">
                      Unclaimed
                    </p>
                  </div>
                )}
              </div>
              <div
                className={
                  user?.currentLoginStreak === 3
                    ? "bg-primary-gradient p-[1px] rounded-[20px]"
                    : "bg-zinc-800 rounded-[20px] p-3 flex flex-col justify-between items-center w-full gap-2"
                }
              >
                <div className="bg-zinc-800 rounded-[20px] p-3 flex flex-col justify-between items-center w-full gap-2">
                  <div className="flex gap-1 justify-center items-center">
                    {user?.currentLoginStreak === 3 ? (
                      <FireGradient size={16} />
                    ) : (
                      <FireSimple
                        weight="fill"
                        size={16}
                        className="text-white"
                      />
                    )}
                    <p className="text-[10px] leading-4 text-zinc-200">Day 3</p>
                  </div>
                  <p className="font-medium text-sm text-zinc-400">15 SP</p>
                  {user?.currentLoginStreak === 3 ? (
                    <div className="rounded-full bg-zinc-900 pl-1 pr-2 py-0.5 flex gap-0.5 justify-center items-center">
                      <CheckCircle
                        weight="fill"
                        size={12}
                        className="text-green-600"
                      />
                      <p className="text-[10px] leading-4 text-zinc-50">
                        Claimed
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-full bg-zinc-900 px-1.5 py-0.5 flex gap-0.5 justify-center items-center">
                      <p className="text-[10px] leading-4 text-zinc-400">
                        Unclaimed
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={
                  user?.currentLoginStreak === 4
                    ? "bg-primary-gradient p-[1px] rounded-[20px]"
                    : "bg-zinc-800 rounded-[20px] p-3 flex flex-col justify-between items-center w-full gap-2"
                }
              >
                <div className="flex gap-1 justify-center items-center">
                  {user?.currentLoginStreak === 4 ? (
                    <FireGradient size={16} />
                  ) : (
                    <FireSimple
                      weight="fill"
                      size={16}
                      className="text-white"
                    />
                  )}
                  <p className="text-[10px] leading-4 text-zinc-400">Day 4</p>
                </div>
                <p className="font-medium text-sm text-zinc-400">20 SP</p>
                {user?.currentLoginStreak === 4 ? (
                  <div className="rounded-full bg-zinc-900 pl-1 pr-2 py-0.5 flex gap-0.5 justify-center items-center">
                    <CheckCircle
                      weight="fill"
                      size={12}
                      className="text-green-600"
                    />
                    <p className="text-[10px] leading-4 text-zinc-50">
                      Claimed
                    </p>
                  </div>
                ) : (
                  <div className="rounded-full bg-zinc-900 px-1.5 py-0.5 flex gap-0.5 justify-center items-center">
                    <p className="text-[10px] leading-4 text-zinc-400">
                      Unclaimed
                    </p>
                  </div>
                )}
              </div>
              <div
                className={
                  user?.currentLoginStreak === 5
                    ? "bg-primary-gradient p-[1px] rounded-[20px]"
                    : "bg-zinc-800 rounded-[20px] p-3 flex flex-col justify-between items-center w-full gap-2"
                }
              >
                <div className="flex gap-1 justify-center items-center">
                  {user?.currentLoginStreak === 5 ? (
                    <FireGradient size={16} />
                  ) : (
                    <FireSimple
                      weight="fill"
                      size={16}
                      className="text-white"
                    />
                  )}
                  <p className="text-[10px] leading-4 text-zinc-400">Day 5</p>
                </div>
                <p className="font-medium text-sm text-zinc-400">30 SP</p>
                {user?.currentLoginStreak === 5 ? (
                  <div className="rounded-full bg-zinc-900 pl-1 pr-2 py-0.5 flex gap-0.5 justify-center items-center">
                    <CheckCircle
                      weight="fill"
                      size={12}
                      className="text-green-600"
                    />
                    <p className="text-[10px] leading-4 text-zinc-50">
                      Claimed
                    </p>
                  </div>
                ) : (
                  <div className="rounded-full bg-zinc-900 px-1.5 py-0.5 flex gap-0.5 justify-center items-center">
                    <p className="text-[10px] leading-4 text-zinc-400">
                      Unclaimed
                    </p>
                  </div>
                )}
              </div>
              <div
                className={
                  user?.currentLoginStreak === 6
                    ? "bg-primary-gradient p-[1px] rounded-[20px]"
                    : "bg-zinc-800 rounded-[20px] p-3 flex flex-col justify-between items-center w-full gap-2"
                }
              >
                <div className="flex gap-1 justify-center items-center">
                  {user?.currentLoginStreak === 6 ? (
                    <FireGradient size={16} />
                  ) : (
                    <FireSimple
                      weight="fill"
                      size={16}
                      className="text-white"
                    />
                  )}
                  <p className="text-[10px] leading-4 text-zinc-400">Day 6</p>
                </div>
                <p className="font-medium text-sm text-zinc-400">40 SP</p>
                {user?.currentLoginStreak === 6 ? (
                  <div className="rounded-full bg-zinc-900 pl-1 pr-2 py-0.5 flex gap-0.5 justify-center items-center">
                    <CheckCircle
                      weight="fill"
                      size={12}
                      className="text-green-600"
                    />
                    <p className="text-[10px] leading-4 text-zinc-50">
                      Claimed
                    </p>
                  </div>
                ) : (
                  <div className="rounded-full bg-zinc-900 px-1.5 py-0.5 flex gap-0.5 justify-center items-center">
                    <p className="text-[10px] leading-4 text-zinc-400">
                      Unclaimed
                    </p>
                  </div>
                )}
              </div>
              <div
                className={
                  user?.currentLoginStreak === 7
                    ? "bg-primary-gradient p-[1px] rounded-[20px]"
                    : "bg-zinc-800 rounded-[20px] p-3 flex flex-col justify-between items-center w-full gap-2"
                }
              >
                <div className="flex gap-1 justify-center items-center">
                  {user?.currentLoginStreak === 7 ? (
                    <FireGradient size={16} />
                  ) : (
                    <FireSimple
                      weight="fill"
                      size={16}
                      className="text-white"
                    />
                  )}
                  <p className="text-[10px] leading-4 text-zinc-400">Day 7</p>
                </div>
                <p className="font-medium text-sm text-zinc-400">50 SP</p>
                {user?.currentLoginStreak === 7 ? (
                  <div className="rounded-full bg-zinc-900 pl-1 pr-2 py-0.5 flex gap-0.5 justify-center items-center">
                    <CheckCircle
                      weight="fill"
                      size={12}
                      className="text-green-600"
                    />
                    <p className="text-[10px] leading-4 text-zinc-50">
                      Claimed
                    </p>
                  </div>
                ) : (
                  <div className="rounded-full bg-zinc-900 px-1.5 py-0.5 flex gap-0.5 justify-center items-center">
                    <p className="text-[10px] leading-4 text-zinc-400">
                      Unclaimed
                    </p>
                  </div>
                )}
              </div>
              <div
                className={
                  user?.currentLoginStreak > 7
                    ? "bg-primary-gradient p-[1px] rounded-[20px]"
                    : "bg-zinc-800 rounded-[20px] p-3 flex flex-col justify-between items-center w-full gap-2"
                }
              >
                <div className="flex gap-1 justify-center items-center">
                  {user?.currentLoginStreak > 7 ? (
                    <FireGradient size={16} />
                  ) : (
                    <FireSimple
                      weight="fill"
                      size={16}
                      className="text-white"
                    />
                  )}
                  <p className="text-[10px] leading-4 text-zinc-400">
                    Day {">"}7 onwards
                  </p>
                </div>
                <p className="font-medium text-sm text-zinc-400">100 SP</p>
                {user?.currentLoginStreak > 7 ? (
                  <div className="rounded-full bg-zinc-900 pl-1 pr-2 py-0.5 flex gap-0.5 justify-center items-center">
                    <CheckCircle
                      weight="fill"
                      size={12}
                      className="text-green-600"
                    />
                    <p className="text-[10px] leading-4 text-zinc-50">
                      Claimed
                    </p>
                  </div>
                ) : (
                  <div className="rounded-full bg-zinc-900 px-1.5 py-0.5 flex gap-0.5 justify-center items-center">
                    <p className="text-[10px] leading-4 text-zinc-400">
                      Unclaimed
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Claim Daily Streak Button */}
            {user?.currentLoginStreak > 0 ? (
              <button
                onClick={claimStreak}
                className="bg-primary-gradient-2 py-2 rounded-full w-full font-medium text-base text-white transition-transform duration-200 active:scale-95"
              >
                Claim
              </button>
            ) : (
              <button
                disabled
                className="bg-zinc-400 py-2 rounded-full w-full font-medium text-base text-white transition-transform duration-200 active:scale-95"
              >
                Claim
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rounded-[32px] p-5 w-full flex flex-col bg-zinc-900 gap-3">
        <p className="text-white text-lg">Missions</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {missions.map((mission, index) => (
            <div
              key={index}
              className="bg-zinc-800 p-3 flex items-center rounded-xl gap-1.5"
            >
              <div className="w-3/4 flex flex-col justify-between gap-0.5">
                <p className="text-sm text-white">{mission?.title}</p>
                <p className="text-sm text-zinc-400">
                  {user?.completedMissions?.find(
                    (item: any) => item.missionId === mission.id
                  )
                    ? 1
                    : 0}
                  /1
                </p>
                <Progress
                  percent={
                    user?.completedMissions?.find(
                      (item: any) => item.missionId === mission.id
                    )
                      ? 100
                      : 0
                  }
                  showInfo={false}
                  trailColor="#3F3F46"
                  strokeColor="#71717A"
                />
              </div>
              <div className="w-1/4">
                {user?.completedMissions?.find(
                  (item: any) => item.missionId === mission.id
                ) ? (
                  <div className="rounded-full px-3 py-2 text-sm font-medium text-zinc-400 bg-zinc-800 flex items-center justify-center">
                    {mission.rewardPoint} SP
                  </div>
                ) : (
                  <button
                    onClick={() => claimMission(mission.id)}
                    className="bg-primary-gradient-2 rounded-full w-full h-full py-4 font-medium text-sm text-white transition-transform duration-200 active:scale-95"
                  >
                    Claim
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
