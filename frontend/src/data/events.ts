import type { CategoryId, EventItem, EventStatus, ScheduleItem, TicketTier } from '@/types';

/**
 * Demo catalogue. Dates are generated relative to "now" so the app always has
 * something happening tonight, this weekend and next month.
 * Swap this module for `eventService` API calls once the Django backend is live.
 */
const base = new Date();

const at = (dayOffset: number, hour: number, minute = 0) => {
  const d = new Date(base);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const img = (seed: string) => `https://picsum.photos/seed/stepout-${seed}/1200/800`;

const defaultSchedule: Record<CategoryId, ScheduleItem[]> = {
  music: [
    { time: 'Doors', title: 'Gates open', detail: 'Early arrivals get the front deck' },
    { time: '+1h', title: 'Opening set', detail: 'Resident DJ and support act' },
    { time: '+2h', title: 'Headline performance' },
    { time: 'Close', title: 'Last call' },
  ],
  nightlife: [
    { time: 'Doors', title: 'Doors open' },
    { time: '+2h', title: 'Main room takeover' },
    { time: 'Close', title: 'Lights up' },
  ],
  sports: [
    { time: 'Gates', title: 'Gates open' },
    { time: 'Kick-off', title: 'First whistle' },
    { time: 'Half time', title: 'Break and refreshments' },
    { time: 'Full time', title: 'Final whistle' },
  ],
  food: [
    { time: 'Open', title: 'Stalls open' },
    { time: '+2h', title: 'Live kitchen demo' },
    { time: 'Close', title: 'Last orders' },
  ],
  tech: [
    { time: 'Start', title: 'Check-in and networking' },
    { time: '+30m', title: 'Talks and demos' },
    { time: '+2h', title: 'Q&A and open floor' },
  ],
  networking: [
    { time: 'Start', title: 'Arrival and coffee' },
    { time: '+45m', title: 'Roundtable introductions' },
    { time: '+2h', title: 'Open networking' },
  ],
  arts: [
    { time: 'Open', title: 'Doors open' },
    { time: '+1h', title: 'Artist walkthrough' },
    { time: 'Close', title: 'Closing remarks' },
  ],
  culture: [
    { time: 'Open', title: 'Welcome drumming' },
    { time: '+1h', title: 'Main programme' },
    { time: 'Close', title: 'Closing procession' },
  ],
  community: [
    { time: 'Meet', title: 'Meet-up and briefing' },
    { time: '+30m', title: 'Main activity' },
    { time: 'End', title: 'Wrap-up and group photo' },
  ],
  workshops: [
    { time: 'Start', title: 'Introductions and setup' },
    { time: '+1h', title: 'Guided practice' },
    { time: 'End', title: 'Showcase and feedback' },
  ],
};

const defaultInfo = [
  'Bring a valid ID — entry is 18+ unless stated otherwise.',
  'Tickets are transferable but non-refundable within 24 hours of the event.',
  'Mobile money and card payments accepted at the venue.',
  'Parking is available nearby; ride-hailing drop-off is at the main gate.',
];

interface Seed {
  id: string;
  title: string;
  category: CategoryId;
  venueId: string;
  organizerId: string;
  d: number;
  h: number;
  m?: number;
  hours: number;
  tiers: [string, number, number, number][]; // name, price, quantity, sold
  summary: string;
  description: string;
  tags: string[];
  interested: number;
  views: number;
  featured?: boolean;
  trending?: boolean;
  status?: EventStatus;
  schedule?: ScheduleItem[];
}

const seeds: Seed[] = [
  { id: 'e1', title: 'Sunset Sessions: Rooftop Highlife', category: 'music', venueId: 'v3', organizerId: 'o1', d: 0, h: 19, hours: 4, tiers: [['Early bird', 80, 200, 187], ['Regular', 120, 400, 241], ['Table for 4', 600, 20, 11]], summary: 'Live band highlife on an East Legon rooftop as the sun drops.', description: 'A six-piece band, a rooftop and the best hour of Accra light. Sunset Sessions brings back the horn-led highlife catalogue with new arrangements, plus a guest vocalist announced on the night. Come early — the deck fills before the first song.', tags: ['live band', 'rooftop', 'highlife'], interested: 1840, views: 12400, featured: true, trending: true },
  { id: 'e2', title: 'Afrobeats Fridays', category: 'nightlife', venueId: 'v4', organizerId: 'o5', d: 0, h: 22, hours: 5, tiers: [['Standard entry', 100, 500, 312], ['VIP booth', 800, 15, 9]], summary: 'The Osu institution — three rooms, one very long night.', description: 'Afrobeats in the courtyard, amapiano upstairs and a slow room for the people who want to hear each other talk. Resident DJs from 10pm, guest sets after midnight.', tags: ['afrobeats', 'amapiano', 'osu'], interested: 2960, views: 18700, trending: true },
  { id: 'e3', title: 'Chop Bar Night Market', category: 'food', venueId: 'v9', organizerId: 'o4', d: 0, h: 18, hours: 4, tiers: [['Free entry', 0, 800, 402]], summary: 'Twenty kitchens, one yard, no entry fee.', description: 'Waakye, khebab, banku and grilled tilapia from kitchens that normally only open at dawn, plus a dessert corner and a live kitchen demo at 8pm. Entry is free; bring cash or mobile money for the stalls.', tags: ['street food', 'night market', 'free'], interested: 1420, views: 9100, trending: true },
  { id: 'e4', title: 'Premier League Viewing Night', category: 'sports', venueId: 'v12', organizerId: 'o6', d: 0, h: 20, hours: 3, tiers: [['Entry + drink', 30, 300, 168]], summary: 'Big screens, cold drinks and far too much shouting.', description: 'Two matches back to back on a 4m screen with commentary you can actually hear. Wings and drinks specials all night, and a half-time prediction game with prizes.', tags: ['football', 'viewing centre', 'spintex'], interested: 780, views: 5200 },
  { id: 'e5', title: 'Accra Tech Circle: AI Demo Night', category: 'tech', venueId: 'v6', organizerId: 'o2', d: 1, h: 17, m: 30, hours: 3, tiers: [['Free RSVP', 0, 180, 154]], summary: 'Eight teams, five minutes each, no slide decks allowed.', description: 'Live demos from Accra teams building with machine learning — fintech fraud tooling, Twi speech models, farm logistics and more. Demos first, then open networking with food.', tags: ['ai', 'demo night', 'free'], interested: 640, views: 4800, trending: true },
  { id: 'e6', title: 'Jollof & Jazz Brunch', category: 'food', venueId: 'v2', organizerId: 'o4', d: 1, h: 12, hours: 4, tiers: [['Brunch seat', 150, 120, 88], ['Brunch + bottomless', 260, 60, 41]], summary: 'A long Saturday table with a live trio in the corner.', description: 'Three courses built around a jollof flight from four regions, with a jazz trio playing through the afternoon. Seating is communal — come alone, leave with a table.', tags: ['brunch', 'jazz', 'ridge'], interested: 520, views: 3900 },
  { id: 'e7', title: 'Kokomlemle Community Clean-Up', category: 'community', venueId: 'v14', organizerId: 'o8', d: 1, h: 6, m: 30, hours: 3, tiers: [['Free — just show up', 0, 200, 96]], summary: 'Gloves, bags and breakfast provided. Bring your energy.', description: 'A monthly neighbourhood clean-up along the Ring Road West stretch, finishing with breakfast at the community centre. Families welcome; equipment is provided.', tags: ['volunteering', 'free', 'morning'], interested: 210, views: 1600 },
  { id: 'e8', title: 'Street Art Walk: Adabraka Edition', category: 'arts', venueId: 'v9', organizerId: 'o3', d: 2, h: 10, hours: 5, tiers: [['Walk ticket', 40, 90, 62]], summary: 'A guided walk through Adabraka murals with the artists who painted them.', description: 'Five stops, five murals, five artists explaining what they were thinking. The walk ends in the Republic yard with a print sale supporting the next commission.', tags: ['murals', 'walking tour', 'adabraka'], interested: 380, views: 2900 },
  { id: 'e9', title: 'Accra Derby: Match Day', category: 'sports', venueId: 'v5', organizerId: 'o6', d: 2, h: 15, hours: 2, tiers: [['Popular stand', 50, 8000, 5210], ['Centre line', 150, 1200, 806], ['VIP', 400, 300, 142]], summary: 'The loudest ninety minutes in the city.', description: 'The Accra derby returns to the stadium with both sides chasing the top of the table. Gates open two hours before kick-off; get in early for the drumming section behind the goal.', tags: ['football', 'derby', 'stadium'], interested: 6100, views: 41000, featured: true, trending: true },
  { id: 'e10', title: 'Detty Season Warm-Up', category: 'nightlife', venueId: 'v8', organizerId: 'o5', d: 2, h: 21, hours: 6, tiers: [['Regular', 200, 1500, 1102], ['VIP table (8)', 3500, 40, 22]], summary: 'The outdoor one — full production, four DJs, sunrise finish.', description: 'Airport City polo grounds turned into an open-air floor with a proper sound rig and a lineup that rotates every ninety minutes. Food trucks on site until close.', tags: ['open air', 'djs', 'airport city'], interested: 4300, views: 27800, featured: true, trending: true },
  { id: 'e11', title: 'Founders Table Breakfast', category: 'networking', venueId: 'v7', organizerId: 'o7', d: 3, h: 8, hours: 3, tiers: [['Seat at the table', 250, 60, 47]], summary: 'Sixty founders, eight tables, one honest conversation per table.', description: 'A structured breakfast where each table takes one operating problem — hiring, pricing, fundraising, retention — and works through it with an operator hosting. No pitches, no panels.', tags: ['founders', 'breakfast', 'invite'], interested: 290, views: 2100 },
  { id: 'e12', title: 'Highlife Heritage Concert', category: 'culture', venueId: 'v1', organizerId: 'o10', d: 3, h: 18, hours: 4, tiers: [['General', 180, 600, 388], ['Front rows', 350, 120, 74]], summary: 'A 14-piece orchestra playing the highlife catalogue live.', description: 'An evening tracing highlife from the palm-wine guitar era to the present, performed by a full orchestra with archival footage projected behind the stage.', tags: ['orchestra', 'heritage', 'live'], interested: 940, views: 7300 },
  { id: 'e13', title: 'Beach Clean-Up + Sunrise Yoga', category: 'community', venueId: 'v10', organizerId: 'o8', d: 3, h: 6, hours: 3, tiers: [['Free — just show up', 0, 300, 141]], summary: 'Clean the sand, then stretch on it.', description: 'An hour of clean-up along the La stretch followed by a beginner-friendly yoga session as the sun comes up. Mats available on a first-come basis.', tags: ['beach', 'wellness', 'free'], interested: 460, views: 3300 },
  { id: 'e14', title: 'Product Design Crash Course', category: 'workshops', venueId: 'v6', organizerId: 'o9', d: 4, h: 9, hours: 8, tiers: [['Full day seat', 400, 30, 24]], summary: 'One day, one product, from problem to clickable prototype.', description: 'A hands-on day covering research, wireframing, visual hierarchy and prototyping in Figma. Bring a laptop; you leave with a prototype and a critique from a working designer.', tags: ['design', 'figma', 'hands-on'], interested: 180, views: 1900 },
  { id: 'e15', title: 'Open Mic & Poetry Night', category: 'arts', venueId: 'v16', organizerId: 'o3', d: 4, h: 19, hours: 3, tiers: [['Audience', 50, 150, 91], ['Performer slot', 0, 20, 17]], summary: 'Twenty slots, five minutes each, one very supportive room.', description: 'Poetry, spoken word and acoustic sets in a Labone living room. Performer slots are free but limited — reserve one and you get a soundcheck at 6:30pm.', tags: ['poetry', 'open mic', 'labone'], interested: 320, views: 2400 },
  { id: 'e16', title: 'Startup & Investor Mixer', category: 'networking', venueId: 'v15', organizerId: 'o7', d: 5, h: 18, hours: 3, tiers: [['Standard', 120, 200, 133]], summary: 'Early-stage founders meet the people who write the cheques.', description: 'A relaxed evening on the Cantonments terrace with a short fireside chat, then two hours of open mixing. Attendee list is shared with everyone the morning after.', tags: ['investors', 'startups', 'mixer'], interested: 410, views: 3100 },
  { id: 'e17', title: 'Madina 5-a-Side Tournament', category: 'sports', venueId: 'v13', organizerId: 'o6', d: 5, h: 8, hours: 9, tiers: [['Spectator', 20, 500, 214], ['Team entry (7)', 350, 24, 20]], summary: 'Twenty-four teams, one turf, trophy by sundown.', description: 'Group stages from 8am, knockouts after 2pm and a final under lights. Team entry covers seven players, bibs and water.', tags: ['football', 'tournament', 'madina'], interested: 880, views: 6400 },
  { id: 'e18', title: 'Vinyl & Palm Wine', category: 'music', venueId: 'v9', organizerId: 'o1', d: 6, h: 17, hours: 5, tiers: [['Entry', 60, 200, 118]], summary: 'Records only. No laptops, no requests, no rush.', description: 'A listening session built on original pressings — highlife, afrobeat, funk — with palm wine and small chops in the yard. Bring a record and you get on the deck for one side.', tags: ['vinyl', 'listening', 'adabraka'], interested: 540, views: 3700 },
  { id: 'e19', title: 'Kente Weaving Workshop', category: 'workshops', venueId: 'v11', organizerId: 'o9', d: 6, h: 11, hours: 4, tiers: [['Loom seat', 220, 20, 15]], summary: 'Learn the loom from a master weaver, take your strip home.', description: 'A four-hour session covering the history of kente symbolism and the basics of the traditional loom. Every seat gets a loom, yarn and a finished strip to keep.', tags: ['craft', 'heritage', 'hands-on'], interested: 260, views: 2200 },
  { id: 'e20', title: 'Amapiano Pool Session', category: 'nightlife', venueId: 'v12', organizerId: 'o5', d: 7, h: 14, hours: 8, tiers: [['Entry', 180, 400, 246], ['Cabana (6)', 1800, 12, 7]], summary: 'Log drums by the water from lunchtime to lights out.', description: 'A daytime-into-night pool party with a South African guest DJ, grill stations and a dress code that starts and ends with swimwear.', tags: ['amapiano', 'pool', 'day party'], interested: 1900, views: 14200, trending: true },
  { id: 'e21', title: 'Data Bootcamp Demo Day', category: 'tech', venueId: 'v6', organizerId: 'o2', d: 8, h: 16, hours: 3, tiers: [['Free RSVP', 0, 150, 88]], summary: 'Thirty graduates present the projects they built in twelve weeks.', description: 'Final projects from the cohort — dashboards, models and data products built on Ghanaian datasets. Hiring managers get a reserved row.', tags: ['data', 'demo day', 'free'], interested: 300, views: 2600 },
  { id: 'e22', title: 'Accra Street Food Festival', category: 'food', venueId: 'v17', organizerId: 'o4', d: 9, h: 11, hours: 9, tiers: [['Day pass', 25, 4000, 2410], ['Taste passport (10 stalls)', 200, 600, 388]], summary: 'Sixty vendors, one car park, all day.', description: 'The biggest edition yet: sixty kitchens, a chilli challenge, live cooking stages and a kids corner. The taste passport gets you a portion at ten stalls of your choice.', tags: ['festival', 'family', 'achimota'], interested: 3200, views: 22400, featured: true },
  { id: 'e23', title: 'Afro-Fusion Live: Album Launch', category: 'music', venueId: 'v1', organizerId: 'o1', d: 12, h: 19, hours: 4, tiers: [['General', 150, 800, 512], ['Gold', 350, 300, 178], ['Front row + meet', 800, 60, 34]], summary: 'A debut album played front to back with a full band.', description: 'The launch show for a record two years in the making — full band, string section and three guest features. Physical copies signed after the set.', tags: ['album launch', 'live band', 'gardens'], interested: 2700, views: 19800, featured: true },
  { id: 'e24', title: 'Women in Tech Brunch', category: 'networking', venueId: 'v15', organizerId: 'o7', d: 14, h: 10, hours: 4, tiers: [['Brunch seat', 90, 120, 76]], summary: 'Mentorship, brunch and a room that gets it.', description: 'Small-group mentoring with senior engineers, designers and PMs, then open brunch. Open to women and non-binary people working in or moving into tech.', tags: ['mentorship', 'brunch', 'community'], interested: 480, views: 3600 },
  { id: 'e25', title: 'Nkyinkyim Exhibition Opening', category: 'arts', venueId: 'v11', organizerId: 'o3', d: 16, h: 17, hours: 4, tiers: [['Free entry', 0, 400, 172]], summary: 'Twelve painters, one question: what does home look like now?', description: 'The opening night of a six-week group show, with all twelve artists present and a curator-led walkthrough at 7pm. Entry is free for the opening.', tags: ['exhibition', 'opening', 'free'], interested: 610, views: 4400 },
  { id: 'e26', title: 'Independence Culture Night', category: 'culture', venueId: 'v10', organizerId: 'o10', d: 21, h: 18, hours: 5, tiers: [['General', 70, 1500, 640], ['Family (4)', 240, 200, 88]], summary: 'Drumming, dance troupes and a beach bonfire finish.', description: 'A programme of regional dance troupes, adowa and kpanlogo drumming, and a fire-lit closing procession along the beach.', tags: ['heritage', 'family', 'beach'], interested: 1500, views: 11200 },
  { id: 'e27', title: 'Rooftop Sunrise Yoga', category: 'community', venueId: 'v3', organizerId: 'o8', d: -6, h: 6, m: 30, hours: 2, tiers: [['Free — just show up', 0, 80, 62]], summary: 'A quiet hour above East Legon before the city wakes.', description: 'A beginner-friendly flow on the rooftop with mats provided, finishing with coffee and fruit.', tags: ['wellness', 'morning', 'free'], interested: 140, views: 1100 },
  { id: 'e28', title: 'Tech Careers Fair 2026', category: 'tech', venueId: 'v7', organizerId: 'o2', d: -14, h: 9, hours: 8, tiers: [['Free RSVP', 0, 900, 742]], summary: 'Thirty companies hiring engineers, designers and analysts.', description: 'CV clinics, on-the-spot interviews and a hiring-manager panel. Bring printed copies of your CV.', tags: ['careers', 'hiring', 'free'], interested: 2100, views: 16400 },
  { id: 'e29', title: 'Night Market Vol. 4', category: 'food', venueId: 'v9', organizerId: 'o4', d: 18, h: 18, hours: 5, tiers: [['Free entry', 0, 800, 0]], summary: 'The fourth edition of the Adabraka night market.', description: 'Draft listing — vendor list and live kitchen schedule still being confirmed.', tags: ['night market', 'draft'], interested: 0, views: 0, status: 'draft' },
  { id: 'e30', title: 'Afro House Rooftop', category: 'nightlife', venueId: 'v3', organizerId: 'o5', d: 10, h: 21, hours: 6, tiers: [['Entry', 150, 400, 0]], summary: 'A deep afro house night above East Legon.', description: 'Four-hour rooftop set from a visiting Cape Town DJ, with a local warm-up and a late close.', tags: ['afro house', 'rooftop'], interested: 0, views: 0, status: 'pending' },
  { id: 'e31', title: 'Legon Alumni Football Fiesta', category: 'sports', venueId: 'v13', organizerId: 'o6', d: 13, h: 9, hours: 7, tiers: [['Spectator', 30, 600, 0], ['Team entry', 300, 16, 0]], summary: 'Alumni sides from six halls, one turf, bragging rights.', description: 'A one-day alumni tournament with group stages, a final and a barbecue afterwards.', tags: ['football', 'alumni'], interested: 0, views: 0, status: 'pending' },
  { id: 'e32', title: 'Beach Bonfire Sessions', category: 'music', venueId: 'v10', organizerId: 'o1', d: 8, h: 18, hours: 5, tiers: [['Entry', 90, 300, 42]], summary: 'Acoustic sets around a fire on La beach.', description: 'Cancelled — the venue permit for the beach stretch was not renewed in time. Ticket holders have been refunded in full.', tags: ['acoustic', 'beach'], interested: 220, views: 1800, status: 'cancelled' },
];

const buildTiers = (id: string, tiers: Seed['tiers']): TicketTier[] =>
  tiers.map(([name, price, quantity, sold], i) => ({
    id: `${id}-t${i + 1}`,
    name,
    price,
    quantity,
    sold,
  }));

export const demoEvents: EventItem[] = seeds.map((s) => ({
  id: s.id,
  title: s.title,
  category: s.category,
  summary: s.summary,
  description: s.description,
  image: img(s.id),
  start: at(s.d, s.h, s.m ?? 0),
  end: at(s.d + (s.h + s.hours >= 24 ? 1 : 0), (s.h + s.hours) % 24, s.m ?? 0),
  venueId: s.venueId,
  organizerId: s.organizerId,
  tiers: buildTiers(s.id, s.tiers),
  interested: s.interested,
  views: s.views,
  status: s.status ?? 'published',
  featured: Boolean(s.featured),
  trending: Boolean(s.trending),
  tags: s.tags,
  schedule: s.schedule ?? defaultSchedule[s.category],
  info: defaultInfo,
  createdAt: at(s.d - 30, 9),
}));

export const eventById = (id: string) => demoEvents.find((e) => e.id === id);
