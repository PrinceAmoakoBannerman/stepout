import { format, formatDistanceToNowStrict, isToday, isTomorrow, parseISO } from 'date-fns';

export const cedis = (amount: number) =>
  amount === 0
    ? 'Free'
    : `GH₵${amount.toLocaleString('en-GH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export const cedisExact = (amount: number) =>
  `GH₵${amount.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const compact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 || n >= 10000 ? 0 : 1)}k` : `${n}`;

export const day = (iso: string) => format(parseISO(iso), 'EEE, d MMM');
export const longDay = (iso: string) => format(parseISO(iso), 'EEEE, d MMMM yyyy');
export const clock = (iso: string) => format(parseISO(iso), 'h:mm a');
export const monthShort = (iso: string) => format(parseISO(iso), 'MMM').toUpperCase();
export const dayNum = (iso: string) => format(parseISO(iso), 'd');
export const isoDate = (iso: string) => format(parseISO(iso), 'yyyy-MM-dd');
export const isoTime = (iso: string) => format(parseISO(iso), 'HH:mm');

export const relativeDay = (iso: string) => {
  const d = parseISO(iso);
  if (isToday(d)) return 'Tonight';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'EEE, d MMM');
};

export const timeAgo = (iso: string) => `${formatDistanceToNowStrict(parseISO(iso))} ago`;

export const priceRange = (prices: number[]) => {
  if (!prices.length) return 'Free';
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === 0 && max === 0) return 'Free';
  if (min === max) return cedis(min);
  return `${cedis(min)} – ${cedis(max)}`;
};

/** Haversine distance in km — used for "closest" sorting and distance filters. */
export const distanceKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
};

export const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
