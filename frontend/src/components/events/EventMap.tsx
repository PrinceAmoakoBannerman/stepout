import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import type { EventItem, Venue } from '@/types';
import { EventImage } from './EventImage';
import { clock, priceRange, relativeDay } from '@/utils/format';
import { categoryMap } from '@/data/categories';

const pin = (active: boolean) =>
  L.divIcon({
    className: 'stepout-marker',
    html: `<span style="
      display:flex;align-items:center;justify-content:center;
      width:${active ? 34 : 26}px;height:${active ? 34 : 26}px;border-radius:50% 50% 50% 6px;
      transform:rotate(45deg);
      background:linear-gradient(135deg,#0E8F5B,#FF3D8A ${active ? '55%' : '70%'},#FF7A2F);
      box-shadow:0 6px 14px -4px rgba(11,11,31,.55);
      border:2px solid #fff;"></span>`,
    iconSize: [active ? 34 : 26, active ? 34 : 26],
    iconAnchor: [active ? 17 : 13, active ? 34 : 26],
    popupAnchor: [0, active ? -30 : -22],
  });

const Recenter = ({ center, zoom }: { center: [number, number]; zoom?: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom ?? map.getZoom(), { duration: 0.7 });
  }, [center[0], center[1], zoom]);
  return null;
};

interface Props {
  events: EventItem[];
  venueMap: Record<string, Venue>;
  center: [number, number];
  zoom?: number;
  activeId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}

export const EventMap = ({ events, venueMap, center, zoom = 12, activeId, onSelect, className }: Props) => {
  const points = useMemo(
    () =>
      events
        .map((event) => ({ event, venue: venueMap[event.venueId] }))
        .filter((p): p is { event: EventItem; venue: Venue } => Boolean(p.venue)),
    [events, venueMap],
  );

  return (
    <div className={className}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter center={center} zoom={zoom} />
        {points.map(({ event, venue }) => (
          <Marker
            key={event.id}
            position={[venue.lat, venue.lng]}
            icon={pin(activeId === event.id)}
            eventHandlers={{ click: () => onSelect?.(event.id) }}
          >
            <Popup>
              <div className="w-[244px] overflow-hidden rounded-lg">
                <EventImage
                  src={event.image}
                  alt={event.title}
                  category={event.category}
                  className="h-28 w-full"
                />
                <div className="p-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-magenta">
                    {categoryMap[event.category]?.name} · {relativeDay(event.start)} {clock(event.start)}
                  </p>
                  <h3 className="mt-1 font-display text-sm font-bold leading-snug text-fg">{event.title}</h3>
                  <p className="mt-1 text-xs text-muted">
                    {venue.name}, {venue.area}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="font-display text-sm font-bold text-fg">
                      {priceRange(event.tiers.map((t) => t.price))}
                    </span>
                    <Link
                      to={`/events/${event.id}`}
                      className="rounded-lg bg-green px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      View event
                    </Link>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
