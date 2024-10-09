'use client'

import { ArrowLeft, ArrowRight, CaretDoubleLeft, CaretDoubleRight } from "@phosphor-icons/react";
import { useMemo } from "react";

interface IPaginationProps {
  totalPage: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
  isMobile?: boolean;
  onBack?: (currentPage: number) => void;
  onNext?: (currentPage: number) => void;
  onLastPage?: () => void;
  onFirstPage?: () => void;
}

const Pagination = ({
  currentPage = 0,
  totalPage = 15,
  onPageChange,
  isMobile,
  onBack,
  onNext,
  onFirstPage,
  onLastPage
}: IPaginationProps) => {
  const generatePages = useMemo(() => {
    if (totalPage <= 5) {
      return Array.from({ length: totalPage }, (_, idx) => idx + 1);
    }

    let first = currentPage;
    let second = currentPage + 1;
    let third = currentPage + 2;

    if (third >= totalPage - 2) {
      first = totalPage - 4;
      second = totalPage - 3;
      third = totalPage - 2;
    } else if (first < 1) {
      first = 1;
      second = 2;
      third = 3;
    }

    if (totalPage <= 6) {
      return Array.from({ length: totalPage }, (_, idx) => idx + 1);
    }

    if (totalPage % 2 === 1) {
      return [
        first,
        second,
        ...(third + 2 >= totalPage ? [] : ['...']),
        totalPage - 2,
        totalPage - 1,
        totalPage
      ];
    } else {
      return [
        first,
        second,
        third,
        ...(third + 2 >= totalPage ? [] : ['...']),
        totalPage - 2,
        totalPage - 1,
        totalPage
      ];
    }
  }, [currentPage, totalPage, isMobile]);

  return (
    <div className="bg-zinc-900 p-3 rounded-full flex justify-between items-center">
      <div className="flex gap-x-1">
        {!isMobile && (
          <button className="w-10 h-10 flex flex-col justify-center items-center rounded-full bg-zinc-800" onClick={onFirstPage}>
            <CaretDoubleLeft width={11.5} />
          </button>
        )}
        <button className="w-10 h-10 flex flex-col justify-center items-center rounded-full bg-zinc-800" onClick={() => onBack && onBack(currentPage)}>
          <ArrowLeft width={11.5} />
        </button>
      </div>
      <div className="flex gap-x-1">
        {generatePages.map((page, index) => (
          <button
            key={index}
            className={`${typeof page === 'string' ? isMobile ? 'w-10' : 'w-20' : 'w-10'} h-10 text-sm font-medium flex flex-col justify-center items-center rounded-full ${currentPage === page ? 'bg-white text-zinc-900' : 'bg-zinc-800 text-zinc-400'}`}
            onClick={() => typeof page === 'number' && onPageChange && onPageChange(page)}
            disabled={typeof page !== 'number'}
          >
            {page}
          </button>
        ))}
      </div>
      <div className="flex gap-x-1">
        <button className="w-10 h-10 flex flex-col justify-center items-center rounded-full bg-zinc-800" onClick={() => onNext && onNext(currentPage)}>
          <ArrowRight width={11.5} />
        </button>
        {!isMobile && (
          <button className="w-10 h-10 flex flex-col justify-center items-center rounded-full bg-zinc-800" onClick={onLastPage}>
            <CaretDoubleRight width={11.5} />
          </button>
        )}
      </div>
    </div>
  )
}

export default Pagination;
