import { cn } from '@/utils/cn';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export const Tabs = ({
  items,
  active,
  onChange,
  className,
}: {
  items: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}) => (
  <div className={cn('no-scrollbar -mx-1 flex gap-1 overflow-x-auto border-b border-line', className)} role="tablist">
    {items.map((item) => {
      const isActive = item.id === active;
      return (
        <button
          key={item.id}
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(item.id)}
          className={cn(
            'relative whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors',
            isActive ? 'text-fg' : 'text-muted hover:text-fg',
          )}
        >
          {item.label}
          {typeof item.count === 'number' && (
            <span className="ml-1.5 rounded-full bg-raised px-1.5 py-0.5 font-mono text-[10px] text-muted">
              {item.count}
            </span>
          )}
          {isActive && <span className="absolute inset-x-2 -bottom-px h-[3px] rounded-full bg-horizon" />}
        </button>
      );
    })}
  </div>
);
