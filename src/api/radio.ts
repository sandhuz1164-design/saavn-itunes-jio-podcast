// Radio Browser API - Free, no authentication required
// https://www.radio-browser.info/

export interface RadioStation {
  changeuuid: string;
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  languagecodes: string;
  votes: number;
  lastchangetime: string;
  codec: string;
  bitrate: number;
  hls: number;
  lastcheckok: number;
  clickcount: number;
  clicktrend: number;
  ssl_error: number;
  geo_lat: number | null;
  geo_long: number | null;
  has_extended_info: boolean;
}

const RADIO_API_BASE = 'https://de1.api.radio-browser.info/json';

export async function getTopStations(limit = 20): Promise<RadioStation[]> {
  try {
    const response = await fetch(
      `${RADIO_API_BASE}/stations/topclick/${limit}`
    );
    if (!response.ok) throw new Error('Failed to fetch top stations');
    const data = await response.json();
    return data.filter((station: RadioStation) => station.url_resolved);
  } catch (error) {
    console.error('Error fetching top stations:', error);
    return [];
  }
}

export async function getStationsByGenre(genre: string, limit = 20): Promise<RadioStation[]> {
  try {
    const response = await fetch(
      `${RADIO_API_BASE}/stations/bytag/${encodeURIComponent(genre)}?limit=${limit}&order=clickcount&reverse=true`
    );
    if (!response.ok) throw new Error('Failed to fetch stations by genre');
    const data = await response.json();
    return data.filter((station: RadioStation) => station.url_resolved);
  } catch (error) {
    console.error('Error fetching stations by genre:', error);
    return [];
  }
}

export async function getStationsByCountry(country: string, limit = 20): Promise<RadioStation[]> {
  try {
    const response = await fetch(
      `${RADIO_API_BASE}/stations/bycountry/${encodeURIComponent(country)}?limit=${limit}&order=clickcount&reverse=true`
    );
    if (!response.ok) throw new Error('Failed to fetch stations by country');
    const data = await response.json();
    return data.filter((station: RadioStation) => station.url_resolved);
  } catch (error) {
    console.error('Error fetching stations by country:', error);
    return [];
  }
}

export async function searchStations(query: string, limit = 20): Promise<RadioStation[]> {
  try {
    const response = await fetch(
      `${RADIO_API_BASE}/stations/byname/${encodeURIComponent(query)}?limit=${limit}`
    );
    if (!response.ok) throw new Error('Failed to search stations');
    const data = await response.json();
    return data.filter((station: RadioStation) => station.url_resolved);
  } catch (error) {
    console.error('Error searching stations:', error);
    return [];
  }
}

export const RADIO_GENRES = [
  { name: 'Pop', emoji: '🎵', color: 'from-pink-500 to-rose-500' },
  { name: 'Rock', emoji: '🎸', color: 'from-red-500 to-orange-500' },
  { name: 'Jazz', emoji: '🎷', color: 'from-amber-500 to-yellow-500' },
  { name: 'Classical', emoji: '🎻', color: 'from-purple-500 to-indigo-500' },
  { name: 'Electronic', emoji: '🎹', color: 'from-cyan-500 to-blue-500' },
  { name: 'Hip Hop', emoji: '🎤', color: 'from-violet-500 to-purple-500' },
  { name: 'Country', emoji: '🤠', color: 'from-orange-500 to-amber-500' },
  { name: 'R&B', emoji: '🎶', color: 'from-fuchsia-500 to-pink-500' },
  { name: 'News', emoji: '📰', color: 'from-blue-500 to-cyan-500' },
  { name: 'Talk', emoji: '💬', color: 'from-green-500 to-emerald-500' },
  { name: 'Chill', emoji: '🌊', color: 'from-teal-500 to-cyan-500' },
  { name: 'Workout', emoji: '💪', color: 'from-red-500 to-pink-500' },
];

export const RADIO_COUNTRIES = [
  { name: 'United States', code: 'US', emoji: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', emoji: '🇬🇧' },
  { name: 'India', code: 'IN', emoji: '🇮🇳' },
  { name: 'Germany', code: 'DE', emoji: '🇩🇪' },
  { name: 'France', code: 'FR', emoji: '🇫🇷' },
  { name: 'Japan', code: 'JP', emoji: '🇯🇵' },
  { name: 'Brazil', code: 'BR', emoji: '🇧🇷' },
  { name: 'Canada', code: 'CA', emoji: '🇨🇦' },
];
