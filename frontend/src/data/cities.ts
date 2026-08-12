import type { City } from '@/types';

/** City data is kept standalone so new cities are a data change, not a code change. */
export const cities: City[] = [
  { id: 'accra', name: 'Accra', region: 'Greater Accra', lat: 5.6037, lng: -0.187, active: true },
  { id: 'tema', name: 'Tema', region: 'Greater Accra', lat: 5.6698, lng: -0.0166, active: true },
  { id: 'kasoa', name: 'Kasoa', region: 'Central', lat: 5.5344, lng: -0.4247, active: true },
  { id: 'kumasi', name: 'Kumasi', region: 'Ashanti', lat: 6.6885, lng: -1.6244, active: true },
  { id: 'cape-coast', name: 'Cape Coast', region: 'Central', lat: 5.1053, lng: -1.2466, active: true },
  { id: 'takoradi', name: 'Takoradi', region: 'Western', lat: 4.8956, lng: -1.7554, active: true },
];

export const cityMap = Object.fromEntries(cities.map((c) => [c.id, c])) as Record<string, City>;

export const areas = [
  'Osu',
  'East Legon',
  'Labone',
  'Cantonments',
  'Airport Residential',
  'Spintex',
  'Madina',
  'Adabraka',
  'Ridge',
  'Kokomlemle',
  'La',
  'Achimota',
];
