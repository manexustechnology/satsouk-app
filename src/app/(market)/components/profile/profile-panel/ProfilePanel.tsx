import { CheckCircle, FireSimple, Info } from "@phosphor-icons/react/dist/ssr"
import { Progress } from "antd"
import { FireGradient } from "../../icons/FireIcon"
import CustomAvatar from "@/components/CustomAvatar"
import { renderWalletAddress } from "@/utils/string"
import { useAccount, useEnsName, useEnsAvatar } from "wagmi"

export const ProfilePanel: React.FC = () => {
  const { address } = useAccount();
  const { data: ensName, isLoading: ensNameLoading, error: ensNameError } = useEnsName({
    address,
    chainId: 1, // Ethereum mainnet
  });
  const { data: avatar, isLoading: avatarLoading, error: avatarError } = useEnsAvatar({
    name: ensName || '', // Use the resolved ENS name or an empty string
    chainId: 1, // Ethereum mainnet
  });

  return (
    <div key="profile-panel" className="flex flex-col gap-2">
      <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full col-span-1 md:col-span-2">
          <div className="rounded-[32px] p-5 w-full text-zinc-400 bg-zinc-900 min-h-[100px] md:min-h-[200px] flex flex-col justify-between">
            <div>
              <CustomAvatar address={address as string} ensImage={avatar} size={40} />
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
              200 SP
            </p>
          </div>
          <div className="rounded-[32px] p-5 w-full text-zinc-400 bg-zinc-900 min-h-[100px] md:min-h-[200px] flex flex-col justify-between">
            <p className="text-lg">Total position</p>
            <p className="text-[32px] text-white">
              $12,099,232.43
            </p>
          </div>
          <div className="rounded-[32px] p-5 w-full text-zinc-400 bg-zinc-900 min-h-[100px] md:min-h-[200px] flex flex-col justify-between">
            <p className="text-lg">Potential prize</p>
            <p className="text-[32px] text-green-600">
              +$356,438,006.033
            </p>
          </div>
        </div>
        <div className="w-full">
          <div className="rounded-[32px] p-5 w-full text-zinc-400 bg-zinc-900 h-full flex flex-col gap-2">
            <div className="flex gap-2 items-center p-2">
              <p className="text-white text-lg">Daily Reward Streak</p>
              <Info weight="fill" size={24} className="text-zinc-600" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-zinc-800 rounded-[20px] p-3 flex flex-col justify-between items-center w-full gap-2">
                <div className="flex gap-1 justify-center items-center">
                  <FireGradient size={16} />
                  <p className="text-[10px] leading-4 text-zinc-200">Day 1</p>
                </div>
                <p className="font-medium text-sm text-white">
                  5 SP
                </p>
                <div className="rounded-full bg-zinc-900 pl-1 pr-2 py-0.5 flex gap-0.5 justify-center items-center">
                  <CheckCircle weight="fill" size={12} className="text-green-600" />
                  <p className="text-[10px] leading-4 text-zinc-50">Claimed</p>
                </div>
              </div>
              <div className="bg-zinc-800 rounded-[20px] p-3 flex flex-col justify-between items-center w-full gap-2">
                <div className="flex gap-1 justify-center items-center">
                  <FireGradient size={16} />
                  <p className="text-[10px] leading-4 text-zinc-200">Day 2</p>
                </div>
                <p className="font-medium text-sm text-white">
                  10 SP
                </p>
                <div className="rounded-full bg-zinc-900 pl-1 pr-2 py-0.5 flex gap-0.5 justify-center items-center">
                  <CheckCircle weight="fill" size={12} className="text-green-600" />
                  <p className="text-[10px] leading-4 text-zinc-50">Claimed</p>
                </div>
              </div>
              <div className="bg-primary-gradient p-[1px] rounded-[20px]">
                <div className="bg-zinc-800 rounded-[20px] p-3 flex flex-col justify-between items-center w-full gap-2">
                  <div className="flex gap-1 justify-center items-center">
                    <FireSimple weight="fill" size={16} className="text-white" />
                    <p className="text-[10px] leading-4 text-zinc-200">Day 3</p>
                  </div>
                  <p className="font-medium text-sm text-zinc-400">
                    15 SP
                  </p>
                  <div className="rounded-full bg-zinc-900 px-1.5 py-0.5 flex gap-0.5 justify-center items-center">
                    <p className="text-[10px] leading-4 text-zinc-50 cursor-pointer">Claim now!</p>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-800 rounded-[20px] p-3 flex flex-col justify-between items-center w-full gap-2">
                <div className="flex gap-1 justify-center items-center">
                  <FireSimple weight="fill" size={16} className="text-zinc-400" />
                  <p className="text-[10px] leading-4 text-zinc-400">Day 4</p>
                </div>
                <p className="font-medium text-sm text-zinc-400">
                  20 SP
                </p>
                <div className="rounded-full bg-zinc-900 px-1.5 py-0.5 flex gap-0.5 justify-center items-center">
                  <p className="text-[10px] leading-4 text-zinc-400">Unclaimed</p>
                </div>
              </div>
              <div className="bg-zinc-800 rounded-[20px] p-3 flex flex-col justify-between items-center w-full gap-2">
                <div className="flex gap-1 justify-center items-center">
                  <FireSimple weight="fill" size={16} className="text-zinc-400" />
                  <p className="text-[10px] leading-4 text-zinc-400">Day 5</p>
                </div>
                <p className="font-medium text-sm text-zinc-400">
                  30 SP
                </p>
                <div className="rounded-full bg-zinc-900 px-1.5 py-0.5 flex gap-0.5 justify-center items-center">
                  <p className="text-[10px] leading-4 text-zinc-400">Unclaimed</p>
                </div>
              </div>
              <div className="bg-zinc-800 rounded-[20px] p-3 flex flex-col justify-between items-center w-full gap-2">
                <div className="flex gap-1 justify-center items-center">
                  <FireSimple weight="fill" size={16} className="text-zinc-400" />
                  <p className="text-[10px] leading-4 text-zinc-400">Day 6</p>
                </div>
                <p className="font-medium text-sm text-zinc-400">
                  40 SP
                </p>
                <div className="rounded-full bg-zinc-900 px-1.5 py-0.5 flex gap-0.5 justify-center items-center">
                  <p className="text-[10px] leading-4 text-zinc-400">Unclaimed</p>
                </div>
              </div>
              <div className="bg-zinc-800 rounded-[20px] p-3 flex flex-col justify-between items-center w-full gap-2">
                <div className="flex gap-1 justify-center items-center">
                  <FireSimple weight="fill" size={16} className="text-zinc-400" />
                  <p className="text-[10px] leading-4 text-zinc-400">Day 7</p>
                </div>
                <p className="font-medium text-sm text-zinc-400">
                  50 SP
                </p>
                <div className="rounded-full bg-zinc-900 px-1.5 py-0.5 flex gap-0.5 justify-center items-center">
                  <p className="text-[10px] leading-4 text-zinc-400">Unclaimed</p>
                </div>
              </div>
              <div className="bg-zinc-800 rounded-[20px] p-3 flex flex-col justify-between items-center w-full gap-2 col-span-2">
                <div className="flex gap-1 justify-center items-center">
                  <FireSimple weight="fill" size={16} className="text-zinc-400" />
                  <p className="text-[10px] leading-4 text-zinc-400">Day {">"}7 onwards</p>
                </div>
                <p className="font-medium text-sm text-zinc-400">
                  100 SP
                </p>
                <div className="rounded-full bg-zinc-900 px-1.5 py-0.5 flex gap-0.5 justify-center items-center">
                  <p className="text-[10px] leading-4 text-zinc-400">Unclaimed</p>
                </div>
              </div>
            </div>
            {/* Claim Daily Streak Button */}
            <button className="bg-primary-gradient-2 py-2 rounded-full w-full font-medium text-base text-white transition-transform duration-200 active:scale-95">
              Claim
            </button>
          </div>
        </div>
      </div>
      <div className="rounded-[32px] p-5 w-full flex flex-col bg-zinc-900 gap-3">
        <p className="text-white text-lg">Missions</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="bg-zinc-800 p-3 flex items-center rounded-xl gap-1.5">
            <div className="w-3/4 flex flex-col justify-between gap-0.5">
              <p className="text-sm text-white">Share on X</p>
              <p className="text-sm text-zinc-400">1/1</p>
              <Progress percent={30} showInfo={false} trailColor="#3F3F46" strokeColor="#71717A" />
            </div>
            <div className="w-1/4">
              <button className="bg-primary-gradient-2 rounded-full w-full h-full py-4 font-medium text-sm text-white transition-transform duration-200 active:scale-95">
                Claim
              </button>
            </div>
          </div>
          <div className="bg-zinc-800 p-3 flex items-center rounded-xl gap-1.5">
            <div className="w-3/4 flex flex-col justify-between gap-0.5">
              <p className="text-sm text-white">Share on X</p>
              <p className="text-sm text-zinc-400">1/1</p>
              <Progress percent={30} showInfo={false} trailColor="#3F3F46" strokeColor="#71717A" />
            </div>
            <div className="w-1/4">
              <button className="bg-primary-gradient-2 rounded-full w-full h-full py-4 font-medium text-sm text-white transition-transform duration-200 active:scale-95">
                Claim
              </button>
            </div>
          </div>
          <div className="bg-zinc-800 p-3 flex items-center rounded-xl gap-1.5">
            <div className="w-3/4 flex flex-col justify-between gap-0.5">
              <p className="text-sm text-white">Share on X</p>
              <p className="text-sm text-zinc-400">1/1</p>
              <Progress percent={30} showInfo={false} trailColor="#3F3F46" strokeColor="#71717A" />
            </div>
            <div className="w-1/4">
              <button className="bg-primary-gradient-2 rounded-full w-full h-full py-4 font-medium text-sm text-white transition-transform duration-200 active:scale-95">
                Claim
              </button>
            </div>
          </div>
          <div className="bg-zinc-800 p-3 flex items-center rounded-xl gap-1.5">
            <div className="w-3/4 flex flex-col justify-between gap-0.5">
              <p className="text-sm text-white">Share on X</p>
              <p className="text-sm text-zinc-400">1/1</p>
              <Progress percent={30} showInfo={false} trailColor="#3F3F46" strokeColor="#71717A" />
            </div>
            <div className="w-1/4">
              <button className="bg-primary-gradient-2 rounded-full w-full h-full py-4 font-medium text-sm text-white transition-transform duration-200 active:scale-95">
                Claim
              </button>
            </div>
          </div>
          <div className="bg-zinc-800 p-3 flex items-center rounded-xl gap-1.5">
            <div className="w-3/4 flex flex-col justify-between gap-0.5">
              <p className="text-sm text-white">Share on X</p>
              <p className="text-sm text-zinc-400">1/1</p>
              <Progress percent={30} showInfo={false} trailColor="#3F3F46" strokeColor="#71717A" />
            </div>
            <div className="w-1/4">
              <button className="bg-zinc-900 rounded-full w-full h-full py-4 font-medium text-sm text-white cursor-default">
                1k SP
              </button>
            </div>
          </div>
          <div className="bg-zinc-800 p-3 flex items-center rounded-xl gap-1.5">
            <div className="w-3/4 flex flex-col justify-between gap-0.5">
              <p className="text-sm text-white">Share on X</p>
              <p className="text-sm text-zinc-400">1/1</p>
              <Progress percent={30} showInfo={false} trailColor="#3F3F46" strokeColor="#71717A" />
            </div>
            <div className="w-1/4">
              <button className="bg-zinc-900 rounded-full w-full h-full py-4 font-medium text-sm text-white cursor-default">
                1k SP
              </button>
            </div>
          </div>
          <div className="bg-zinc-800 p-3 flex items-center rounded-xl gap-1.5">
            <div className="w-3/4 flex flex-col justify-between gap-0.5">
              <p className="text-sm text-white">Share on X</p>
              <p className="text-sm text-zinc-400">1/1</p>
              <Progress percent={30} showInfo={false} trailColor="#3F3F46" strokeColor="#71717A" />
            </div>
            <div className="w-1/4">
              <button className="bg-zinc-900 rounded-full w-full h-full py-4 font-medium text-sm text-white cursor-default">
                1k SP
              </button>
            </div>
          </div>
          <div className="bg-zinc-800 p-3 flex items-center rounded-xl gap-1.5">
            <div className="w-3/4 flex flex-col justify-between gap-0.5">
              <p className="text-sm text-white">Share on X</p>
              <p className="text-sm text-zinc-400">1/1</p>
              <Progress percent={30} showInfo={false} trailColor="#3F3F46" strokeColor="#71717A" />
            </div>
            <div className="w-1/4">
              <button className="bg-zinc-900 rounded-full w-full h-full py-4 font-medium text-sm text-white cursor-default">
                1k SP
              </button>
            </div>
          </div>
          <div className="bg-zinc-800 p-3 flex items-center rounded-xl gap-1.5">
            <div className="w-3/4 flex flex-col justify-between gap-0.5">
              <p className="text-sm text-white">Share on X</p>
              <p className="text-sm text-zinc-400">1/1</p>
              <Progress percent={30} showInfo={false} trailColor="#3F3F46" strokeColor="#71717A" />
            </div>
            <div className="w-1/4">
              <button className="bg-zinc-900 rounded-full w-full h-full py-4 font-medium text-sm text-white cursor-default">
                1k SP
              </button>
            </div>
          </div>
          <div className="bg-zinc-800 p-3 flex items-center rounded-xl gap-1.5">
            <div className="w-3/4 flex flex-col justify-between gap-0.5">
              <p className="text-sm text-white">Share on X</p>
              <p className="text-sm text-zinc-400">1/1</p>
              <Progress percent={30} showInfo={false} trailColor="#3F3F46" strokeColor="#71717A" />
            </div>
            <div className="w-1/4">
              <button className="bg-zinc-900 rounded-full w-full h-full py-4 font-medium text-sm text-white cursor-default">
                1k SP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}