import { SlidersHorizontal, X } from 'lucide-react';
import type { EventFilters } from '@/types';
import { categories } from '@/data/categories';
import { areas } from '@/data/cities';
import { Select, Toggle } from '@/components/common/Field';
import { Button } from '@/components/common/Button';
import { defaultFilters } from '@/hooks/useEventFilters';
import { cedis } from '@/utils/format';

interface Props {
  filters: EventFilters;
  onChange: (patch: Partial<EventFilters>) => void;
  onReset: () => void;
  compact?: boolean;
}

export const FilterPanel = ({ filters, onChange, onReset, compact }: Props) => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <h2 className="flex items-center gap-2 font-display text-base font-bold">
        <SlidersHorizontal className="h-4 w-4 text-green" /> Filters
      </h2>
      <button onClick={onReset} className="text-xs font-semibold text-muted hover:text-fg">
        Reset
      </button>
    </div>

    <Select
      label="Category"
      value={filters.category}
      onChange={(e) => onChange({ category: e.target.value as EventFilters['category'] })}
    >
      <option value="all">All categories</option>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </Select>

    <Select label="When" value={filters.when} onChange={(e) => onChange({ when: e.target.value as EventFilters['when'] })}>
      <option value="any">Any date</option>
      <option value="today">Today</option>
      <option value="tomorrow">Tomorrow</option>
      <option value="weekend">This weekend</option>
      <option value="week">Next 7 days</option>
      <option value="month">Next 30 days</option>
    </Select>

    <Select label="Area" value={filters.area} onChange={(e) => onChange({ area: e.target.value })}>
      <option value="all">Anywhere in the city</option>
      {areas.map((a) => (
        <option key={a} value={a}>
          {a}
        </option>
      ))}
    </Select>

    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor="price" className="text-sm font-semibold">
          Max price
        </label>
        <span className="font-mono text-xs text-muted">{cedis(filters.maxPrice)}</span>
      </div>
      <input
        id="price"
        type="range"
        min={0}
        max={1000}
        step={20}
        value={filters.maxPrice}
        onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
        className="w-full accent-magenta"
      />
    </div>

    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor="distance" className="text-sm font-semibold">
          Distance
        </label>
        <span className="font-mono text-xs text-muted">
          {filters.maxDistance >= 50 ? 'Any' : `${filters.maxDistance} km`}
        </span>
      </div>
      <input
        id="distance"
        type="range"
        min={2}
        max={50}
        step={2}
        value={filters.maxDistance}
        onChange={(e) => onChange({ maxDistance: Number(e.target.value) })}
        className="w-full accent-green"
      />
    </div>

    <Toggle checked={filters.freeOnly} onChange={(v) => onChange({ freeOnly: v })} label="Free events only" />

    {!compact && (
      <Select label="Sort by" value={filters.sort} onChange={(e) => onChange({ sort: e.target.value as EventFilters['sort'] })}>
        <option value="recommended">Recommended</option>
        <option value="popular">Most popular</option>
        <option value="newest">Newest</option>
        <option value="closest">Closest to me</option>
        <option value="price-asc">Price: low to high</option>
      </Select>
    )}
  </div>
);

export const activeFilterCount = (f: EventFilters) =>
  [
    f.category !== defaultFilters.category,
    f.area !== defaultFilters.area,
    f.when !== defaultFilters.when,
    f.freeOnly,
    f.maxPrice !== defaultFilters.maxPrice,
    f.maxDistance !== defaultFilters.maxDistance,
  ].filter(Boolean).length;

export const FilterChips = ({
  filters,
  onChange,
}: {
  filters: EventFilters;
  onChange: (patch: Partial<EventFilters>) => void;
}) => {
  const chips: { label: string; clear: Partial<EventFilters> }[] = [];
  if (filters.category !== 'all') chips.push({ label: categories.find((c) => c.id === filters.category)?.name ?? '', clear: { category: 'all' } });
  if (filters.area !== 'all') chips.push({ label: filters.area, clear: { area: 'all' } });
  if (filters.when !== 'any') chips.push({ label: filters.when, clear: { when: 'any' } });
  if (filters.freeOnly) chips.push({ label: 'Free only', clear: { freeOnly: false } });
  if (filters.maxPrice !== defaultFilters.maxPrice) chips.push({ label: `Under ${cedis(filters.maxPrice)}`, clear: { maxPrice: defaultFilters.maxPrice } });

  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.label}
          onClick={() => onChange(chip.clear)}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold capitalize hover:border-magenta/50"
        >
          {chip.label}
          <X className="h-3 w-3" />
        </button>
      ))}
    </div>
  );
};

export const CategoryRail = ({
  active,
  onSelect,
}: {
  active: EventFilters['category'];
  onSelect: (id: EventFilters['category']) => void;
}) => (
  <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
    <Button
      size="sm"
      variant={active === 'all' ? 'secondary' : 'outline'}
      onClick={() => onSelect('all')}
      className="shrink-0"
    >
      All
    </Button>
    {categories.map((c) => (
      <Button
        key={c.id}
        size="sm"
        variant={active === c.id ? 'secondary' : 'outline'}
        onClick={() => onSelect(c.id)}
        className="shrink-0"
      >
        {c.name}
      </Button>
    ))}
  </div>
);
