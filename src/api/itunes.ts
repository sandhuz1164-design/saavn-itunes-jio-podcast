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

export interface Artist {
  artistId: number;
  artistName: string;
  artistLinkUrl: string;
  artworkUrl100?: string;
  primaryGenreName?: string;
}

export async function getTopArtists(limit = 10): Promise<Artist[]> {
  try {
    const response = await fetch(
      `${ITUNES_BASE_URL}/search?term=${encodeURIComponent('popular artists')}&media=music&entity=allArtist&limit=${limit}`
    );
    const data: ITunesSearchResponse = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Deduplicate artists by artistId
      const seen = new Set<number>();
      const uniqueArtists = data.results.filter((item: any) => {
        if (seen.has(item.artistId)) return false;
        seen.add(item.artistId);
        return true;
      }).slice(0, limit);
      return uniqueArtists as any;
    }
    return [];
  } catch (error) {
    console.error('Error fetching top artists:', error);
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

export interface ITunesPodcast {
  wrapperType: string;
  kind: string;
  collectionId: number;
  trackId: number;
  artistName: string;
  collectionName: string;
  trackName: string;
  collectionCensoredName: string;
  trackCensoredName: string;
  collectionViewUrl: string;
  feedUrl: string;
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl100: string;
  collectionPrice: number;
  trackPrice: number;
  trackCount: number;
  country: string;
  currency: string;
  contentAdvisoryRating: string;
  artworkUrl600?: string;
  genres: string[];
  genreIds: string[];
  releaseDate: string;
  primaryGenreName?: string;
}

export async function searchPodcastsByCategory(category: string, limit = 10): Promise<ITunesPodcast[]> {
  try {
    const response = await fetch(
      `${ITUNES_BASE_URL}/search?term=${encodeURIComponent(category + ' podcast')}&media=podcast&limit=${limit}&entity=podcast`
    );
    const data = await response.json();
    return (data.results || []) as ITunesPodcast[];
  } catch (error) {
    console.error(`Error fetching ${category} podcasts:`, error);
    return [];
  }
}

export async function searchAllPodcasts(query: string, limit = 20): Promise<ITunesPodcast[]> {
  try {
    const response = await fetch(
      `${ITUNES_BASE_URL}/search?term=${encodeURIComponent(query)}&media=podcast&limit=${limit}&entity=podcast`
    );
    const data = await response.json();
    return (data.results || []) as ITunesPodcast[];
  } catch (error) {
    console.error('Error searching podcasts:', error);
    return [];
  }
}

export interface PodcastEpisodeITunes {
  wrapperType: string;
  kind: string;
  collectionId: number;
  trackId: number;
  artistName: string;
  collectionName: string;
  trackName: string;
  collectionCensoredName: string;
  trackCensoredName: string;
  collectionViewUrl: string;
  feedUrl: string;
  trackViewUrl: string;
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl100: string;
  artworkUrl600?: string;
  releaseDate: string;
  collectionExplicitness: string;
  trackExplicitness: string;
  trackCount: number;
  trackNumber: number;
  trackTimeMillis: number;
  country: string;
  currency: string;
  primaryGenreName: string;
  previewUrl?: string;
  description?: string;
}

export async function getPodcastEpisodesITunes(collectionId: number): Promise<PodcastEpisodeITunes[]> {
  try {
    const response = await fetch(
      `${ITUNES_BASE_URL}/lookup?id=${collectionId}&entity=podcastEpisode&limit=200`
    );
    const data = await response.json();
    // Filter to only episodes (not the podcast itself)
    return (data.results || []).filter((item: any) => item.wrapperType === 'podcastEpisode') as PodcastEpisodeITunes[];
  } catch (error) {
    console.error('Error fetching podcast episodes:', error);
    return [];
  }
}

export const PODCAST_CATEGORIES = [
  { name: 'Technology', emoji: '💻', color: 'from-blue-600 to-cyan-600' },
  { name: 'Business', emoji: '💼', color: 'from-amber-600 to-orange-600' },
  { name: 'Comedy', emoji: '😂', color: 'from-yellow-500 to-red-500' },
  { name: 'Science', emoji: '🔬', color: 'from-emerald-600 to-teal-600' },
  { name: 'Health', emoji: '🏥', color: 'from-rose-500 to-pink-600' },
  { name: 'Education', emoji: '📚', color: 'from-indigo-600 to-purple-600' },
  { name: 'Sports', emoji: '⚽', color: 'from-green-600 to-emerald-600' },
  { name: 'Music', emoji: '🎵', color: 'from-violet-600 to-fuchsia-600' },
  { name: 'News', emoji: '📰', color: 'from-red-600 to-rose-600' },
  { name: 'True Crime', emoji: '🔍', color: 'from-gray-700 to-gray-900' },
  { name: 'History', emoji: '🏛️', color: 'from-amber-700 to-yellow-800' },
  { name: 'Culture', emoji: '🎭', color: 'from-pink-600 to-purple-700' },
] as const;
