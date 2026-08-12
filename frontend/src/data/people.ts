import type { Attendee, AppNotification, Report, UserProfile } from '@/types';
import { demoEvents } from './events';

const names = [
  'Kwame Mensah', 'Ama Serwaa', 'Kojo Boateng', 'Efua Danso', 'Yaw Owusu',
  'Adjoa Nyarko', 'Nii Armah Tetteh', 'Akosua Frimpong', 'Kofi Asante', 'Abena Amoah',
  'Selorm Agbeko', 'Naa Dedei Quaye', 'Ekow Baidoo', 'Esi Quartey', 'Mawuli Dzikunu',
  'Afia Konadu', 'Kwabena Appiah', 'Adiza Fuseini', 'Elorm Ansah', 'Sedinam Kudjo',
  'Nana Yaa Otoo', 'Bright Ofori', 'Hafiz Iddrisu', 'Delali Attipoe', 'Maame Efua Sam',
  'Papa Kwesi Arthur', 'Zainab Alhassan', 'Fiifi Coleman', 'Gifty Larbi', 'Kwaku Dompreh',
];

const email = (name: string) =>
  `${name.toLowerCase().replace(/[^a-z ]/g, '').split(' ').slice(0, 2).join('.')}@mail.com`;

const tierFor = (eventId: string, i: number) => {
  const ev = demoEvents.find((e) => e.id === eventId);
  const tiers = ev?.tiers ?? [];
  return tiers[i % Math.max(tiers.length, 1)]?.name ?? 'General';
};

/** Attendee rows for the organizer dashboard — one seeded list, deterministic order. */
export const demoAttendees: Attendee[] = names.flatMap((name, i) => {
  const eventIds = ['e1', 'e9', 'e10', 'e23', 'e22', 'e2'];
  const eventId = eventIds[i % eventIds.length];
  const daysAgo = (i % 12) + 1;
  const purchased = new Date();
  purchased.setDate(purchased.getDate() - daysAgo);
  return [
    {
      id: `a${i + 1}`,
      eventId,
      name,
      email: email(name),
      tier: tierFor(eventId, i),
      quantity: (i % 3) + 1,
      purchasedAt: purchased.toISOString(),
      status: i % 7 === 0 ? 'checked-in' : i % 11 === 0 ? 'refunded' : 'confirmed',
    } as Attendee,
  ];
});

export const demoUsers: UserProfile[] = names.slice(0, 18).map((name, i) => ({
  id: `u${i + 1}`,
  name,
  email: email(name),
  avatar: '',
  cityId: i % 9 === 0 ? 'tema' : i % 13 === 0 ? 'kumasi' : 'accra',
  interests: (['music', 'food', 'tech', 'sports', 'nightlife', 'arts'] as const).slice(
    i % 3,
    (i % 3) + 3,
  ) as UserProfile['interests'],
  role: i % 9 === 0 ? 'organizer' : 'attendee',
  joined: `2025-0${(i % 9) + 1}-1${i % 9}`,
}));

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();

export const demoNotifications: AppNotification[] = [
  { id: 'n1', type: 'reminder', title: 'Sunset Sessions starts tomorrow', body: 'Doors at 7:00 PM at Untamed Rooftop, East Legon. Your ticket is in your wallet.', createdAt: hoursAgo(2), read: false, href: '/events/e1' },
  { id: 'n2', type: 'organizer', title: 'Night Owls Accra published a new event', body: 'Amapiano Pool Session — Palace Mall Rooftop, Spintex.', createdAt: hoursAgo(7), read: false, href: '/events/e20' },
  { id: 'n3', type: 'change', title: 'A saved event changed venue', body: 'Street Art Walk now starts at The Republic Yard instead of the gallery.', createdAt: hoursAgo(20), read: false, href: '/events/e8' },
  { id: 'n4', type: 'ticket', title: 'Ticket confirmed', body: 'Your Accra Derby ticket is ready. Show the QR code at gate B.', createdAt: hoursAgo(30), read: true, href: '/profile' },
  { id: 'n5', type: 'social', title: 'Selorm is going to Detty Season Warm-Up', body: 'Three people you follow are interested in this event.', createdAt: hoursAgo(52), read: true, href: '/events/e10' },
];

export const demoReports: Report[] = [
  { id: 'r1', eventId: 'e30', reason: 'Misleading listing', detail: 'The lineup shown in the cover image does not match the description.', reportedBy: 'Ama Serwaa', createdAt: hoursAgo(9), status: 'open' },
  { id: 'r2', eventId: 'e20', reason: 'Ticket price mismatch', detail: 'Price at the gate was higher than the price listed on StepOut.', reportedBy: 'Kofi Asante', createdAt: hoursAgo(28), status: 'open' },
  { id: 'r3', eventId: 'e32', reason: 'Event did not happen', detail: 'Turned up and the venue was closed. Refund requested.', reportedBy: 'Naa Dedei Quaye', createdAt: hoursAgo(74), status: 'resolved' },
];
