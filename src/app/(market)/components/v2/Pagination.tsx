'use client'

import { ArrowLeft, ArrowRight, CaretDoubleLeft, CaretDoubleRight } from "@phosphor-icons/react";
import { useMemo } from "react";

interface IPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: IPaginationProps) => {

  const pageItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = [];
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adjust the start and end for edge cases
    if (currentPage <= 3) {
      endPage = 5;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - 4;
    }

    // Always show the first page
    pages.push(1);

    // Show ellipsis if startPage is greater than 2
    if (startPage > 2) {
      pages.push("...");
    }

    // Push the visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Show ellipsis if endPage is less than totalPages - 1
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    // Always show the last page
    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  const firstPageClick = () => {
    onPageChange(1);
  }

  const lastPageClick = () => {
    onPageChange(totalPages);
  }

  const prevPageClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }

  const nextPageClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }

  return (
    <div className="bg-zinc-900 p-3 rounded-full flex justify-between items-center">
      <div className="flex gap-x-1">
        <button className="w-10 h-10 flex flex-col justify-center items-center rounded-full bg-zinc-800" onClick={() => firstPageClick()}>
          <CaretDoubleLeft width={11.5} />
        </button>
        <button className="w-10 h-10 flex flex-col justify-center items-center rounded-full bg-zinc-800" onClick={() => prevPageClick()}>
          <ArrowLeft width={11.5} />
        </button>
      </div>
      <p className="block md:hidden">{currentPage} of {totalPages}</p>
      <div className="hidden md:flex gap-x-1">
        {pageItems?.map((item, index) => {
          return (
            <button
              key={index}
              className={`w-10 h-10 text-sm font-medium flex flex-col justify-center items-center rounded-full ${currentPage === item ? 'bg-white text-zinc-900' : 'bg-zinc-800 text-zinc-400'}`}
              onClick={() => typeof item === 'number' ? onPageChange(item) : {}}
              disabled={typeof item !== 'number'}
            >
              {item}
            </button>
          )
        })}
      </div>
      <div className="flex gap-x-1">
        <button className="w-10 h-10 flex flex-col justify-center items-center rounded-full bg-zinc-800" onClick={() => nextPageClick()}>
          <ArrowRight width={11.5} />
        </button>
        <button className="w-10 h-10 flex flex-col justify-center items-center rounded-full bg-zinc-800" onClick={() => lastPageClick()}>
          <CaretDoubleRight width={11.5} />
        </button>
      </div>
    </div >
  )
}

export default Pagination;
