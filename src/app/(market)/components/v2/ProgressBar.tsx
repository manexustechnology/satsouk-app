import { cn } from "@/utils/cn";

interface IProgressBarProps {
  totalYes: number;
  totalNo: number;
}

const ProgressBar = ({
  totalYes,
  totalNo
}: IProgressBarProps) => {
  return (
    <div className="bg-[#27272A] p-2 rounded-full flex gap-x-1">
      <div className={`${cn(totalYes > 30 ? 'bg-green-600' : 'bg-green-900')} h-7  rounded-full transition-all`} style={{
        width: `${totalYes}%`
      }} />
      <div className={`${cn(totalNo > 30 ? 'bg-rose-600' : 'bg-rose-900')} h-7  rounded-full transition-all`} style={{
        width: `${totalNo}%`
      }} />
    </div>
  )
}

export default ProgressBar;
