import { BadgeCheck, CalendarDays, Clock, Info, MapPin, Share2, Ticket, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { EventItem, Organizer, Venue } from '@/types';
import { categoryMap } from '@/data/categories';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { EventImage } from './EventImage';
import { SaveButton } from './SaveButton';
import { ShareMenu } from './ShareMenu';
import { EventMap } from './EventMap';
import { useApp } from '@/store/AppContext';
import { cedis, clock, compact, longDay, priceRange } from '@/utils/format';
import { cn } from '@/utils/cn';

interface Props {
  event: EventItem;
  venue?: Venue;
  organizer?: Organizer;
  preview?: boolean;
}

export const EventDetailView = ({ event, venue, organizer, preview }: Props) => {
  const { isInterested, toggleInterested, followingIds, toggleFollow } = useApp();
  const cat = categoryMap[event.category];
  const interested = event.interested + (isInterested(event.id) ? 1 : 0);
  const soldOut = event.tiers.every((t) => t.sold >= t.quantity);
  const cancelled = event.status === 'cancelled';
  const following = organizer ? followingIds.includes(organizer.id) : false;

  return (
    <article>
      {/* Hero */}
      <div className="relative h-[300px] w-full overflow-hidden sm:h-[420px]">
        <EventImage src={event.image} alt={event.title} category={event.category} eager className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
        <div className="shell absolute inset-x-0 bottom-0 pb-7">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand" className="border-white/20 bg-white/15 text-white">
              {cat?.name}
            </Badge>
            {event.trending && (
              <Badge className="border-transparent bg-gradient-to-r from-magenta to-ember text-white">Trending</Badge>
            )}
            {cancelled && <Badge tone="danger">Cancelled</Badge>}
          </div>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-extrabold text-white sm:text-5xl">
            {event.title}
          </h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-[11px] uppercase tracking-wider text-white/80">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> {longDay(event.start)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {clock(event.start)} – {clock(event.end)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {venue?.name}, {venue?.area}
            </span>
          </p>
        </div>
      </div>

      <div className="shell grid gap-8 py-8 lg:grid-cols-[1fr_360px] lg:py-12">
        <div className="min-w-0 space-y-10">
          <section>
            <h2 className="font-display text-xl font-bold">About this event</h2>
            <div className="horizon-rule mt-3" />
            <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-muted">{event.description}</p>
            {event.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {event.tags.map((t) => (
                  <span key={t} className="rounded-full bg-raised px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </section>

          {event.schedule.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold">Schedule</h2>
              <div className="horizon-rule mt-3" />
              <ol className="mt-5 space-y-0">
                {event.schedule.map((item, i) => (
                  <li key={`${item.time}-${i}`} className="relative flex gap-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-green" />
                      {i < event.schedule.length - 1 && <span className="mt-1 w-px flex-1 bg-line" />}
                    </div>
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-magenta">{item.time}</p>
                      <p className="mt-0.5 font-semibold">{item.title}</p>
                      {item.detail && <p className="mt-0.5 text-sm text-muted">{item.detail}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section>
            <h2 className="font-display text-xl font-bold">Important information</h2>
            <div className="horizon-rule mt-3" />
            <ul className="mt-4 space-y-2.5">
              {event.info.map((line) => (
                <li key={line} className="flex gap-3 text-sm text-muted">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                  {line}
                </li>
              ))}
            </ul>
          </section>

          {venue && (
            <section>
              <h2 className="font-display text-xl font-bold">Getting there</h2>
              <div className="horizon-rule mt-3" />
              <div className="mt-4 overflow-hidden rounded-2xl border border-line">
                <EventMap
                  events={[event]}
                  venueMap={{ [venue.id]: venue }}
                  center={[venue.lat, venue.lng]}
                  zoom={15}
                  className="h-[280px] w-full"
                />
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface p-4">
                  <div>
                    <p className="font-semibold">{venue.name}</p>
                    <p className="text-sm text-muted">
                      {venue.address} · {venue.area}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    href={`https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`}
                    icon={<MapPin className="h-4 w-4" />}
                  >
                    Directions
                  </Button>
                </div>
              </div>
            </section>
          )}

          {organizer && (
            <section>
              <h2 className="font-display text-xl font-bold">Organized by</h2>
              <div className="horizon-rule mt-3" />
              <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center">
                <Avatar name={organizer.name} src={organizer.avatar} size="lg" />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/organizers/${organizer.id}`}
                    className="flex items-center gap-1.5 font-display text-lg font-bold hover:underline"
                  >
                    {organizer.name}
                    {organizer.verified && <BadgeCheck className="h-4 w-4 text-green" />}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{organizer.bio}</p>
                  <p className="mt-2 flex gap-4 font-mono text-[11px] uppercase tracking-wider text-muted">
                    <span>{organizer.eventsHosted} events hosted</span>
                    <span>{compact(organizer.followers)} followers</span>
                  </p>
                </div>
                {!preview && (
                  <Button
                    variant={following ? 'outline' : 'primary'}
                    onClick={() => toggleFollow(organizer.id)}
                    className="sm:self-center"
                  >
                    {following ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Ticket rail */}
        <aside>
          <div className="lg:sticky lg:top-24">
            <div className="card overflow-hidden">
              <div className="border-b border-line p-5">
                <p className="eyebrow">From</p>
                <p className="mt-1 font-display text-3xl font-extrabold">
                  {priceRange(event.tiers.map((t) => t.price))}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                  <Users className="h-4 w-4" /> {compact(interested)} people interested
                </p>
              </div>

              <ul className="divide-y divide-line">
                {event.tiers.map((tier) => {
                  const left = tier.quantity - tier.sold;
                  return (
                    <li key={tier.id} className="flex items-center justify-between gap-3 p-4">
                      <div>
                        <p className="font-semibold">{tier.name}</p>
                        <p className={cn('font-mono text-[11px] uppercase tracking-wider', left <= 20 ? 'text-magenta' : 'text-muted')}>
                          {left <= 0 ? 'Sold out' : left <= 20 ? `Only ${left} left` : `${compact(left)} available`}
                        </p>
                      </div>
                      <p className="font-display font-bold">{cedis(tier.price)}</p>
                    </li>
                  );
                })}
              </ul>

              <div className="space-y-2.5 p-4">
                <Button
                  full
                  size="lg"
                  to={preview || cancelled || soldOut ? undefined : `/checkout/${event.id}`}
                  disabled={preview || cancelled || soldOut}
                  icon={<Ticket className="h-4 w-4" />}
                >
                  {cancelled ? 'Event cancelled' : soldOut ? 'Sold out' : 'Get tickets'}
                </Button>
                <div className="grid grid-cols-2 gap-2.5">
                  <Button
                    variant={isInterested(event.id) ? 'secondary' : 'outline'}
                    onClick={() => !preview && toggleInterested(event.id)}
                    disabled={preview}
                  >
                    {isInterested(event.id) ? 'Interested ✓' : 'Interested'}
                  </Button>
                  {preview ? (
                    <Button variant="outline" disabled icon={<Share2 className="h-4 w-4" />}>
                      Share
                    </Button>
                  ) : (
                    <SaveButton eventId={event.id} variant="full" className="w-full justify-center" />
                  )}
                </div>
                {!preview && (
                  <div className="pt-1">
                    <ShareMenu title={event.title} path={`/events/${event.id}`} variant="full" />
                  </div>
                )}
              </div>
            </div>

            <p className="mt-4 px-1 text-xs text-muted">
              Payments are processed in Ghana cedis. Tickets are delivered instantly with a QR code for
              entry.
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
};
