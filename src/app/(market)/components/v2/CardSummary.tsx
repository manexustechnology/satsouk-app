import { ClassNameValue } from "tailwind-merge"

interface ICardSummaryProps {
  title?: string
  value?: string
  suffix?: string
  className?: ClassNameValue
}

const CardSummary = ({
  suffix,
  title,
  value,
  className
} : ICardSummaryProps) => {
  return (
    <div className={`p-5 rounded-3xl bg-zinc-800 ${className}`}>
      <h2 className="text-lg text-zinc-400 mb-5">{title}</h2>
      <div className="flex justify-between items-center">
        <h3 className="text-3xl">{value}</h3>
        <h3 className="text-3xl text-zinc-400">{suffix}</h3>
      </div>
    </div>
  )
}

export default CardSummary;
