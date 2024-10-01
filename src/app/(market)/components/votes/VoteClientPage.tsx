'use client';

import UserCard from "@/components/UserCard";
import { Divider } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import VoteItem from "./VoteItem";
import { getMyPositionList } from "@/contract-call/market";
import { IMyPositionDataItem } from "@/types/my-position";
import { useCrypto } from "@/context/CryptoContext";
import { generateToken } from "@/lib/generate-token";
import { marketVotes } from "@/app/api/votes";
import { IVoteDataItem } from "@/types/votes";
import { ResponseData } from "@/types/response";

const VoteClientPage: React.FC = () => {
  const router = useRouter();
  const { address } = useAccount()
  const [userAddress, setUserAddress] = useState<string | null>(null)
  const [domLoaded, setDomLoaded] = useState<boolean>(false);
  const [checkLoggedIn, setCheckLoggedIn] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [myPositionListData, setMyPositionListData] = useState<IMyPositionDataItem[]>([]);
  const [voteListData, setVoteListData] = useState<IVoteDataItem[]>([]);

  const { fetchPrice } = useCrypto();

  useEffect(() => {
    setDomLoaded(true)
  }, []);

  useEffect(() => {
    if (domLoaded) {
      fetchPrice('eth');
      setTimeout(() => {
        setCheckLoggedIn(true);
      }, 5000)
    }
  }, [domLoaded]);

  useEffect(() => {
    if (checkLoggedIn) {
      doCheckLoggedIn();
    }
  }, [checkLoggedIn])

  useEffect(() => {
    setIsLoggedIn(address ? true : false);

    if (address) {
      fetchVotes();
    }
  }, [address])

  const doCheckLoggedIn = () => {
    if (!address) {
      router.push('/');
    } else {
      setIsLoggedIn(true);
    }
  }

  const fetchMyPositionList = async () => {
    const data = await getMyPositionList(address as any);
    setMyPositionListData(data);
  }

  const fetchVotes = async () => {
    try {
      const finalToken = await generateToken(userAddress);
  

      const { data } = await marketVotes({
        headers: {
          Authorization: `Bearer ${finalToken}`,
        },
      });
  
      let votes: IVoteDataItem[] = [];
  
      if (data.length > 0) {
        votes = data;
        setVoteListData(votes);
      } else {
        console.log("No data received from API");
        setVoteListData(votes);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  const handleVote = () => {
    // Logic to handle voting, e.g., API call
    console.log('Vote button clicked');
  };
  
  if (!domLoaded || !isLoggedIn) {
    return <></>
  }

  return (
    <>
      <div className="w-full flex gap-4 py-4 relative">
        <div className="w-1/3 flex flex-col gap-4 sticky top-[90px]">
          <UserCard />
          {/* Will be used later */}
          {/* <UserStatisticsCard />
          <SidebarMenu /> */}
        </div>
        <div className="w-2/3 mx-auto">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col bg-zinc-950 rounded-[24px] gap-6 p-6">
              <h2 className="text-lg font-medium">Votes</h2>
              <Divider className="!border-zinc-800 !m-0 z-10" />
              {voteListData.length > 0 ? (
                <>
                  {voteListData.map((item, index) => (
                    <div className="flex flex-col gap-6" key={index}>
                      {index > 0 && (<Divider className="!border-zinc-800 !m-0 z-10" />)}
                      <VoteItem data={item} onVoteClick={handleVote} />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="w-full flex justify-center items-center">
                    <h2 className="text-lg font-medium">No data found</h2>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default VoteClientPage;