'use client'
import { capitalizeWords } from "@/utils/string";

interface IVoteAction {
  onVoteYes?: () => void;
  onVotekNo?: () => void;
}

const VoteAction = ({
  onVoteYes = () => console.log("TODO: NOT IMPLEMENTED"),
  onVotekNo = () => console.log("TODO: NOT IMPLEMENTED")
} : IVoteAction) => {
  return (
    <div className="flex gap-x-2">
      <button onClick={onVoteYes} className="bg-green-950 flex-1 rounded-full py-2 text-green-600 font-medium text-base transition-transform duration-200 active:scale-95">
        {capitalizeWords('yes')}
      </button>
      <button onClick={onVotekNo} className="bg-rose-950 flex-1 rounded-full py-2 text-rose-600 font-medium text-base transition-transform duration-200 active:scale-95">
        {capitalizeWords('No')}
      </button>
    </div>
  )
}

export default VoteAction;
