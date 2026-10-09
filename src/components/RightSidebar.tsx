import { useState, useEffect } from 'react';
import { getTopArtists, getTopCharts, Artist, Track } from '../api/itunes';
import ArtistCard from './ArtistCard';
import SongCard from './SongCard';

interface RightSidebarProps {
  onPlaySong: (track: Track) => void;
  currentSong: Track | null;
  isPlaying: boolean;
}

export default function RightSidebar({ onPlaySong, currentSong, isPlaying }: RightSidebarProps) {
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [topSongs, setTopSongs] = useState<Track[]>([]);
  const [isLoadingArtists, setIsLoadingArtists] = useState(true);
  const [isLoadingSongs, setIsLoadingSongs] = useState(true);

  useEffect(() => {
    loadArtists();
    loadSongs();
  }, []);

  const loadArtists = async () => {
    setIsLoadingArtists(true);
    const artists = await getTopArtists(10);
    setTopArtists(artists);
    setIsLoadingArtists(false);
  };

  const loadSongs = async () => {
    setIsLoadingSongs(true);
    const songs = await getTopCharts(10);
    setTopSongs(songs);
    setIsLoadingSongs(false);
  };

  return (
    <aside className="w-80 flex-shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-6">
        {/* Top 10 Artists */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 rounded-2xl border border-gray-700/50 backdrop-blur-xl overflow-hidden">
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Top Artists
                </span>
              </h3>
              <button
                onClick={loadArtists}
                className="text-xs text-gray-400 hover:text-purple-400 transition-colors"
                title="Refresh"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {isLoadingArtists ? (
              <div className="space-y-2">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3 p-3">
                    <div className="w-6 h-4 bg-gray-700 rounded" />
                    <div className="w-12 h-12 rounded-full bg-gray-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : topArtists.length > 0 ? (
              <div className="space-y-1">
                {topArtists.map((artist, index) => (
                  <ArtistCard
                    key={artist.artistId}
                    artist={artist}
                    rank={index + 1}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 text-sm">
                Unable to load artists
              </div>
            )}
          </div>
        </div>

        {/* Top 10 Songs */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 rounded-2xl border border-gray-700/50 backdrop-blur-xl overflow-hidden">
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                </div>
                <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                  Top Songs
                </span>
              </h3>
              <button
                onClick={loadSongs}
                className="text-xs text-gray-400 hover:text-green-400 transition-colors"
                title="Refresh"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-2 max-h-[500px] overflow-y-auto custom-scrollbar">
            {isLoadingSongs ? (
              <div className="space-y-2">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3 p-3">
                    <div className="w-6 h-4 bg-gray-700 rounded" />
                    <div className="w-12 h-12 rounded-lg bg-gray-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : topSongs.length > 0 ? (
              <div className="space-y-1">
                {topSongs.map((track, index) => (
                  <SongCard
                    key={track.trackId}
                    track={track}
                    index={index}
                    isPlaying={currentSong?.trackId === track.trackId && isPlaying}
                    onClick={() => onPlaySong(track)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 text-sm">
                Unable to load songs
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
