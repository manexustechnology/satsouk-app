import { cn } from "@/utils/cn";
import { formatNumberToUSD } from "@/utils/string";

interface IProgressBarProps {
  totalYes: number;
  totalNo: number;
  volumeYes?: number;
  volumeNo?: number;
}

const ProgressBar = ({
  totalYes,
  totalNo,
  volumeNo,
  volumeYes
}: IProgressBarProps) => {
  return (
    <section className="flex flex-col gap-y-2">
      <div className="bg-[#27272A] p-2 rounded-full flex gap-x-1">
        <div className={`${cn(totalYes > 30 ? 'bg-green-600' : 'bg-green-900')} h-7  rounded-full transition-all`} style={{
          width: `${totalYes}%`
        }} />
        <div className={`${cn(totalNo > 30 ? 'bg-rose-600' : 'bg-rose-900')} h-7  rounded-full transition-all`} style={{
          width: `${totalNo}%`
        }} />
      </div>
      <div className="flex justify-between items-center bg-[#27272A] p-2 rounded-full">
        <div className="flex gap-1 items-center text-xs">
          <p className="text-green-600 font-medium text-xs">{totalYes.toFixed(2)}%</p>
          <p className="text-xs">{formatNumberToUSD(volumeYes || 0)}</p>
        </div>
        <div className="flex gap-1 items-center text-xs">
          <p className="text-rose-600 font-medium text-xs">{totalNo.toFixed(2)}%</p>
          <p className="text-xs">{formatNumberToUSD(volumeNo || 0)}</p>
        </div>
      </div>
    </section>
  )
}

export default ProgressBar;
