'use client';

import { cn } from "@/utils/cn";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { BellSimple, CaretDown, List, MagnifyingGlass, SquaresFour, Trophy, Wallet } from "@phosphor-icons/react/dist/ssr";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from 'use-debounce';
import { useAccount } from "wagmi";
import "@/styles/navbar.css";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState<string | null>(null);
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  const pathname = usePathname()
  const searchRef = useRef<HTMLInputElement>(null)
  const { address } = useAccount()
  const [showMenuMobile, setShowMenuMobile] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  return (
    <nav className="relative">
      <div className="fixed w-full h-[74px] bg-black z-10 flex justify-center inset-0">
        <div className="w-full h-full max-w-[1238px] py-4 px-3 flex justify-between items-center">
          <div className="flex w-2/3 gap-4 max-md:flex-col max-md:w-fit">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <Image
                src='/images/logo-white-colorful.png'
                alt="Satsouk Logo"
                className="max-md:hidden"
                width={168}
                height={32}
              />
              <Image
                src='/images/satsouk-logo.svg'
                alt="Satsouk Logo"
                className="max-md:block lg:hidden"
                width={40}
                height={32}
              />
              <span className="bg-zinc-800 text-xs font-bold leading-4 py-[2px] px-[6px] rounded-[100px] w-fit max-md:hidden">
                <span className="bg-primary-gradient bg-clip-text text-transparent">APP</span>
              </span>
            </Link>
            <div className="flex items-center gap-2 w-fit max-md:hidden">
              <div className={`p-3 bg-zinc-800 rounded-full transition-all duration-150 ${cn(showSearchInput ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto')}`} role="button" onClick={toggleShowSearchInput}>
                <MagnifyingGlass weight="bold" size={14} className="text-zinc-400" />
              </div>
              <InputGroup className={`w-full transition-all duration-150 ${cn(showSearchInput ? 'max-w-[360px] opacity-100' : 'max-w-[0] opacity-0 hidden')}`} bg='zinc.800' rounded='xl'>
                <InputLeftElement pointerEvents='none'>
                  <MagnifyingGlass weight="bold" size={14} className="text-zinc-400" />
                </InputLeftElement>
                <Input type='text' onBlur={toggleShowSearchInput} ref={searchRef} placeholder='Search markets' onChange={(e) => debounceSearchInput(e.target.value)} pl={10} fontSize='sm' rounded='xl' border="none" className="!placeholder-zinc-600" />
              </InputGroup>
              <Link href="/" className={"flex items-center gap-2 bg-zinc-800 p-3 rounded-full " + cn(pathname === '/' ? 'border border-zinc-400' : '')}>
                <SquaresFour weight="fill" color="#A1A1AA" size={16} width={16} height={16} />
                <p className="text-base font-medium text-zinc-400">Markets</p>
              </Link>
              <Link href="/" className={"flex items-center gap-2 bg-zinc-800 p-3 rounded-full " + cn(pathname === '/leaderboards' ? 'border border-zinc-400' : '')}>
                <Trophy weight="fill" color="#A1A1AA" size={16} width={16} height={16} />
                <p className="text-base font-medium text-zinc-400">Leaderboards</p>
              </Link>
            </div>
          </div>
          <div className="flex justify-end items-center w-1/3 gap-3 max-md:w-full max-md:justify-center">
            {address && (
              <button className="bg-zinc-800 rounded-xl h-10 w-10 relative flex justify-center items-center">
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 rounded-full border-4 border-zinc-900"></span>
                <BellSimple weight="bold" size={16} />
              </button>
            )}
            <div id="connect-button" className="relative">
              <Wallet weight="fill" size={16} color="#FFFFFF" className="absolute top-[50%] left-3 z-50 -translate-y-1/2" />
              <ConnectButton />
            </div>
            {/* <button className="bg-zinc-800 rounded-xl flex items-center h-10 py-1 px-3 gap-3">
              <div className="flex gap-2 items-center">
                <Image
                  src='https://s3-alpha-sig.figma.com/img/66ff/f14b/a710b7b4b6638897ce10f65e5bae131b?Expires=1724025600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ha8GPCnghuDVG-iwQQIv4at8YPzNXBwelFB0dHgsFQKiquSrRQG4f-ZifpJIgjOgd8TpSAsGkDbSrbhwl-LrxsYMG0olCHd5ByRgCQDTyMqkNOU4Rq3Ap3px7o3t7hSyb9VqfeEFd7~f0G9AE5CvArsqMRjLCkQmK8-~kiJGEnkCJ0JrvWUC5jkVZdyIocB-5Aj12~duFQZLouShTNABgTdPsqaRt5AhPfF4ZzHzkjYkOhOrwj7zAXQLPRT0Wjjw8XCHGZrFIGOw3QEcXMHpJrXQZfM1r67LW9S63jhMqaHBI1UomULrRs8k3NSDTZrSC7So6ogp7Ns0CI9kSXy1ZQ__'
                  alt="user avatar"
                  height={200}
                  width={200}
                  style={{ width: '20px', height: '20px' }}
                  className="rounded-full"
                />
                <p className="text-xs font-medium">Ox51ea...8D35</p>
              </div>
              <CaretDown weight="bold" size={16} />
            </button> */}
          </div>
          <div className="lg:hidden p-3 bg-white rounded-full" role="button" onClick={() => setShowMenuMobile(prev => !prev)}>
            <List weight="bold" size={16} color="black" />
          </div>
        </div>
      </div>
      <div className={`absolute min-h-screen top-0 bottom-0 backdrop-blur-md left-0 right-0 z-50 lg:hidden ${cn(showMenuMobile ? 'max-md:block' : 'max-md:hidden')}`}>
        <div className="bg-zinc-950  flex flex-col gap-y-3 p-2" ref={menuRef}>
          <InputGroup rounded={"full"} borderWidth={1} borderColor={"zinc.800"}>
            <InputLeftElement pointerEvents='none'>
              <MagnifyingGlass weight="bold" size={14} className="text-zinc-400" />
            </InputLeftElement>
            <Input rounded={"full"} borderWidth={1} borderColor={"zinc.800"} type='text' ref={searchRef} placeholder='Search markets' onChange={(e) => debounceSearchInput(e.target.value)} pl={10} fontSize='sm' rounded='xl' border="none" className="!placeholder-zinc-600" />
          </InputGroup>
          <div className="w-full h-[1px] bg-zinc-800" />
          <Link href="/" className={"flex items-center gap-2 bg-zinc-800 p-3 rounded-full"} onClick={() => setShowMenuMobile(prev => !prev)}>
            <SquaresFour weight="fill" color="#A1A1AA" size={16} width={16} height={16} />
            <p className="text-base font-medium text-zinc-400">Markets</p>
          </Link>
          <Link href="/" className={"flex items-center gap-2 bg-zinc-800 p-3 rounded-full"} onClick={() => setShowMenuMobile(prev => !prev)}>
            <Trophy weight="fill" color="#A1A1AA" size={16} width={16} height={16} />
            <p className="text-base font-medium text-zinc-400">Leaderboards</p>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;