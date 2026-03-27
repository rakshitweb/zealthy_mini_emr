"use client";

import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
};

export const Pagination = ({ page, totalPages }: PaginationProps) => {
  return (
    <div className="flex items-center justify-end gap-4 mt-4 text-sm">
      <span className="text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Link
        href={`?page=${page - 1}`}
        className={page <= 1 ? "pointer-events-none opacity-40" : ""}
        aria-disabled={page <= 1}
      >
        Previous
      </Link>
      <Link
        href={`?page=${page + 1}`}
        className={page >= totalPages ? "pointer-events-none opacity-40" : ""}
        aria-disabled={page >= totalPages}
      >
        Next
      </Link>
    </div>
  );
};
