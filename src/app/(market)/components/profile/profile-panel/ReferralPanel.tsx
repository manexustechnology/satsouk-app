import { copyText } from "@/utils/string";
import { CheckCircle, Copy, TelegramLogo, XLogo } from "@phosphor-icons/react/dist/ssr"
import { useRef, useState } from "react"

export const ReferralPanel: React.FC = () => {
  const referralLinkRef = useRef(null);
  const [isReferralCopied, setIsReferralCopied] = useState<boolean>(false);

  const copyReferralLink = () => {
    copyText((referralLinkRef.current as any)?.innerHTML);
    setIsReferralCopied(true);
    setTimeout(() => {
      setIsReferralCopied(false);
    }, 3000);
  }

  return (
    <div key="referral-panel" className="flex flex-col gap-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="rounded-[32px] p-5 w-full h-full text-zinc-400 bg-zinc-900 md:min-h-[200px] flex flex-col justify-between gap-6">
          <div className="flex gap-2 items-center">
            <div className="flex flex-col gap-1 w-full">
              <p className="text-zinc-400 text-lg">Share your referral</p>
              <div className="rounded-full bg-green-950 py-2.5 px-3 w-full">
                <span className="text-sm text-green-600">You will receive <span className="font-bold">100 SP</span> for every referral</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm text-white">Referral URL</p>
            <div className="flex flex-col md:flex-row justify-between items-center w-full gap-1.5">
              {/* Input referral link */}
              <div className="bg-primary-gradient p-0.5 rounded-full w-full">
                <div className="bg-zinc-950 rounded-full flex gap-2 px-3.5 py-2.5 justify-between items-center w-full">
                  <span className="text-zinc-300 text-xs overflow-x-scroll no-scrollbar max-w-[280px] md:max-w-[220px] text-nowrap" ref={referralLinkRef}>https://app.satsouk.xyz/KJsd823e</span>
                  {isReferralCopied ? (
                    <CheckCircle weight="fill" size={16} className="text-green-600" />
                  ) : (
                    <Copy weight="fill" size={16} className="text-zinc-600 cursor-pointer" onClick={copyReferralLink} />
                  )}
                </div>
              </div>
              <div className="flex items-center w-full md:w-fit gap-1.5">
                <div className="rounded-full p-3 bg-white w-full md:w-fit flex items-center justify-center">
                  <XLogo weight="bold" size={16} className="text-zinc-950" />
                </div>
                <div className="rounded-full p-3 bg-white w-full md:w-fit flex items-center justify-center">
                  <TelegramLogo weight="fill" size={16} className="text-zinc-950" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-[32px] p-5 w-full text-zinc-400 bg-zinc-900 min-h-[100px] md:min-h-[200px] flex flex-col justify-between">
          <div className="flex gap-2 items-center">
            <p className="text-zinc-400 text-lg">Total SP earned</p>
          </div>
          <p className="text-[32px] text-white">
            200 SP
          </p>
        </div>
        <div className="rounded-[32px] p-5 w-full text-zinc-400 bg-zinc-900 min-h-[100px] md:min-h-[200px] flex flex-col justify-between">
          <div className="flex gap-2 items-center">
            <p className="text-zinc-400 text-lg">Total referred users</p>
          </div>
          <p className="text-[32px] text-white">
            20
          </p>
        </div>
      </div>
    </div>
  )
}