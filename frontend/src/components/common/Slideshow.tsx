import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SlidePageSizes {
  base: number;
  sm: number;
  lg: number;
}

const pageSizeForWidth = (w: number, sizes: SlidePageSizes) => (w >= 1024 ? sizes.lg : w >= 640 ? sizes.sm : sizes.base);

const usePageSize = (sizes: SlidePageSizes) => {
  const [size, setSize] = useState(() =>
    pageSizeForWidth(typeof window === 'undefined' ? 1024 : window.innerWidth, sizes),
  );
  useEffect(() => {
    const onResize = () => setSize(pageSizeForWidth(window.innerWidth, sizes));
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizes.base, sizes.sm, sizes.lg]);
  return size;
};

// A responsive, autoplaying carousel that pages through `items` in full rows —
// the row size tracks the same breakpoints as `gridClassName` so a slide is
// always a complete row, on mobile included (never a ragged wrapped grid).
export function Slideshow<T>({
  items,
  renderItem,
  gridClassName,
  pageSizes = { base: 2, sm: 3, lg: 5 },
  autoplayMs = 5000,
}: {
  items: T[];
  renderItem: (item: T) => ReactNode;
  gridClassName: string;
  pageSizes?: SlidePageSizes;
  autoplayMs?: number;
}) {
  const pageSize = usePageSize(pageSizes);
  const pages = useMemo(() => {
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += pageSize) chunks.push(items.slice(i, i + pageSize));
    return chunks;
  }, [items, pageSize]);

  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (page > pages.length - 1) setPage(0);
  }, [pages.length, page]);

  const go = (next: number) => {
    setDir(next > page || (page === pages.length - 1 && next === 0) ? 1 : -1);
    setPage((next + pages.length) % pages.length);
  };

  useEffect(() => {
    if (pages.length <= 1 || paused) return;
    timer.current = setInterval(() => {
      setDir(1);
      setPage((p) => (p + 1) % pages.length);
    }, autoplayMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [pages.length, paused, autoplayMs]);

  if (pages.length === 0) return null;
  const current = pages[Math.min(page, pages.length - 1)];

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={page}
            custom={dir}
            initial={{ x: dir > 0 ? 40 : -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir > 0 ? -40 : 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className={gridClassName}
          >
            {current.map(renderItem)}
          </motion.div>
        </AnimatePresence>
      </div>

      {pages.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(page - 1)}
            aria-label="Previous"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-green/40 hover:text-fg"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {pages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === page ? 'w-6 bg-fg' : 'w-1.5 bg-line hover:bg-muted',
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(page + 1)}
            aria-label="Next"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-green/40 hover:text-fg"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
