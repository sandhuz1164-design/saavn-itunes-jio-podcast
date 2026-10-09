const BASE_URL = 'https://saavn.dev/api';

export interface PodcastSearchResult {
  id: string;
  name: string;
  type: string;
  image: Array<{ quality: string; url: string }>;
  url: string;
  description?: string;
  language?: string;
  year?: number;
  artists?: {
    primary: Array<{ name: string; id: string }>;
  };
}

export interface PodcastEpisode {
  id: string;
  name: string;
  type: string;
  year?: number;
  releaseDate?: string;
  duration?: number;
  language?: string;
  url: string;
  image: Array<{ quality: string; url: string }>;
  downloadUrl?: Array<{ quality: string; url: string }>;
  artists?: {
    primary: Array<{ name: string; id: string }>;
  };
  description?: string;
}

export interface PodcastDetails {
  id: string;
  name: string;
  description?: string;
  type: string;
  image: Array<{ quality: string; url: string }>;
  url: string;
  language?: string;
  year?: number;
  artists?: {
    primary: Array<{ name: string; id: string }>;
  };
  seasons?: Array<{
    id: string;
    name: string;
    episodes: PodcastEpisode[];
  }>;
  episodes?: PodcastEpisode[];
}

export async function searchPodcasts(query: string, page = 0, limit = 20): Promise<PodcastSearchResult[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search/podcasts?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    const data = await response.json();
    if (data.success && data.data?.results) {
      return data.data.results;
    }
    return [];
  } catch (error) {
    console.error('Error searching podcasts:', error);
    return [];
  }
}

export async function getPodcastDetails(id: string): Promise<PodcastDetails | null> {
  try {
    const response = await fetch(`${BASE_URL}/podcasts/${id}`);
    const data = await response.json();
    if (data.success && data.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching podcast details:', error);
    return null;
  }
}

export async function getPodcastEpisodes(id: string, page = 0, limit = 20): Promise<PodcastEpisode[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/podcasts/${id}/episodes?page=${page}&limit=${limit}`
    );
    const data = await response.json();
    if (data.success && data.data?.results) {
      return data.data.results;
    }
    return [];
  } catch (error) {
    console.error('Error fetching podcast episodes:', error);
    return [];
  }
}

export async function getSongDetails(id: string): Promise<PodcastEpisode | null> {
  try {
    const response = await fetch(`${BASE_URL}/songs/${id}`);
    const data = await response.json();
    if (data.success && data.data?.results?.[0]) {
      return data.data.results[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching song details:', error);
    return null;
  }
}

export function getImageUrl(images: Array<{ quality: string; url: string }>, quality = '500x500'): string {
  if (!images || images.length === 0) return '';
  const found = images.find(img => img.quality === quality);
  if (found) return found.url;
  return images[images.length - 1]?.url || '';
}

export function getDownloadUrl(episode: PodcastEpisode): string {
  if (episode.downloadUrl && episode.downloadUrl.length > 0) {
    // Prefer 320kbps, then 160kbps, then any available
    const high = episode.downloadUrl.find(u => u.quality === '320kbps');
    if (high) return high.url;
    const med = episode.downloadUrl.find(u => u.quality === '160kbps');
    if (med) return med.url;
    return episode.downloadUrl[episode.downloadUrl.length - 1]?.url || '';
  }
  return '';
}

export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export interface Playlist {
  id: string;
  name: string;
  type: string;
  image: Array<{ quality: string; url: string }>;
  url: string;
  songCount?: number;
  language?: string;
  description?: string;
  explicitContent?: boolean;
  artists?: {
    primary: Array<{ name: string; id: string }>;
  };
}

export interface PlaylistSong {
  id: string;
  name: string;
  type: string;
  year?: number;
  duration?: number;
  language?: string;
  url: string;
  image: Array<{ quality: string; url: string }>;
  downloadUrl?: Array<{ quality: string; url: string }>;
  artists?: {
    primary: Array<{ name: string; id: string }>;
    all: Array<{ name: string; id: string }>;
  };
  album?: {
    name: string;
    url: string;
  };
}

export async function searchPlaylists(query: string, page = 0, limit = 10): Promise<Playlist[]> {
  // Using iTunes API as fallback since saavn.dev is down
  try {
    const ITUNES_BASE_URL = 'https://itunes.apple.com';
    const response = await fetch(
      `${ITUNES_BASE_URL}/search?term=${encodeURIComponent(query)}&media=music&entity=album&limit=${limit}`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Convert iTunes albums to Playlist format
      const playlists: Playlist[] = data.results.map((item: any, index: number) => ({
        id: `itunes-${item.collectionId || index}`,
        name: item.collectionName || 'Unknown Playlist',
        type: 'playlist',
        image: [
          { quality: '500x500', url: item.artworkUrl100?.replace('100x100', '500x500') || '' },
          { quality: '150x150', url: item.artworkUrl100 || '' }
        ],
        url: item.collectionViewUrl || '',
        songCount: item.trackCount || 0,
        language: item.primaryGenreName || 'Unknown',
        description: `Curated playlist featuring ${item.artistName}`,
        artists: {
          primary: [{ name: item.artistName || 'Unknown Artist', id: `artist-${index}` }]
        }
      }));
      return playlists;
    }
    return [];
  } catch (error) {
    console.error('Error searching playlists:', error);
    return [];
  }
}

export async function getTopPlaylists(limit = 10): Promise<Playlist[]> {
  // Since saavn.dev API is down, using iTunes API as fallback
  try {
    const ITUNES_BASE_URL = 'https://itunes.apple.com';
    const queries = ['top hits', 'popular music', 'trending', 'best of', 'greatest hits'];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    
    const response = await fetch(
      `${ITUNES_BASE_URL}/search?term=${encodeURIComponent(randomQuery)}&media=music&entity=album&limit=${limit}`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Convert iTunes albums to Playlist format
      const playlists: Playlist[] = data.results.map((item: any, index: number) => ({
        id: `itunes-${item.collectionId || index}`,
        name: item.collectionName || 'Unknown Playlist',
        type: 'playlist',
        image: [
          { quality: '500x500', url: item.artworkUrl100?.replace('100x100', '500x500') || '' },
          { quality: '150x150', url: item.artworkUrl100 || '' }
        ],
        url: item.collectionViewUrl || '',
        songCount: item.trackCount || 0,
        language: item.primaryGenreName || 'Unknown',
        description: `Curated playlist featuring ${item.artistName}`,
        artists: {
          primary: [{ name: item.artistName || 'Unknown Artist', id: `artist-${index}` }]
        }
      }));
      return playlists;
    }
    return [];
  } catch (error) {
    console.error('Error fetching top playlists:', error);
    return [];
  }
}

export async function getPlaylistDetails(id: string): Promise<{ playlist: Playlist; songs: PlaylistSong[] } | null> {
  try {
    // For iTunes-based playlists, extract the collection ID
    if (id.startsWith('itunes-')) {
      const collectionId = id.replace('itunes-', '');
      const ITUNES_BASE_URL = 'https://itunes.apple.com';
      
      // First, get the album/playlist info
      const lookupResponse = await fetch(`${ITUNES_BASE_URL}/lookup?id=${collectionId}&entity=song`);
      const lookupData = await lookupResponse.json();
      
      if (lookupData.results && lookupData.results.length > 0) {
        const playlistInfo = lookupData.results[0];
        const songs: PlaylistSong[] = lookupData.results
          .filter((item: any) => item.wrapperType === 'track')
          .map((item: any, index: number) => ({
            id: `song-${item.trackId || index}`,
            name: item.trackName || 'Unknown Song',
            type: 'song',
            year: item.releaseDate ? new Date(item.releaseDate).getFullYear() : undefined,
            duration: item.trackTimeMillis ? Math.floor(item.trackTimeMillis / 1000) : undefined,
            language: item.primaryGenreName || 'Unknown',
            url: item.trackViewUrl || '',
            image: [
              { quality: '500x500', url: item.artworkUrl100?.replace('100x100', '500x500') || '' },
              { quality: '150x150', url: item.artworkUrl100 || '' }
            ],
            downloadUrl: item.previewUrl ? [{ quality: '320kbps', url: item.previewUrl }] : [],
            artists: {
              primary: [{ name: item.artistName || 'Unknown Artist', id: `artist-${index}` }],
              all: [{ name: item.artistName || 'Unknown Artist', id: `artist-${index}` }]
            },
            album: {
              name: item.collectionName || 'Unknown Album',
              url: item.collectionViewUrl || ''
            }
          }));
        
        const playlist: Playlist = {
          id: id,
          name: playlistInfo.collectionName || 'Unknown Playlist',
          type: 'playlist',
          image: [
            { quality: '500x500', url: playlistInfo.artworkUrl100?.replace('100x100', '500x500') || '' },
            { quality: '150x150', url: playlistInfo.artworkUrl100 || '' }
          ],
          url: playlistInfo.collectionViewUrl || '',
          songCount: songs.length,
          language: playlistInfo.primaryGenreName || 'Unknown',
          description: `Curated playlist featuring ${playlistInfo.artistName}`,
          artists: {
            primary: [{ name: playlistInfo.artistName || 'Unknown Artist', id: 'artist-0' }]
          }
        };
        
        return { playlist, songs };
      }
    }
    
    // Fallback to saavn.dev API (if it comes back online)
    const response = await fetch(`${BASE_URL}/playlists/${id}`);
    const data = await response.json();
    if (data.success && data.data) {
      return {
        playlist: data.data,
        songs: data.data.songs || []
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching playlist details:', error);
    return null;
  }
}
