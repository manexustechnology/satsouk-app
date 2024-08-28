'use client';

import { CaretRight, Flame, Wallet } from "@phosphor-icons/react/dist/ssr";
import { Divider } from "antd";
import Image from "next/image";
import { normalize } from "path";
import { useAccount, useBalance, useEnsAvatar, useEnsName } from "wagmi";
import CustomAvatar from "./CustomAvatar";
import Link from "next/link";
import { renderWalletAddress } from "../utils/string";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { truncateNumber } from "@/utils/number";
import { useState } from "react";
import { IMyPositionDataItem } from "@/types/my-position";
import { getMyPositionList } from "@/contract-call/market";
import { useCrypto } from "@/context/CryptoContext";

const UserCard: React.FC = () => {
  const { price } = useCrypto();
  const [myPositionListData, setMyPositionListData] = useState<IMyPositionDataItem[]>([]);
  const { address, isConnected } = useAccount();
  const ensNameResult = useEnsName({
    address,
  });

  const { data: balance, isError, isLoading } = useBalance({
    address: address,
  });

  let ensImage: string | undefined = undefined;

  const result = useEnsAvatar({
    name: normalize(ensNameResult?.data || ''),
  })
  if (result && result.data) {
    ensImage = result.data;
  }

  const fetchMyPositionList = async () => {
    const data = await getMyPositionList(address as any);
    setMyPositionListData(data);
  }


  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-center items-center bg-primary-gradient-2 py-2 px-3 rounded-t-[24px] gap-1">
        <Flame weight="fill" size={14} />
        <p className="text-xs font-medium">0 Days</p>
        <p className="text-xs">login streak</p>
      </div>
      <div className="flex flex-col bg-zinc-950 rounded-b-[24px] gap-6 p-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            {address && (<CustomAvatar address={address} ensImage={ensImage} size={50} />)}
            <div className="flex flex-col gap-1">
              {ensNameResult?.data && (
                <p className="text-sm font-medium">{ensNameResult.data}</p>
              )}
              <p className="text-xs text-zinc-400">{renderWalletAddress(address)}</p>
              <p className="font-normal text-[14px] leading-[20px] text-[#A1A1AA]">
                {isConnected && (
                  <>
                    <span className="text-white">Balance:</span> {Number(truncateNumber(Number(balance?.formatted || 0), 3)).toFixed(3)} {balance?.symbol}
                  </>
                )}
              </p>
            </div>
          </div>
          {/* Will used later */}
          {/* <div className="flex gap-1 items-center">
            <Image
              src='/images/badge-01.png'
              alt="badge 1"
              width={28}
              height={28}
              style={{ width: '28px', height: 'auto' }}
              className="object-cover"
            />
            <Image
              src='/images/badge-02.png'
              alt="badge 1"
              width={28}
              height={28}
              style={{ width: '28px', height: 'auto' }}
              className="object-cover"
            />
            <Image
              src='/images/badge-03.png'
              alt="badge 1"
              width={28}
              height={28}
              style={{ width: '28px', height: 'auto' }}
              className="object-cover"
            />
            <div className="flex items-center text-xs text-zinc-400">
              <p>+12</p>
              <CaretRight weight="bold" size={16} />
            </div>
          </div> */}
        </div>
        <div className="relative">
          {/* <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10">
            <div className="text-white text-base">Coming soon</div>
          </div> */}
          <div className="flex items-center w-full bg-zinc-900 rounded-xl p-3">
            <div className="flex flex-col items-center gap-1 w-5/12">
              <p className="text-xs text-zinc-400">Position Amount</p>
              {myPositionListData.length > 0 ? (
                <>
                  <p className="text-sm font-medium">{myPositionListData.map((item) => (item.amount || 0) * (price || 0)).reduce((sum, currentValue) => sum + currentValue, 0)}</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium">$0</p>
                </>
              )}
            </div>
            <div className="w-2/12 flex justify-center items-center">
              <Divider type="vertical" className="!m-0 border-[1px] !h-6 border-zinc-700" />
            </div>
            <div className="flex flex-col items-center gap-1 w-5/12">
              <p className="text-xs text-zinc-400">Potential Prize</p>
              {myPositionListData.length > 0 ? (
                <>
                  <p className="text-sm font-medium text-green-500">{myPositionListData.map((item) => ((item.potentialPrize || 0) * (price || 0)) - ((item.amount || 0) * (price || 0))).reduce((sum, currentValue) => sum + currentValue, 0)}</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-green-500">$0</p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Link href="/my-position" className="w-full flex justify-center items-center gap-1 bg-zinc-800 rounded-xl p-3">
            <Wallet weight="bold" size={16} />
            <p className="text-sm font-medium">Your position</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UserCard;