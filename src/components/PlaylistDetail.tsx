import { useState, useEffect } from 'react';
import { Playlist, PlaylistSong, getPlaylistDetails, getImageUrl, formatDuration } from '../api/saavn';

interface PlaylistDetailProps {
  playlist: Playlist;
  onBack: () => void;
  onPlaySong: (song: PlaylistSong) => void;
  onPlayAll: (songs: PlaylistSong[], startIndex: number) => void;
  currentSong: PlaylistSong | null;
  isPlaying: boolean;
}

export default function PlaylistDetail({ playlist, onBack, onPlaySong, onPlayAll, currentSong, isPlaying }: PlaylistDetailProps) {
  const [songs, setSongs] = useState<PlaylistSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const songsPerPage = 10;

  useEffect(() => {
    loadSongs();
  }, [playlist.id]);

  const loadSongs = async () => {
    setIsLoading(true);
    const data = await getPlaylistDetails(playlist.id);
    if (data) {
      setSongs(data.songs);
    }
    setIsLoading(false);
  };

  // Pagination logic
  const totalPages = Math.ceil(songs.length / songsPerPage);
  const startIndex = (currentPage - 1) * songsPerPage;
  const endIndex = startIndex + songsPerPage;
  const currentSongs = songs.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      setIsPlayingAll(true);
      onPlayAll(songs, 0);
    }
  };

  const handlePlaySong = (song: PlaylistSong, index: number) => {
    onPlaySong(song);
    setIsPlayingAll(true);
  };

  const imageUrl = getImageUrl(playlist.image, '500x500');
  const totalDuration = songs.reduce((acc, song) => acc + (song.duration || 0), 0);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative -mx-4 -mt-6 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/30 via-purple-900/20 to-gray-900" />
        {imageUrl && (
          <div className="absolute inset-0 opacity-20 blur-3xl scale-110">
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full w-fit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to playlists
          </button>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
            {/* Cover Art */}
            <div className="flex-shrink-0">
              <div className="relative group">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={playlist.name}
                    className="w-56 h-56 md:w-64 md:h-64 rounded-2xl object-cover shadow-2xl shadow-orange-500/40 ring-1 ring-white/10"
                  />
                ) : (
                  <div className="w-56 h-56 md:w-64 md:h-64 rounded-2xl bg-gradient-to-br from-orange-600 via-red-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-orange-500/40">
                    <svg className="w-24 h-24 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
                    </svg>
                  </div>
                )}
                {isPlaying && currentSong && (
                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
                    <div className="flex gap-0.5">
                      <div className="w-1 h-3 bg-orange-400 rounded-full animate-pulse" />
                      <div className="w-1 h-4 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
                      <div className="w-1 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                    </div>
                    <span className="text-xs font-medium text-white">Playing</span>
                  </div>
                )}
              </div>
            </div>

            {/* Playlist Info */}
            <div className="flex-1 text-center md:text-left pb-2">
              <div className="inline-block bg-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-1 mb-3">
                <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">Playlist</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-3 drop-shadow-2xl">
                {playlist.name}
              </h1>
              
              {playlist.description && (
                <p className="text-gray-300 text-base md:text-lg mb-4 line-clamp-2 max-w-2xl">
                  {playlist.description}
                </p>
              )}

              <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
                {playlist.artists?.primary && playlist.artists.primary.length > 0 && (
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                    <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span className="text-sm font-medium text-white">
                      {playlist.artists.primary.map(a => a.name).join(', ')}
                    </span>
                  </div>
                )}
                {songs.length > 0 && (
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                    <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                    <span className="text-sm font-medium text-white">
                      {songs.length} songs
                    </span>
                  </div>
                )}
                {totalDuration > 0 && (
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                    <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                    <span className="text-sm font-medium text-white">
                      {Math.floor(totalDuration / 60)} min
                    </span>
                  </div>
                )}
                {playlist.language && (
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-sm font-medium text-white">
                      🌐 {playlist.language}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <button
                  onClick={handlePlayAll}
                  disabled={songs.length === 0 || isLoading}
                  className="group relative px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-full font-bold text-base transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 disabled:scale-100 disabled:shadow-none flex items-center gap-3"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play All
                  <span className="text-sm font-normal opacity-80">({songs.length} songs)</span>
                </button>

                {playlist.url && (
                  <a
                    href={playlist.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-medium transition-all flex items-center gap-2 border border-white/20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open Original
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Songs Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
              </svg>
            </div>
            All Songs
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-800/30 rounded-xl p-4 flex items-center gap-4">
                <div className="w-8 h-5 bg-gray-700 rounded" />
                <div className="w-14 h-14 bg-gray-700 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-700 rounded w-2/3" />
                  <div className="h-4 bg-gray-700 rounded w-1/3" />
                </div>
                <div className="w-12 h-5 bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        ) : songs.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/20 rounded-2xl">
            <svg className="w-20 h-20 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <p className="text-gray-400 text-lg font-medium">No songs found in this playlist</p>
            <p className="text-gray-500 text-sm mt-2">Try another playlist</p>
          </div>
        ) : (
          <>
            {/* Songs List */}
            <div className="bg-gradient-to-b from-gray-800/30 to-gray-900/30 rounded-2xl overflow-hidden border border-gray-700/30">
              {/* Header */}
              <div className="grid grid-cols-[40px_56px_1fr_auto_auto] gap-4 px-4 py-3 border-b border-gray-700/50 text-xs font-medium text-gray-400 uppercase tracking-wider">
                <div className="text-center">#</div>
                <div></div>
                <div>Title</div>
                <div className="hidden sm:block">Duration</div>
                <div className="w-10"></div>
              </div>

              <div className="divide-y divide-gray-800/50">
                {currentSongs.map((song, index) => {
                  const songImageUrl = getImageUrl(song.image, '150x150');
                  const isCurrentSong = currentSong?.id === song.id;
                  const globalIndex = startIndex + index;

                  return (
                    <button
                      key={song.id || `${globalIndex}`}
                      onClick={() => handlePlaySong(song, globalIndex)}
                      className={`group grid grid-cols-[40px_56px_1fr_auto_auto] gap-4 px-4 py-3 transition-all duration-200 hover:bg-white/5 w-full text-left ${
                        isCurrentSong && isPlaying
                          ? 'bg-orange-600/10 border-l-4 border-l-orange-500'
                          : ''
                      }`}
                    >
                      {/* Song number */}
                      <div className="flex items-center justify-center">
                        {isCurrentSong && isPlaying ? (
                          <div className="flex items-center gap-0.5">
                            <div className="w-1 h-3 bg-orange-400 rounded-full animate-pulse" />
                            <div className="w-1 h-4 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
                            <div className="w-1 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                          </div>
                        ) : (
                          <span className={`text-sm font-medium ${isCurrentSong ? 'text-orange-400' : 'text-gray-500'}`}>
                            {globalIndex + 1}
                          </span>
                        )}
                      </div>

                      {/* Song artwork */}
                      <div className="relative">
                        {songImageUrl ? (
                          <img
                            src={songImageUrl}
                            alt={song.name}
                            className="w-14 h-14 rounded-lg object-cover shadow-md"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-600/50 to-red-600/50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-0 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            {isCurrentSong && isPlaying ? (
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            ) : (
                              <path d="M8 5v14l11-7z" />
                            )}
                          </svg>
                        </div>
                      </div>

                      {/* Song info */}
                      <div className="min-w-0 flex flex-col justify-center">
                        <p className={`text-sm font-semibold truncate ${isCurrentSong && isPlaying ? 'text-orange-400' : 'text-white'}`}>
                          {song.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {song.artists?.primary?.map(a => a.name).join(', ') || 'Unknown Artist'}
                          {song.album?.name && ` • ${song.album.name}`}
                        </p>
                      </div>

                      {/* Duration */}
                      <div className="hidden sm:flex items-center">
                        {song.duration && (
                          <span className="text-sm text-gray-400 font-medium">
                            {formatDuration(song.duration)}
                          </span>
                        )}
                      </div>

                      {/* Play indicator */}
                      <div className="flex items-center justify-center w-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isCurrentSong && isPlaying
                            ? 'bg-orange-600 text-white'
                            : 'bg-white/5 text-gray-400 group-hover:bg-orange-600 group-hover:text-white'
                        }`}>
                          <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            {isCurrentSong && isPlaying ? (
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            ) : (
                              <path d="M8 5v14l11-7z" />
                            )}
                          </svg>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Page Info */}
            {totalPages > 1 && (
              <div className="text-center mt-4 text-gray-500 text-sm">
                Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, songs.length)} of {songs.length} songs
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
