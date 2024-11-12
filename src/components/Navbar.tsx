'use client';

import { cn } from "@/utils/cn";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { BellSimple, CaretDown, Coins, Info, List, MagnifyingGlass, SignOut, SquaresFour, Trophy, Wallet } from "@phosphor-icons/react/dist/ssr";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from 'use-debounce';
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import "@/styles/navbar.css";
import { DynamicConnectButton, DynamicWidget, useDynamicContext, useIsLoggedIn } from "@/lib/dynamic";
import CustomAvatar from "./CustomAvatar";
import { normalize } from "path";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState<string | null>(null);
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  const pathname = usePathname()
  const searchRef = useRef<HTMLInputElement>(null)
  const { address } = useAccount()
  const isLoggedIn = useIsLoggedIn();
  const [showMenuMobile, setShowMenuMobile] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnMenuRef = useRef<HTMLDivElement>(null);
  const { setShowDynamicUserProfile, handleLogOut } = useDynamicContext();
  const [pageLoaded, setPageLoaded] = useState(false);
  const ensNameResult = useEnsName({
    address,
  });
  const { primaryWallet } = useDynamicContext();

  let ensImage: string | undefined = undefined;

  const result = useEnsAvatar({
    name: normalize(ensNameResult?.data || ''),
  })
  if (result && result.data) {
    ensImage = result.data;
  }

  useEffect(() => {
    // callback function to call when event triggers
    const onPageLoad = () => {
      setPageLoaded(true);
    };

    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad, false);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener('load', onPageLoad);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && btnMenuRef.current && !btnMenuRef.current.contains(event.target as Node)) {
        setShowMenuMobile(false);
      }
    };

    if (showMenuMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenuMobile]);

  const debounceSearchInput = useDebouncedCallback(
    (value: string) => {
      setSearchInput(value)
    },
    1000,
  );

  useEffect(() => {
    if (searchInput !== null) {
      handleSearch();
    }
  }, [searchInput]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("search", searchInput!);
    router.push(`/?${params.toString()}`);
  }

  const toggleShowSearchInput = () => {
    setShowSearchInput((prev: boolean) => {
      if (prev) {
        searchRef.current?.blur()
      } else {
        searchRef.current?.focus()
      }

      return !prev
    })
  }

  const doLogout = () => {
    handleLogOut();
    setShowMenuMobile(false);
  }

  const doTest = () => {
    console.log('primary wallet connector', primaryWallet?.connector);
  }

  return (
    <nav className="relative">
      <div className="fixed w-full h-[74px] bg-black z-10 flex justify-center inset-0">
        <div className="w-full h-full max-w-[1238px] py-4 px-3 flex justify-between items-center">
          <div className="flex w-2/3 gap-2 max-md:flex-col max-md:w-fit">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <Image
                src='/images/logo-white-colorful.png'
                alt="Satsouk Logo"
                className="max-md:hidden max-h-[32px] w-fit"
                width={168}
                height={32}
              />
              <Image
                src='/images/satsouk-logo.svg'
                alt="Satsouk Logo"
                className="max-md:block lg:hidden max-h-[32px] w-fit"
                width={40}
                height={32}
              />
              <span className="bg-zinc-800 text-xs font-bold leading-4 py-[2px] px-[6px] rounded-[100px] w-fit max-md:hidden">
                <span className="bg-primary-gradient bg-clip-text text-transparent">APP</span>
              </span>
            </Link>
            <div className="flex items-center gap-2 w-fit max-md:hidden">
              <div className="flex items-center z-10">
                <div className={`p-3 bg-zinc-800 rounded-full transition-all duration-150 ${cn(showSearchInput ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto')}`} role="button" onClick={toggleShowSearchInput}>
                  <MagnifyingGlass weight="bold" size={14} className="text-zinc-400" />
                </div>
                <InputGroup className={`w-full transition-all duration-150 ${cn(showSearchInput ? 'max-w-[360px] opacity-100' : 'max-w-[0] w-0 opacity-0 hidden')}`} bg='zinc.800' rounded='full'>
                  <InputLeftElement pointerEvents='none'>
                    <MagnifyingGlass weight="bold" size={14} className="text-zinc-400" />
                  </InputLeftElement>
                  <Input type='text' onBlur={toggleShowSearchInput} ref={searchRef} placeholder='Search markets' onChange={(e) => debounceSearchInput(e.target.value)} pl={10} fontSize='sm' rounded='full' border="none" className={cn(
                    '!placeholder-zinc-600',
                    showSearchInput ? '!w-auto' : '!w-0 cursor-default'
                  )} />
                </InputGroup>
              </div>
              <Link href="/" className={"flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded-full z-20 " + cn(pathname === '/' ? 'border border-zinc-400' : '')}>
                <SquaresFour weight="fill" color="#A1A1AA" size={16} width={16} height={16} />
                <p className="text-base font-medium text-zinc-400">Markets</p>
              </Link>
              {isLoggedIn && (
                <>
                  <Link href="/profile?tabs=2" className={"flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded-full " + cn(pathname === '/leaderboards' ? 'border border-zinc-400' : '')}>
                    <Coins weight="fill" color="#A1A1AA" size={16} width={16} height={16} />
                    <p className="text-base font-medium text-zinc-400">Positions</p>
                  </Link>
                  {/* Will be used later */}
                  {/* <Link href="#" className={"flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded-full " + cn(pathname === '/leaderboards' ? 'border border-zinc-400' : '')}>
                    <Trophy weight="fill" color="#A1A1AA" size={16} width={16} height={16} />
                    <p className="text-base font-medium text-zinc-400">Leaderboards</p>
                  </Link> */}
                </>
              )}

            </div>
          </div>
          <div className="flex justify-end items-center w-1/3 gap-3 max-md:w-full mr-2.5 md:mr-0">
            {isLoggedIn && pageLoaded && (
              <>
                <button className="bg-zinc-800 rounded-xl h-10 w-10 relative flex justify-center items-center" onClick={doTest}>
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 rounded-full border-4 border-zinc-900"></span>
                  <BellSimple weight="bold" size={16} />
                </button>
                <div className="bg-zinc-800 rounded-full px-3 py-2 md:flex justify-center items-center hidden">
                  <p className="text-base font-medium bg-primary-gradient bg-clip-text text-transparent">200 SP</p>
                </div>
                <div className="bg-zinc-800 rounded-full px-3 py-2 flex justify-center items-center gap-2 cursor-pointer transition-transform duration-200 active:scale-95" onClick={() => setShowDynamicUserProfile(true)}>
                  {address && (
                    <CustomAvatar address={address} ensImage={ensImage} size={24} />
                  )}
                  <CaretDown weight="bold" size={16} />
                </div>
              </>
            )}
            {!isLoggedIn && pageLoaded && (
              <div id="connect-button" className="relative">
                <DynamicConnectButton buttonClassName="!bg-primary-gradient-2 rounded-full px-3 py-2">
                  <span className="w-full flex gap-2 items-center">
                    <Wallet weight="fill" size={14} />
                    <span className="text-base">
                      Connect Wallet
                    </span>
                  </span>
                </DynamicConnectButton>
              </div>
            )}
          </div>
          <div className="lg:hidden p-3 bg-white rounded-full" role="button" onClick={() => setShowMenuMobile(prev => !prev)} ref={btnMenuRef}>
            <List weight="bold" size={16} color="black" />
          </div>
        </div>
      </div>
      <div className={`absolute min-h-screen top-0 bottom-0 backdrop-blur-md left-0 right-0 z-50 lg:hidden ${cn(showMenuMobile ? 'max-md:block' : 'max-md:hidden')}`}>
        <div className="bg-zinc-950  flex flex-col gap-y-3 p-2 pb-8" ref={menuRef}>
          <InputGroup rounded={"full"} borderWidth={1} borderColor={"zinc.800"}>
            <InputLeftElement pointerEvents='none'>
              <MagnifyingGlass weight="bold" size={14} className="text-zinc-400" />
            </InputLeftElement>
            <Input rounded={"full"} borderWidth={1} borderColor={"zinc.800"} type='text' ref={searchRef} placeholder='Search markets' onChange={(e) => debounceSearchInput(e.target.value)} pl={10} fontSize='sm' border="none" className="!placeholder-zinc-600" />
          </InputGroup>
          {isLoggedIn && (
            <>
              <div className="rounded-[32px] p-5 w-full text-zinc-400 min-h-[100px] flex flex-col justify-between bg-gradient-to-r from-zinc-900 to-[#5a3427]">
                <div className="flex gap-2 items-center">
                  <p className="text-white text-sm">Satsouk Points</p>
                  <Info weight="fill" size={16} className="text-zinc-600" />
                </div>
                <p className="text-[22px] bg-primary-gradient bg-clip-text text-transparent w-fit justify-self-end">
                  200 SP
                </p>
              </div>
            </>
          )}
          <div className="w-full h-[1px] bg-zinc-800" />
          <Link href="/" className={"flex items-center gap-2 bg-zinc-800 p-3 rounded-full"}>
            <SquaresFour weight="fill" color="#A1A1AA" size={16} width={16} height={16} />
            <p className="text-base font-medium text-zinc-400">Markets</p>
          </Link>
          {isLoggedIn && (
            <>
              <Link href="/profile?tabs=2" className={"flex items-center gap-2 bg-zinc-800 p-3 rounded-full"}>
                <Coins weight="fill" color="#A1A1AA" size={16} width={16} height={16} />
                <p className="text-base font-medium text-zinc-400">Positions</p>
              </Link>
              {/* Will be used later */}
              {/* <Link href="#" className={"flex items-center gap-2 bg-zinc-800 p-3 rounded-full"}>
                <Trophy weight="fill" color="#A1A1AA" size={16} width={16} height={16} />
                <p className="text-base font-medium text-zinc-400">Leaderboards</p>
              </Link> */}
              <div className="w-full h-[1px] bg-zinc-800" />
              <div className={"flex items-center gap-2 bg-zinc-800 p-3 rounded-full cursor-pointer"} onClick={() => doLogout()}>
                <SignOut weight="bold" color="#A1A1AA" size={16} width={16} height={16} />
                <p className="text-base font-medium text-zinc-400">Disconnect</p>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar;