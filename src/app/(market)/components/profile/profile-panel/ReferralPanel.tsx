import { copyText, renderWalletAddress } from "@/utils/string";
import { CheckCircle, Copy, TelegramLogo, XLogo } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image";
import { useRef, useState } from "react"
import Pagination from "../../v2/Pagination";
import useResizeWindow from "@/app/(market)/hooks/useResizeWindow";

export const ReferralPanel: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const { windowSize } = useResizeWindow();
  const referralLinkRef = useRef(null);
  const [isReferralCopied, setIsReferralCopied] = useState<boolean>(false);

  const onPageChange = (pageSelected: number) => setPage(pageSelected)

  const onPageBack = (currentPage: number) => {
    const result = currentPage - 1

    if (result === 0) return

    setPage(currentPage - 1)
  }

  const onPageNext = (currentPage: number) => {
    const result = currentPage + 1

    if (result > 15) return

    setPage(currentPage + 1)
  }

  const onLastPage = () => setPage(15)

  const onFirstPage = () => setPage(1)

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
      <div className="bg-zinc-900 rounded-[32px] flex flex-col gap-2 p-5">
        <p className="text-zinc-400 text-lg">Referred User List</p>
        {/* Available Referral List */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center border-b-[1px] border-b-zinc-800 py-3">
            <p className="text-zinc-300 text-sm">{renderWalletAddress('0xd36aab03676f519ed49c1863cc6003e9bbb1e1f4', 10)}</p>
            <p className="text-zinc-400 text-sm">October 25, 2019</p>
          </div>
          <div className="flex justify-between items-center border-b-[1px] border-b-zinc-800 py-3">
            <p className="text-zinc-300 text-sm">{renderWalletAddress('0xd36aab03676f519ed49c1863cc6003e9bbb1e1f4', 10)}</p>
            <p className="text-zinc-400 text-sm">October 25, 2019</p>
          </div>
          <div className="flex justify-between items-center border-b-[1px] border-b-zinc-800 py-3">
            <p className="text-zinc-300 text-sm">{renderWalletAddress('0xd36aab03676f519ed49c1863cc6003e9bbb1e1f4', 10)}</p>
            <p className="text-zinc-400 text-sm">October 25, 2019</p>
          </div>
          <div className="flex justify-between items-center border-b-[1px] border-b-zinc-800 py-3">
            <p className="text-zinc-300 text-sm">{renderWalletAddress('0xd36aab03676f519ed49c1863cc6003e9bbb1e1f4', 10)}</p>
            <p className="text-zinc-400 text-sm">October 25, 2019</p>
          </div>
          <div className="flex justify-between items-center border-b-[1px] border-b-zinc-800 py-3">
            <p className="text-zinc-300 text-sm">{renderWalletAddress('0xd36aab03676f519ed49c1863cc6003e9bbb1e1f4', 10)}</p>
            <p className="text-zinc-400 text-sm">October 25, 2019</p>
          </div>
          <div className="flex justify-between items-center border-b-[1px] border-b-zinc-800 py-3">
            <p className="text-zinc-300 text-sm">{renderWalletAddress('0xd36aab03676f519ed49c1863cc6003e9bbb1e1f4', 10)}</p>
            <p className="text-zinc-400 text-sm">October 25, 2019</p>
          </div>
          <div className="flex justify-between items-center border-b-[1px] border-b-zinc-800 py-3">
            <p className="text-zinc-300 text-sm">{renderWalletAddress('0xd36aab03676f519ed49c1863cc6003e9bbb1e1f4', 10)}</p>
            <p className="text-zinc-400 text-sm">October 25, 2019</p>
          </div>
          <div className="flex justify-between items-center border-b-[1px] border-b-zinc-800 py-3">
            <p className="text-zinc-300 text-sm">{renderWalletAddress('0xd36aab03676f519ed49c1863cc6003e9bbb1e1f4', 10)}</p>
            <p className="text-zinc-400 text-sm">October 25, 2019</p>
          </div>
          <div className="flex justify-between items-center border-b-[1px] border-b-zinc-800 py-3">
            <p className="text-zinc-300 text-sm">{renderWalletAddress('0xd36aab03676f519ed49c1863cc6003e9bbb1e1f4', 10)}</p>
            <p className="text-zinc-400 text-sm">October 25, 2019</p>
          </div>
          <div className="flex justify-between items-center border-b-[1px] border-b-zinc-800 py-3">
            <p className="text-zinc-300 text-sm">{renderWalletAddress('0xd36aab03676f519ed49c1863cc6003e9bbb1e1f4', 10)}</p>
            <p className="text-zinc-400 text-sm">October 25, 2019</p>
          </div>
        </div>
        {/* Empty Referral List */}
        {/* <div className="flex flex-col items-center mb-6">
          <Image
            src="/images/empty-folder.png"
            width={1000}
            height={1000}
            style={{ width: '200px', height: '200px' }}
            alt="Empty Image"
          />
          <p className="text-base mb-3 font-medium text-center">You have no referred users</p>
        </div> */}
      </div>
      {/* Pagination */}
      <Pagination
        isMobile={windowSize?.width <= 768}
        totalPage={15}
        currentPage={page}
        onPageChange={onPageChange}
        onBack={onPageBack}
        onNext={onPageNext}
        onLastPage={onLastPage}
        onFirstPage={onFirstPage} />
    </div>
  )
}