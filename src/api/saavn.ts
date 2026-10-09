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
