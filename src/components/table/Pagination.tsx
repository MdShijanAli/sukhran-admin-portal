import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { StoreWithData } from "./BaseTableList";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  showItemCount?: boolean;
  store?: StoreWithData<T>;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  showItemCount = true,
  store,
}: PaginationProps) {
  const { t } = useTranslation();
  const [jumpToPage, setJumpToPage] = useState("");
  const [currentPageState, setCurrentPageState] = useState(currentPage || 1);

  useEffect(() => {
    store?.setPagination({
      ...store.pagination,
      current_page: currentPageState,
    });
  }, [currentPageState]);

  const startItem =
    totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem =
    totalItems && itemsPerPage
      ? Math.min(currentPage * itemsPerPage, totalItems)
      : 0;

  const handleShowItemsPerPage = (perPage: number) => {
    store?.setPagination({
      ...store.pagination,
      per_page: perPage,
      current_page: 1,
    });
  };

  const handleJumpInputChange = (value: string) => {
    // Only allow numbers
    if (value === "" || /^[0-9]+$/.test(value)) {
      const num = parseInt(value);
      // Validate range
      if (value === "" || (num >= 1 && num <= totalPages)) {
        setJumpToPage(value);
      }
    }
  };

  // Auto-jump to page with debounce
  useEffect(() => {
    if (!jumpToPage || jumpToPage === "") return;

    const timer = setTimeout(() => {
      let pageNum = parseInt(jumpToPage);

      // Adjust page number if out of bounds
      if (pageNum > totalPages) {
        pageNum = totalPages;
      } else if (pageNum < 1) {
        pageNum = 1;
      }

      setCurrentPageState(pageNum);
      setJumpToPage("");
    }, 800);

    return () => clearTimeout(timer);
  }, [jumpToPage, totalPages]);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      // Show all pages if total is 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination logic
      if (currentPage <= 3) {
        // Show first 3 pages, ellipsis, and last 2 pages
        pages.push(1, 2, 3, "...", totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first 2 pages, ellipsis, and last 3 pages
        pages.push(1, 2, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Show first page, ellipsis, current page with neighbors, ellipsis, last 2 pages
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages - 1,
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
      <div className="flex items-center gap-4">
        {showItemCount &&
        totalItems !== undefined &&
        itemsPerPage !== undefined ? (
          <div className="text-sm text-muted-foreground">
            {t("pagination.showing")} {startItem} {t("pagination.of")} {endItem}{" "}
            {t("pagination.of")} {totalItems} {t("pagination.results")}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            {t("pagination.page")} {currentPage} {t("pagination.of")}{" "}
            {totalPages}
          </div>
        )}

        {totalItems > itemsPerPage && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <select
              value={itemsPerPage || 20}
              onChange={(e) => handleShowItemsPerPage(parseInt(e.target.value))}
              className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPageState(1)}
          disabled={currentPage <= 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPageState(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-muted-foreground"
                >
                  ...
                </span>
              );
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPageState(page as number)}
                className="min-w-[2.5rem]"
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPageState(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPageState(totalPages)}
          disabled={currentPage >= totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 ml-2">
          <span className="text-sm text-muted-foreground">Go to:</span>
          <input
            type="number"
            value={jumpToPage || currentPage}
            onChange={(e) => handleJumpInputChange(e.target.value)}
            onFocus={(e) => e.target.select()}
            placeholder="#"
            className="h-8 w-16 rounded-md border border-input bg-background px-3 py-1 text-sm text-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>
    </div>
  );
}
