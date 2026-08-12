import { motion } from 'framer-motion';
import { Eye, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { EventItem } from '@/types';
import { categoryMap } from '@/data/categories';
import { useApp } from '@/store/AppContext';
import { CategoryIcon } from '@/components/common/CategoryIcon';
import { Badge } from '@/components/common/Badge';
import { EventImage } from './EventImage';
import { SaveButton } from './SaveButton';
import { ShareMenu } from './ShareMenu';
import { clock, compact, dayNum, monthShort, priceRange, relativeDay } from '@/utils/format';
import { cn } from '@/utils/cn';

interface Props {
  event: EventItem;
  onQuickView?: (event: EventItem) => void;
  layout?: 'grid' | 'row';
  className?: string;
}

export const EventCard = ({ event, onQuickView, layout = 'grid', className }: Props) => {
  const { venueOf, isInterested } = useApp();
  const venue = venueOf(event);
  const cat = categoryMap[event.category];
  const price = priceRange(event.tiers.map((t) => t.price));
  const interested = event.interested + (isInterested(event.id) ? 1 : 0);

  if (layout === 'row') {
    return (
      <Link
        to={`/events/${event.id}`}
        className={cn('group flex gap-4 rounded-2xl border border-line bg-surface p-3 transition-colors hover:border-green/40', className)}
      >
        <EventImage
          src={event.image}
          alt={event.title}
          category={event.category}
          className="h-24 w-24 shrink-0 rounded-xl sm:h-28 sm:w-32"
        />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] uppercase tracking-wider text-magenta">
            {relativeDay(event.start)} · {clock(event.start)}
          </p>
          <h3 className="mt-1 truncate font-display text-base font-bold">{event.title}</h3>
          <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {venue?.name} · {venue?.area}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span className="font-display text-sm font-bold">{price}</span>
            <span className="text-xs text-muted">{compact(interested)} interested</span>
          </div>
        </div>
        <div className="self-center">
          <SaveButton eventId={event.id} variant="icon" className="border-line bg-raised text-muted hover:text-fg" />
        </div>
      </Link>
    );
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={cn('group card overflow-hidden transition-shadow hover:shadow-lift', className)}
    >
      <Link to={`/events/${event.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <EventImage
            src={event.image}
            alt={event.title}
            category={event.category}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

          <div className="absolute left-2 top-2 flex flex-wrap items-center gap-1 sm:left-3 sm:top-3 sm:gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-ink/55 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider text-white backdrop-blur sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-[10px]">
              <CategoryIcon id={event.category} className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              {cat?.name}
            </span>
            {event.trending && (
              <span className="rounded-full bg-gradient-to-r from-magenta to-ember px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider text-white sm:px-2.5 sm:py-1 sm:text-[10px]">
                Trending
              </span>
            )}
          </div>

          <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
            <SaveButton eventId={event.id} />
          </div>

          <div className="absolute bottom-2 left-2 flex items-end gap-1.5 sm:bottom-3 sm:left-3 sm:gap-3">
            <div className="flex h-9 w-9 flex-col items-center justify-center rounded-lg bg-surface/95 shadow sm:h-12 sm:w-12 sm:rounded-xl">
              <span className="font-mono text-[7px] uppercase tracking-wider text-magenta sm:text-[9px]">
                {monthShort(event.start)}
              </span>
              <span className="font-display text-sm font-extrabold leading-none sm:text-lg">{dayNum(event.start)}</span>
            </div>
            <p className="pb-1 font-mono text-[9px] uppercase tracking-wider text-white/90 sm:text-[11px]">
              {relativeDay(event.start)} · {clock(event.start)}
            </p>
          </div>
        </div>

        <div className="p-2.5 sm:p-4">
          <h3 className="line-clamp-2 font-display text-sm font-bold leading-snug sm:text-[17px]">{event.title}</h3>
          <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-muted sm:mt-1.5 sm:gap-1.5 sm:text-xs">
            <MapPin className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
            <span className="truncate">{venue?.name}</span>
            <span className="shrink-0">· {venue?.area}</span>
          </p>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-2 border-t border-line px-2.5 py-2.5 sm:px-4 sm:py-3">
        <div>
          <p className="font-display text-sm font-extrabold sm:text-base">{price}</p>
          <p className="flex items-center gap-1 text-[10px] text-muted sm:text-[11px]">
            <Users className="h-3 w-3" /> {compact(interested)} interested
          </p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onQuickView && (
            <button
              onClick={() => onQuickView(event)}
              aria-label={`Quick view of ${event.title}`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:text-fg sm:h-9 sm:w-9"
            >
              <Eye className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
            </button>
          )}
          <ShareMenu title={event.title} path={`/events/${event.id}`} />
        </div>
      </div>
    </motion.article>
  );
};

export const FeaturedEventCard = ({ event }: { event: EventItem }) => {
  const { venueOf } = useApp();
  const venue = venueOf(event);
  return (
    <Link
      to={`/events/${event.id}`}
      className="group relative flex h-full min-h-[320px] overflow-hidden rounded-2xl border border-line"
    >
      <EventImage
        src={event.image}
        alt={event.title}
        category={event.category}
        eager
        className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
      <div className="relative mt-auto p-5 sm:p-6">
        <Badge tone="brand" className="border-white/20 bg-white/15 text-white">
          Featured
        </Badge>
        <h3 className="mt-3 font-display text-2xl font-extrabold text-white sm:text-3xl">{event.title}</h3>
        <p className="mt-2 line-clamp-2 max-w-md text-sm text-white/75">{event.summary}</p>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-white/70">
          {relativeDay(event.start)} · {clock(event.start)} · {venue?.area}
        </p>
      </div>
    </Link>
  );
};
