import { useState } from 'react';
import { CalendarBlank, CheckCircle } from "@phosphor-icons/react/dist/ssr"; // Import CheckCircle icon
import Image from "next/image";
import dayjs from 'dayjs';
import { Divider } from "antd";
import { useCrypto } from "@/context/CryptoContext";
import { IVoteDataItem } from "@/types/votes";
import { cn } from '@/utils/cn';
import { capitalizeWords } from '@/utils/string';

interface VoteItemProps {
  data?: IVoteDataItem;
  onVoteClick: () => void;
}

const VoteItem: React.FC<VoteItemProps> = ({ data, onVoteClick }) => {
  const { price } = useCrypto();
  
  const [imageSrc, setImageSrc] = useState(data?.thumbnail || '/images/logo-white-colorful.png');

  if (!data) return <></>;

  return (
    <>
      <div className="flex justify-stretch gap-4">
        <div className="w-7/12 flex items-center gap-2">
          <Image
            src={imageSrc}
            alt={'image'}
            width={64}
            height={64}
            className="rounded-md"
            onError={() => setImageSrc('/images/logo-white-colorful.png')}
          />
          <div className="flex flex-col h-full gap-1">
            <div className="flex gap-2 text-zinc-400">
              <div className="flex gap-1 items-center">
                <CalendarBlank weight="fill" size={16} />
                <p className="text-xs">{dayjs(data.startAt).format('D MMM YYYY')} - {dayjs(data.expiredAt).format('D MMM YYYY')}</p>
              </div>
            </div>
            <h2 className="text-sm font-medium">{data.text}</h2>
          </div>
        </div>
        <div className="w-5/12 rounded-xl flex justify-center items-center text-zinc-400">
          <div className="flex justify-center items-center gap-2">
          <p className="text-xs">Options : </p>
            {data.options.map((item, index) => (
              <div key={index} className="flex items-center">
                {/* Option text */}
                <span className={cn(
                  "text-xs font-medium",
                  item === 'No' ? 'text-rose-500' : 'text-green-500'
                )}>{capitalizeWords(item)}</span>

                {index < data.options.length - 1 && (
                  <Divider type="vertical" className="!border-zinc-700 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="w-2/12 rounded-xl flex justify-center items-center">
            <button 
              onClick={onVoteClick}
              className="w-full flex justify-center items-center gap-1 bg-green-900 rounded-xl p-3 mt-2"
            >
              <CheckCircle weight="bold" size={16} />
              <p className="text-sm font-medium">Vote</p>
            </button>
        </div>
      </div>
    </>
  );
}

export default VoteItem;
