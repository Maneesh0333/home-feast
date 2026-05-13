type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  const getPages = () => {
    const pages: (number | "...")[] = [];

    const siblingCount = 1; // pages near current page
    const leftSibling = Math.max(page - siblingCount, 1);
    const rightSibling = Math.min(page + siblingCount, totalPages);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftRange = 1 + 2 * siblingCount + 1;

      for (let i = 1; i <= leftRange; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (showLeftDots && !showRightDots) {
      pages.push(1);
      pages.push("...");

      const rightRange = totalPages - (2 * siblingCount + 1);

      for (let i = rightRange; i <= totalPages; i++) pages.push(i);
    } else if (showLeftDots && showRightDots) {
      pages.push(1);
      pages.push("...");

      for (let i = leftSibling; i <= rightSibling; i++) pages.push(i);

      pages.push("...");
      pages.push(totalPages);
    } else {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    }

    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
      <span className="font-medium">
        Page {page} of {totalPages}
      </span>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={i} className="px-2">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 rounded-md border transition cursor-pointer ${
                p === page
                  ? "bg-[#1A3C6B] border text-white"
                  : "bg-foreground/50 text-background/60 border hover:bg-foreground/70"
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 rounded-md border bg-card hover:bg-card/60 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Prev
        </button>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages || totalPages === 0}
          className="px-3 py-1 rounded-md border bg-card hover:bg-card/60 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}