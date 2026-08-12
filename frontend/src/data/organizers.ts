import type { Organizer } from '@/types';

export const organizers: Organizer[] = [
  { id: 'o1', name: 'Sunset Sessions GH', handle: 'sunsetsessionsgh', avatar: '', verified: true, bio: 'Rooftop and garden concerts across Accra. Live band highlife, afro-fusion and everything in between.', followers: 18400, eventsHosted: 62, categories: ['music', 'culture'], cityId: 'accra', joined: '2021-03-14' },
  { id: 'o2', name: 'Accra Tech Circle', handle: 'accratechcircle', avatar: '', verified: true, bio: 'Monthly demo nights, build sessions and career clinics for engineers and product people in Accra.', followers: 9600, eventsHosted: 48, categories: ['tech', 'workshops', 'networking'], cityId: 'accra', joined: '2020-08-02' },
  { id: 'o3', name: 'Nkyinkyim Arts House', handle: 'nkyinkyimarts', avatar: '', verified: true, bio: 'Independent gallery and studio programme championing young Ghanaian painters, photographers and poets.', followers: 7300, eventsHosted: 35, categories: ['arts', 'culture'], cityId: 'accra', joined: '2019-11-20' },
  { id: 'o4', name: 'Chop Bar Society', handle: 'chopbarsociety', avatar: '', verified: true, bio: 'Food crawls, night markets and tasting menus built around Ghanaian kitchens and the people who run them.', followers: 12800, eventsHosted: 54, categories: ['food', 'community'], cityId: 'accra', joined: '2021-06-09' },
  { id: 'o5', name: 'Night Owls Accra', handle: 'nightowlsaccra', avatar: '', verified: true, bio: 'Afrobeats, amapiano and house parties from Osu to Airport City. Doors open late, close later.', followers: 24100, eventsHosted: 88, categories: ['nightlife', 'music'], cityId: 'accra', joined: '2019-02-11' },
  { id: 'o6', name: 'Pitchside Ghana', handle: 'pitchsidegh', avatar: '', verified: false, bio: 'Match days, five-a-side leagues and viewing nights for everyone who takes football a little too seriously.', followers: 15200, eventsHosted: 71, categories: ['sports', 'community'], cityId: 'accra', joined: '2020-01-25' },
  { id: 'o7', name: 'Founders Table Accra', handle: 'founderstable', avatar: '', verified: true, bio: 'Curated breakfasts and mixers connecting founders, operators and investors building out of Ghana.', followers: 6100, eventsHosted: 29, categories: ['networking', 'tech'], cityId: 'accra', joined: '2022-04-18' },
  { id: 'o8', name: 'Ridge Run Club', handle: 'ridgerunclub', avatar: '', verified: false, bio: 'Free weekly runs, beach clean-ups and neighbourhood days. All paces welcome, no membership fee.', followers: 4300, eventsHosted: 96, categories: ['community', 'sports'], cityId: 'accra', joined: '2021-09-30' },
  { id: 'o9', name: 'Studio 233 Workshops', handle: 'studio233', avatar: '', verified: true, bio: 'Hands-on classes in design, craft and photography taught by working practitioners.', followers: 5400, eventsHosted: 41, categories: ['workshops', 'arts'], cityId: 'accra', joined: '2022-01-07' },
  { id: 'o10', name: 'Highlife Heritage Co.', handle: 'highlifeheritage', avatar: '', verified: true, bio: 'Preserving Ghanaian highlife through live orchestras, listening nights and archive screenings.', followers: 8900, eventsHosted: 33, categories: ['culture', 'music'], cityId: 'accra', joined: '2020-10-16' },
];

export const organizerMap = Object.fromEntries(organizers.map((o) => [o.id, o])) as Record<
  string,
  Organizer
>;
