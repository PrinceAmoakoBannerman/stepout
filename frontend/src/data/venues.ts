import type { Venue } from '@/types';

export const venues: Venue[] = [
  { id: 'v1', name: 'Alliance Gardens', address: 'Liberation Link, Airport Residential', area: 'Airport Residential', cityId: 'accra', lat: 5.5975, lng: -0.171, capacity: 1200 },
  { id: 'v2', name: 'Jazz Yard 233', address: 'North Ridge Crescent', area: 'Ridge', cityId: 'accra', lat: 5.5738, lng: -0.2015, capacity: 400 },
  { id: 'v3', name: 'Untamed Rooftop', address: 'Lagos Avenue, East Legon', area: 'East Legon', cityId: 'accra', lat: 5.6362, lng: -0.1462, capacity: 800 },
  { id: 'v4', name: 'Bloom Courtyard', address: 'Oxford Street, Osu', area: 'Osu', cityId: 'accra', lat: 5.558, lng: -0.1826, capacity: 600 },
  { id: 'v5', name: 'Accra Sports Stadium', address: 'Barnes Road, Osu', area: 'Osu', cityId: 'accra', lat: 5.5525, lng: -0.1878, capacity: 40000 },
  { id: 'v6', name: 'Impact Hub Accra', address: '18 Blohum Street, Osu', area: 'Osu', cityId: 'accra', lat: 5.561, lng: -0.183, capacity: 220 },
  { id: 'v7', name: 'Ridge Grand Ballroom', address: 'Gamel Abdul Nasser Ave, Ridge', area: 'Ridge', cityId: 'accra', lat: 5.5586, lng: -0.1961, capacity: 900 },
  { id: 'v8', name: 'Polo Court, Airport City', address: 'Airport City Roundabout', area: 'Airport Residential', cityId: 'accra', lat: 5.6045, lng: -0.1745, capacity: 3000 },
  { id: 'v9', name: 'The Republic Yard', address: 'Nkrumah Avenue, Adabraka', area: 'Adabraka', cityId: 'accra', lat: 5.554, lng: -0.2065, capacity: 180 },
  { id: 'v10', name: 'Labadi Beach Deck', address: 'La Beach Road, La', area: 'La', cityId: 'accra', lat: 5.5606, lng: -0.145, capacity: 2500 },
  { id: 'v11', name: 'Nubuke Grounds', address: 'Boundary Road, East Legon', area: 'East Legon', cityId: 'accra', lat: 5.6482, lng: -0.1548, capacity: 500 },
  { id: 'v12', name: 'Palace Mall Rooftop', address: 'Spintex Road', area: 'Spintex', cityId: 'accra', lat: 5.63, lng: -0.096, capacity: 700 },
  { id: 'v13', name: 'Madina Astro Turf', address: 'Zongo Junction, Madina', area: 'Madina', cityId: 'accra', lat: 5.6837, lng: -0.166, capacity: 900 },
  { id: 'v14', name: 'Kokomlemle Community Centre', address: 'Ring Road West, Kokomlemle', area: 'Kokomlemle', cityId: 'accra', lat: 5.572, lng: -0.211, capacity: 350 },
  { id: 'v15', name: 'Coco Terrace, Cantonments', address: '4th Norla Street, Cantonments', area: 'Cantonments', cityId: 'accra', lat: 5.5723, lng: -0.1758, capacity: 300 },
  { id: 'v16', name: 'Front Room, Labone', address: '3rd Crescent, Labone', area: 'Labone', cityId: 'accra', lat: 5.5628, lng: -0.172, capacity: 260 },
  { id: 'v17', name: 'Achimota Retail Court', address: 'Achimota Mall, Accra', area: 'Achimota', cityId: 'accra', lat: 5.6135, lng: -0.227, capacity: 1500 },
];

export const venueMap = Object.fromEntries(venues.map((v) => [v.id, v])) as Record<string, Venue>;
