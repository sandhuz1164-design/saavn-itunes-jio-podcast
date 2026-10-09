// iTunes Search API - Free, no authentication required
// Provides 30-second audio previews for songs

const ITUNES_BASE_URL = 'https://itunes.apple.com';

export interface Track {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  artworkUrl60?: string;
  previewUrl: string;
  trackTimeMillis: number;
  primaryGenreName: string;
  releaseDate: string;
  trackViewUrl: string;
  collectionArtistName?: string;
}

export interface ITunesSearchResponse {
  resultCount: number;
  results: Track[];
}

export async function searchTracks(query: string, limit = 10): Promise<Track[]> {
  try {
    const response = await fetch(
      `${ITUNES_BASE_URL}/search?term=${encodeURIComponent(query)}&media=music&limit=${limit}`
    );
    const data: ITunesSearchResponse = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
}

export async function getTopTracks(limit = 10): Promise<Track[]> {
  // Search for popular/trending music
  const queries = ['top hits 2024', 'popular music', 'trending songs'];
  const randomQuery = queries[Math.floor(Math.random() * queries.length)];
  
  try {
    const response = await fetch(
      `${ITUNES_BASE_URL}/search?term=${encodeURIComponent(randomQuery)}&media=music&entity=song&limit=${limit}&sort=recent`
    );
    const data: ITunesSearchResponse = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    return [];
  }
}

export async function getTopCharts(limit = 10): Promise<Track[]> {
  // Get popular tracks by searching for well-known artists and hits
  try {
    const response = await fetch(
      `${ITUNES_BASE_URL}/search?term=${encodeURIComponent('billboard hot 100')}&media=music&entity=song&limit=${limit}`
    );
    const data: ITunesSearchResponse = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results;
    }
    
    // Fallback: search for popular music
    const fallback = await fetch(
      `${ITUNES_BASE_URL}/search?term=${encodeURIComponent('top hits')}&media=music&entity=song&limit=${limit}`
    );
    const fallbackData: ITunesSearchResponse = await fallback.json();
    return fallbackData.results || [];
  } catch (error) {
    console.error('Error fetching charts:', error);
    return [];
  }
}

export function formatTrackDuration(millis: number): string {
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function getHighResArtwork(url: string, size = 600): string {
  // Replace the size in the artwork URL for higher resolution
  return url.replace(/\/\d+x\d+/, `/${size}x${size}`);
}

export interface Album {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl60: string;
  artworkUrl100: string;
  collectionPrice: number;
  trackCount: number;
  releaseDate: string;
  primaryGenreName: string;
  collectionViewUrl: string;
  copyright?: string;
}

export async function getTopAlbums(limit = 10): Promise<Album[]> {
  try {
    const response = await fetch(
      `${ITUNES_BASE_URL}/search?term=${encodeURIComponent('popular albums')}&media=music&entity=album&limit=${limit}&sort=recent`
    );
    const data: ITunesSearchResponse = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results as any;
    }
    
    // Fallback
    const fallback = await fetch(
      `${ITUNES_BASE_URL}/search?term=${encodeURIComponent('top albums 2024')}&media=music&entity=album&limit=${limit}`
    );
    const fallbackData: ITunesSearchResponse = await fallback.json();
    return (fallbackData.results || []) as any;
  } catch (error) {
    console.error('Error fetching top albums:', error);
    return [];
  }
}

export async function searchAlbums(query: string, limit = 10): Promise<Album[]> {
  try {
    const response = await fetch(
      `${ITUNES_BASE_URL}/search?term=${encodeURIComponent(query)}&media=music&entity=album&limit=${limit}`
    );
    const data: ITunesSearchResponse = await response.json();
    return (data.results || []) as any;
  } catch (error) {
    console.error('Error searching albums:', error);
    return [];
  }
}

export async function getAlbumTracks(collectionId: number): Promise<Track[]> {
  try {
    const response = await fetch(
      `${ITUNES_BASE_URL}/lookup?id=${collectionId}&entity=song`
    );
    const data = await response.json();
    
    // Filter out the album itself and return only tracks
    return data.results?.filter((item: any) => item.wrapperType === 'track') || [];
  } catch (error) {
    console.error('Error fetching album tracks:', error);
    return [];
  }
}
