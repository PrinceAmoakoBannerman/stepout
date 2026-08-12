import type { Category } from '@/types';

export const categories: Category[] = [
  { id: 'music', name: 'Music', icon: 'Music4', tint: 'text-magenta bg-magenta/10', blurb: 'Live sets, concerts and listening nights' },
  { id: 'nightlife', name: 'Nightlife', icon: 'Martini', tint: 'text-green bg-green/10', blurb: 'Parties, lounges and after-dark rooms' },
  { id: 'sports', name: 'Sports', icon: 'Trophy', tint: 'text-ember bg-ember/10', blurb: 'Match days, tournaments and viewing centres' },
  { id: 'food', name: 'Food', icon: 'UtensilsCrossed', tint: 'text-sun-600 bg-sun/15', blurb: 'Tastings, pop-ups and market kitchens' },
  { id: 'tech', name: 'Tech', icon: 'Cpu', tint: 'text-green bg-green/10', blurb: 'Meetups, demo nights and hackathons' },
  { id: 'networking', name: 'Networking', icon: 'Handshake', tint: 'text-ember bg-ember/10', blurb: 'Mixers, breakfasts and founder tables' },
  { id: 'arts', name: 'Arts', icon: 'Palette', tint: 'text-magenta bg-magenta/10', blurb: 'Exhibitions, open studios and shows' },
  { id: 'culture', name: 'Culture', icon: 'Drum', tint: 'text-sun-600 bg-sun/15', blurb: 'Heritage nights, film and storytelling' },
  { id: 'community', name: 'Community', icon: 'Users', tint: 'text-green bg-green/10', blurb: 'Clean-ups, run clubs and neighbourhood days' },
  { id: 'workshops', name: 'Workshops', icon: 'GraduationCap', tint: 'text-ember bg-ember/10', blurb: 'Hands-on classes and skill sessions' },
];

export const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<
  Category['id'],
  Category
>;
