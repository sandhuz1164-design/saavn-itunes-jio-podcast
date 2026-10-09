import { useState, useEffect, useCallback } from 'react';
import { searchPodcasts, getPodcastEpisodes, PodcastSearchResult, PodcastEpisode, getImageUrl, getTopPlaylists, searchPlaylists, Playlist, PlaylistSong } from './api/saavn';
import { getTopCharts, searchTracks, Track, getTopAlbums, searchAlbums, Album, searchPodcastsByCategory, PODCAST_CATEGORIES, ITunesPodcast } from './api/itunes';
import { RadioStation } from './api/radio';
import PodcastCard from './components/PodcastCard';
import EpisodeList from './components/EpisodeList';
import AudioPlayer from './components/AudioPlayer';
import SongCard from './components/SongCard';
import SongPlayer from './components/SongPlayer';
import AlbumCard from './components/AlbumCard';
import AlbumDetail from './components/AlbumDetail';
import ITunesPodcastCard from './components/ITunesPodcastCard';
import ITunesPodcastDetail from './components/ITunesPodcastDetail';
import PlaylistCard from './components/PlaylistCard';
import PlaylistDetail from './components/PlaylistDetail';
import Sidebar from './components/Sidebar';
import Radio from './components/Radio';
import RadioPlayer from './components/RadioPlayer';
import ArtistCard from './components/ArtistCard';
import { getTopArtists, Artist } from './api/itunes';

export type View = 'home' | 'search' | 'podcast-detail' | 'songs' | 'album-detail' | 'itunes-podcast-detail' | 'playlist-detail' | 'radio';
type SearchType = 'podcasts' | 'songs' | 'albums' | 'playlists';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('podcasts');
  const [searchResults, setSearchResults] = useState<PodcastSearchResult[]>([]);
  const [songResults, setSongResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<PodcastSearchResult | null>(null);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [trendingPodcasts, setTrendingPodcasts] = useState<PodcastSearchResult[]>([]);
  const [episodePage, setEpisodePage] = useState(0);
  const [hasMoreEpisodes, setHasMoreEpisodes] = useState(true);
  
  // Song state
  const [currentSong, setCurrentSong] = useState<Track | null>(null);
  const [showSongPlayer, setShowSongPlayer] = useState(false);
  
  // Album state
  const [topAlbums, setTopAlbums] = useState<Album[]>([]);
  const [albumResults, setAlbumResults] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isLoadingAlbums, setIsLoadingAlbums] = useState(false);

  // iTunes Podcast state
  const [selectedITunesPodcast, setSelectedITunesPodcast] = useState<ITunesPodcast | null>(null);

  // Categorized podcasts state
  const [categorizedPodcasts, setCategorizedPodcasts] = useState<Record<string, ITunesPodcast[]>>({});
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  // Playlist state
  const [topPlaylists, setTopPlaylists] = useState<Playlist[]>([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [playlistResults, setPlaylistResults] = useState<Playlist[]>([]);
  const [currentPlaylistSong, setCurrentPlaylistSong] = useState<PlaylistSong | null>(null);
  const [showPlaylistPlayer, setShowPlaylistPlayer] = useState(false);
  const [playlistQueue, setPlaylistQueue] = useState<PlaylistSong[]>([]);
  const [playlistQueueIndex, setPlaylistQueueIndex] = useState(0);

  // Radio state
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [showRadioPlayer, setShowRadioPlayer] = useState(false);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Top Artists state
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [isLoadingArtists, setIsLoadingArtists] = useState(false);

  // Load trending podcasts, top albums, categorized podcasts, playlists, and top artists on mount
  useEffect(() => {
    loadTrending();
    loadTopAlbums();
    loadCategorizedPodcasts();
    loadTopPlaylists();
    loadTopArtists();
  }, []);

  const loadTrending = async () => {
    const results = await searchPodcasts('trending', 0, 12);
    setTrendingPodcasts(results);
  };

  const loadTopArtists = async () => {
    setIsLoadingArtists(true);
    const artists = await getTopArtists(10);
    setTopArtists(artists);
    setIsLoadingArtists(false);
  };



  const loadTopAlbums = async () => {
    setIsLoadingAlbums(true);
    const albums = await getTopAlbums(10);
    setTopAlbums(albums);
    setIsLoadingAlbums(false);
  };

  const loadCategorizedPodcasts = async () => {
    setIsLoadingCategories(true);
    try {
      // Fetch podcasts for all 12 categories in parallel
      // ~9-10 podcasts per category to total ~110
      const results = await Promise.all(
        PODCAST_CATEGORIES.map(async (category) => {
          const podcasts = await searchPodcastsByCategory(category.name, 10);
          return { category: category.name, podcasts };
        })
      );

      // Convert to a record for easy lookup
      const podcastRecord: Record<string, ITunesPodcast[]> = {};
      results.forEach(({ category, podcasts }) => {
        podcastRecord[category] = podcasts;
      });
      setCategorizedPodcasts(podcastRecord);
      
      // Set initial random category
      setCurrentCategoryIndex(Math.floor(Math.random() * PODCAST_CATEGORIES.length));
    } catch (error) {
      console.error('Error loading categorized podcasts:', error);
    }
    setIsLoadingCategories(false);
  };

  const shuffleToRandomCategory = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * PODCAST_CATEGORIES.length);
    } while (newIndex === currentCategoryIndex && PODCAST_CATEGORIES.length > 1);
    setCurrentCategoryIndex(newIndex);
  };

  const loadTopPlaylists = async () => {
    setIsLoadingPlaylists(true);
    const playlists = await getTopPlaylists(10);
    setTopPlaylists(playlists);
    setIsLoadingPlaylists(false);
  };

  const handleSearch = useCallback(async (query: string, type: SearchType) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSongResults([]);
      setAlbumResults([]);
      setPlaylistResults([]);
      return;
    }
    setIsSearching(true);
    setSearchType(type);
    setView('search');

    if (type === 'podcasts') {
      const results = await searchPodcasts(query, 0, 20);
      setSearchResults(results);
      setSongResults([]);
      setAlbumResults([]);
      setPlaylistResults([]);
    } else if (type === 'songs') {
      const results = await searchTracks(query, 10);
      setSongResults(results);
      setSearchResults([]);
      setAlbumResults([]);
      setPlaylistResults([]);
    } else if (type === 'albums') {
      const results = await searchAlbums(query, 10);
      setAlbumResults(results);
      setSearchResults([]);
      setSongResults([]);
      setPlaylistResults([]);
    } else if (type === 'playlists') {
      const results = await searchPlaylists(query, 0, 10);
      setPlaylistResults(results);
      setSearchResults([]);
      setSongResults([]);
      setAlbumResults([]);
    }
    setIsSearching(false);
  }, []);

  const handlePodcastClick = async (podcast: PodcastSearchResult) => {
    setSelectedPodcast(podcast);
    setView('podcast-detail');
    setIsLoadingEpisodes(true);
    setEpisodePage(0);
    setHasMoreEpisodes(true);
    const eps = await getPodcastEpisodes(podcast.id, 0, 20);
    setEpisodes(eps);
    setHasMoreEpisodes(eps.length >= 20);
    setIsLoadingEpisodes(false);
  };

  const loadMoreEpisodes = async () => {
    if (!selectedPodcast || !hasMoreEpisodes) return;
    const nextPage = episodePage + 1;
    setIsLoadingEpisodes(true);
    const moreEps = await getPodcastEpisodes(selectedPodcast.id, nextPage, 20);
    setEpisodes(prev => [...prev, ...moreEps]);
    setEpisodePage(nextPage);
    setHasMoreEpisodes(moreEps.length >= 20);
    setIsLoadingEpisodes(false);
  };

  const handlePlayEpisode = (episode: PodcastEpisode) => {
    setCurrentEpisode(episode);
    setShowPlayer(true);
    // Stop song if playing
    setShowSongPlayer(false);
    setCurrentSong(null);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
    setCurrentEpisode(null);
  };

  const handlePlaySong = (track: Track) => {
    setCurrentSong(track);
    setShowSongPlayer(true);
    // Stop podcast if playing
    setShowPlayer(false);
    setCurrentEpisode(null);
  };

  const handleCloseSongPlayer = () => {
    setShowSongPlayer(false);
    setCurrentSong(null);
  };

  const handleAlbumClick = (album: Album) => {
    setSelectedAlbum(album);
    setView('album-detail');
  };

  const handleBack = () => {
    if (view === 'podcast-detail') {
      setView('search');
      setSelectedPodcast(null);
    } else if (view === 'album-detail') {
      setView('search');
      setSelectedAlbum(null);
    } else if (view === 'itunes-podcast-detail') {
      setView('home');
      setSelectedITunesPodcast(null);
    } else if (view === 'playlist-detail') {
      setView('home');
      setSelectedPlaylist(null);
    } else if (view === 'search') {
      setView('home');
      setSearchQuery('');
      setSearchResults([]);
      setSongResults([]);
      setAlbumResults([]);
      setPlaylistResults([]);
    } else if (view === 'songs') {
      setView('home');
    }
  };

  const handleITunesPodcastClick = (podcast: ITunesPodcast) => {
    setSelectedITunesPodcast(podcast);
    setView('itunes-podcast-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setView('playlist-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayPlaylistSong = (song: PlaylistSong) => {
    setCurrentPlaylistSong(song);
    setShowPlaylistPlayer(true);
    // Stop other players
    setShowPlayer(false);
    setShowSongPlayer(false);
    setCurrentEpisode(null);
    setCurrentSong(null);
  };

  const handlePlayAll = (songs: PlaylistSong[], startIndex: number) => {
    setPlaylistQueue(songs);
    setPlaylistQueueIndex(startIndex);
    if (songs[startIndex]) {
      setCurrentPlaylistSong(songs[startIndex]);
      setShowPlaylistPlayer(true);
      // Stop other players
      setShowPlayer(false);
      setShowSongPlayer(false);
      setCurrentEpisode(null);
      setCurrentSong(null);
    }
  };

  const handleSongEnded = () => {
    // Auto-advance to next song in queue
    if (playlistQueue.length > 0 && playlistQueueIndex < playlistQueue.length - 1) {
      const nextIndex = playlistQueueIndex + 1;
      setPlaylistQueueIndex(nextIndex);
      setCurrentPlaylistSong(playlistQueue[nextIndex]);
    } else {
      // Queue finished
      setPlaylistQueue([]);
      setPlaylistQueueIndex(0);
    }
  };

  const handleClosePlaylistPlayer = () => {
    setShowPlaylistPlayer(false);
    setCurrentPlaylistSong(null);
    setPlaylistQueue([]);
    setPlaylistQueueIndex(0);
  };

  // Radio handlers
  const handlePlayStation = (station: RadioStation) => {
    setCurrentStation(station);
    setShowRadioPlayer(true);
    // Stop other players
    setShowPlayer(false);
    setShowSongPlayer(false);
    setShowPlaylistPlayer(false);
    setCurrentEpisode(null);
    setCurrentSong(null);
    setCurrentPlaylistSong(null);
  };

  const handleCloseRadioPlayer = () => {
    setShowRadioPlayer(false);
    setCurrentStation(null);
  };

  // Sidebar navigation
  const handleSidebarNavigate = (newView: View) => {
    setView(newView);
    setSidebarOpen(false);
  };

  const playerActive = showPlayer || showSongPlayer || showPlaylistPlayer;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Left Sidebar */}
      <Sidebar
        currentView={view}
        onNavigate={handleSidebarNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden w-10 h-10 rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Main Content with left margin for sidebar */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <button
                onClick={() => { setView('home'); setSearchQuery(''); setSearchResults([]); setSongResults([]); }}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z"/>
                </svg>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hidden sm:block">
                PodCaster
              </span>
            </button>

            {/* Search bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch(searchQuery, searchType);
                  }}
                  placeholder={`Search ${searchType === 'podcasts' ? 'podcasts' : 'songs'}...`}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setSearchResults([]); setSongResults([]); setView('home'); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Search type toggle */}
            <div className="hidden sm:flex items-center bg-gray-800/50 rounded-lg p-0.5 border border-gray-700/50">
              <button
                onClick={() => setSearchType('podcasts')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  searchType === 'podcasts' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Podcasts
              </button>
              <button
                onClick={() => setSearchType('songs')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  searchType === 'songs' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Songs
              </button>
              <button
                onClick={() => setSearchType('albums')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  searchType === 'albums' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Albums
              </button>
              <button
                onClick={() => setSearchType('playlists')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  searchType === 'playlists' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Playlists
              </button>
            </div>

            {/* Search button */}
            <button
              onClick={() => handleSearch(searchQuery, searchType)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                searchType === 'songs' 
                  ? 'bg-green-600 hover:bg-green-500' 
                  : searchType === 'albums'
                  ? 'bg-blue-600 hover:bg-blue-500'
                  : searchType === 'playlists'
                  ? 'bg-orange-600 hover:bg-orange-500'
                  : 'bg-purple-600 hover:bg-purple-500'
              }`}
            >
              Search
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-4 py-6 ${playerActive ? 'pb-32' : 'pb-6'}`}>
        {/* Home View */}
        {view === 'home' && (
          <div>
            {/* Hero Section */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-green-400 bg-clip-text text-transparent">
                  Music, Albums & Podcasts
                </span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Discover podcasts from JioSaavn, top songs and albums from Apple Music. Search, browse, and enjoy audio content all in one place.
              </p>
            </div>

            {/* Top 10 Playlists Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
                      </svg>
                    </div>
                    <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                      Featured Playlists
                    </span>
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 ml-13">Curated collections for every mood</p>
                </div>
                <button
                  onClick={loadTopPlaylists}
                  className="text-sm text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-1 bg-gray-800/50 hover:bg-gray-800 px-4 py-2 rounded-full border border-gray-700/50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>

              {isLoadingPlaylists ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="animate-pulse rounded-2xl overflow-hidden">
                      <div className="aspect-square bg-gray-700" />
                      <div className="bg-gray-800 p-4 space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-3/4" />
                        <div className="h-3 bg-gray-700 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : topPlaylists.length > 0 ? (
                <>
                  {/* Featured Playlist Hero */}
                  {topPlaylists[0] && (
                    <button
                      onClick={() => handlePlaylistClick(topPlaylists[0])}
                      className="group relative w-full rounded-3xl overflow-hidden mb-6 text-left"
                    >
                      <div className="aspect-[3/1] md:aspect-[4/1] relative">
                        {getImageUrl(topPlaylists[0].image, '500x500') ? (
                          <img
                            src={getImageUrl(topPlaylists[0].image, '500x500')}
                            alt={topPlaylists[0].name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-500 via-red-500 to-purple-600" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        
                        <div className="absolute inset-0 p-6 md:p-10 flex items-end">
                          <div className="flex-1">
                            <div className="inline-block bg-orange-600/80 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
                              <span className="text-xs font-bold text-white uppercase tracking-wider">⭐ Featured</span>
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black text-white mb-2 drop-shadow-2xl">
                              {topPlaylists[0].name}
                            </h3>
                            {topPlaylists[0].description && (
                              <p className="text-white/80 text-sm md:text-base mb-4 max-w-xl line-clamp-2">
                                {topPlaylists[0].description}
                              </p>
                            )}
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-orange-600 shadow-xl shadow-orange-500/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                              <div className="flex items-center gap-3 text-white/80 text-sm">
                                {topPlaylists[0].songCount && (
                                  <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                                    </svg>
                                    {topPlaylists[0].songCount} songs
                                  </span>
                                )}
                                {topPlaylists[0].language && (
                                  <span>• {topPlaylists[0].language}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  )}

                  {/* Remaining Playlists Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {topPlaylists.slice(1).map((playlist, index) => (
                      <PlaylistCard
                        key={playlist.id}
                        playlist={playlist}
                        index={index + 1}
                        onClick={() => handlePlaylistClick(playlist)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-gray-400 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl border border-gray-700/30">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
                  </svg>
                  <p className="text-lg font-medium">Unable to load playlists</p>
                  <p className="text-sm mt-1 mb-4">Please check your connection and try again</p>
                  <button
                    onClick={loadTopPlaylists}
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-full text-sm font-medium text-white transition-all shadow-lg shadow-orange-500/30"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>

            {/* Top 10 Albums Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
                    </svg>
                  </div>
                  Top 10 Albums
                </h2>
                <button
                  onClick={loadTopAlbums}
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {isLoadingAlbums ? (
                  [...Array(10)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-800/30 rounded-xl p-4">
                      <div className="w-full aspect-square rounded-lg bg-gray-700 mb-3" />
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-700 rounded w-1/2" />
                    </div>
                  ))
                ) : topAlbums.length > 0 ? (
                  topAlbums.map((album) => (
                    <AlbumCard
                      key={album.collectionId}
                      album={album}
                      onClick={() => handleAlbumClick(album)}
                    />
                  ))
                ) : (
                  <div className="col-span-full p-8 text-center text-gray-400">
                    <p>Unable to load albums. Please try again.</p>
                    <button
                      onClick={loadTopAlbums}
                      className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Click on an album to view tracks • Data from Apple Music
              </p>
            </div>

            {/* Categorized Podcasts - Show one random category at a time */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  Explore Podcasts
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={shuffleToRandomCategory}
                    className="text-sm text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1 bg-gray-800/50 hover:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700/50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Shuffle
                  </button>
                  <button
                    onClick={loadCategorizedPodcasts}
                    className="text-sm text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1 bg-gray-800/50 hover:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700/50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>

              {isLoadingCategories ? (
                <div>
                  <div className="h-6 bg-gray-700 rounded w-32 mb-4 animate-pulse" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[...Array(10)].map((_, j) => (
                      <div key={j} className="animate-pulse bg-gray-800/30 rounded-xl p-3">
                        <div className="w-full aspect-square rounded-lg bg-gray-700 mb-3" />
                        <div className="h-3 bg-gray-700 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-700 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                (() => {
                  const category = PODCAST_CATEGORIES[currentCategoryIndex];
                  const podcasts = categorizedPodcasts[category.name] || [];
                  
                  if (podcasts.length === 0) return null;

                  return (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-2xl">{category.emoji}</span>
                        {category.name}
                        <span className="text-sm text-gray-500 font-normal">
                          ({podcasts.length} podcasts)
                        </span>
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {podcasts.map((podcast) => (
                          <ITunesPodcastCard
                            key={podcast.collectionId}
                            podcast={podcast}
                            onClick={() => handleITunesPodcastClick(podcast)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()
              )}

              <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Showing one random category at a time • Click shuffle to see another • Data from Apple Podcasts
              </p>
            </div>

            {/* Quick Song Search */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-4">Search Songs</h2>
              <div className="flex flex-wrap gap-2">
                {['Taylor Swift', 'Ed Sheeran', 'Arijit Singh', 'The Weeknd', 'Dua Lipa', 'Drake', 'Billie Eilish', 'BTS', 'Imagine Dragons', 'Coldplay'].map(artist => (
                  <button
                    key={artist}
                    onClick={() => { setSearchQuery(artist); setSearchType('songs'); handleSearch(artist, 'songs'); }}
                    className="px-4 py-2 bg-gray-800/50 hover:bg-green-600/20 border border-gray-700/50 hover:border-green-500/30 rounded-full text-sm text-gray-300 hover:text-green-300 transition-all"
                  >
                    🎵 {artist}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Album Search */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-4">Search Albums</h2>
              <div className="flex flex-wrap gap-2">
                {['Midnights', 'After Hours', 'Divide', 'Thriller', '21', '1989', 'Lover', 'Future Nostalgia', 'Beauty Behind the Madness', 'Starboy'].map(album => (
                  <button
                    key={album}
                    onClick={() => { setSearchQuery(album); setSearchType('albums'); handleSearch(album, 'albums'); }}
                    className="px-4 py-2 bg-gray-800/50 hover:bg-blue-600/20 border border-gray-700/50 hover:border-blue-500/30 rounded-full text-sm text-gray-300 hover:text-blue-300 transition-all"
                  >
                    💿 {album}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Podcasts */}
            {trendingPodcasts.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.59.59 3.82 0 2.76-2.07 4.98-4.8 5.02z"/>
                  </svg>
                  Trending Podcasts
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {trendingPodcasts.map((podcast, index) => (
                    <PodcastCard
                      key={podcast.id || index}
                      podcast={podcast}
                      onClick={() => handlePodcastClick(podcast)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Info Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/20 to-gray-900/50 border border-purple-800/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">JioSaavn Podcasts</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Full-length podcast episodes from JioSaavn's catalog. Search and listen to thousands of podcasts across all genres.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-r from-green-900/20 to-gray-900/50 border border-green-800/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Apple Music Songs</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Top songs with 30-second previews. Search your favorite artists and listen to previews. Links to full tracks on Apple Music.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/20 to-gray-900/50 border border-blue-800/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Apple Music Albums</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Browse top albums with full track listings. Click on any album to explore its tracks and play previews.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-900/20 to-gray-900/50 border border-orange-800/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">JioSaavn Playlists</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Curated playlists from JioSaavn with full song listings. Click on any playlist to browse and play songs.
                </p>
              </div>
            </div>

            {/* Top Artists Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  Top Artists
                </h2>
                <button
                  onClick={loadTopArtists}
                  className="text-sm text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>

              {isLoadingArtists ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="w-full aspect-square rounded-full bg-gray-700 mb-3" />
                      <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto" />
                    </div>
                  ))}
                </div>
              ) : topArtists.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {topArtists.map((artist, index) => (
                    <ArtistCard
                      key={artist.artistId}
                      artist={artist}
                      rank={index + 1}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 bg-gray-800/30 rounded-xl">
                  <p>Unable to load artists. Please try again.</p>
                  <button
                    onClick={loadTopArtists}
                    className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm text-white transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Results View */}
        {view === 'search' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handleBack}
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-xl font-semibold text-white">
                {isSearching ? 'Searching...' : `Results for "${searchQuery}"`}
              </h2>
            </div>

            {/* Search type tabs for mobile */}
            <div className="flex sm:hidden items-center gap-2 mb-4">
              <button
                onClick={() => handleSearch(searchQuery, 'podcasts')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  searchType === 'podcasts' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                Podcasts
              </button>
              <button
                onClick={() => handleSearch(searchQuery, 'songs')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  searchType === 'songs' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                Songs
              </button>
              <button
                onClick={() => handleSearch(searchQuery, 'albums')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  searchType === 'albums' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                Albums
              </button>
              <button
                onClick={() => handleSearch(searchQuery, 'playlists')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  searchType === 'playlists' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                Playlists
              </button>
            </div>

            {isSearching ? (
              searchType === 'podcasts' || searchType === 'albums' || searchType === 'playlists' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-800/30 rounded-xl p-4">
                      <div className="w-full aspect-square rounded-lg bg-gray-700 mb-3" />
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-700 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800/30 rounded-2xl p-4 space-y-3">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-4 p-3">
                      <div className="w-8 h-4 bg-gray-700 rounded" />
                      <div className="w-12 h-12 rounded-lg bg-gray-700" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-1/2" />
                        <div className="h-3 bg-gray-700 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : searchType === 'podcasts' ? (
              searchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {searchResults.map((podcast, index) => (
                    <PodcastCard
                      key={podcast.id || index}
                      podcast={podcast}
                      onClick={() => handlePodcastClick(podcast)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <svg className="w-20 h-20 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-xl text-gray-400">No podcasts found</p>
                  <p className="text-gray-500 mt-2">Try a different search term</p>
                </div>
              )
            ) : songResults.length > 0 ? (
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/30 overflow-hidden">
                <div className="p-4 border-b border-gray-700/30">
                  <p className="text-sm text-gray-400">
                    Found {songResults.length} songs • 30-second previews
                  </p>
                </div>
                <div className="divide-y divide-gray-800/50">
                  {songResults.map((track, index) => (
                    <SongCard
                      key={track.trackId}
                      track={track}
                      index={index}
                      isPlaying={currentSong?.trackId === track.trackId && showSongPlayer}
                      onClick={() => handlePlaySong(track)}
                    />
                  ))}
                </div>
              </div>
            ) : searchType === 'albums' ? (
              albumResults.length > 0 ? (
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-400">
                      Found {albumResults.length} albums
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {albumResults.map((album) => (
                      <AlbumCard
                        key={album.collectionId}
                        album={album}
                        onClick={() => handleAlbumClick(album)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <svg className="w-20 h-20 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
                  </svg>
                  <p className="text-xl text-gray-400">No albums found</p>
                  <p className="text-gray-500 mt-2">Try searching for a different artist or album</p>
                </div>
              )
            ) : searchType === 'playlists' ? (
              playlistResults.length > 0 ? (
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-400">
                      Found {playlistResults.length} playlists
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {playlistResults.map((playlist, index) => (
                      <PlaylistCard
                        key={playlist.id}
                        playlist={playlist}
                        index={index}
                        onClick={() => handlePlaylistClick(playlist)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <svg className="w-20 h-20 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
                  </svg>
                  <p className="text-xl text-gray-400">No playlists found</p>
                  <p className="text-gray-500 mt-2">Try searching for a different topic or mood</p>
                </div>
              )
            ) : (
              <div className="text-center py-16">
                <svg className="w-20 h-20 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <p className="text-xl text-gray-400">No songs found</p>
                <p className="text-gray-500 mt-2">Try searching for a different artist or song</p>
              </div>
            )}
          </div>
        )}

        {/* Podcast Detail View */}
        {view === 'podcast-detail' && selectedPodcast && (
          <div>
            {/* Back button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to results
            </button>

            {/* Podcast header */}
            <div className="flex flex-col sm:flex-row gap-6 mb-8">
              <div className="w-48 h-48 flex-shrink-0 mx-auto sm:mx-0">
                {getImageUrl(selectedPodcast.image, '500x500') ? (
                  <img
                    src={getImageUrl(selectedPodcast.image, '500x500')}
                    alt={selectedPodcast.name}
                    className="w-full h-full rounded-2xl object-cover shadow-2xl shadow-purple-500/20"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className="text-xs text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full uppercase tracking-wider font-medium">
                  Podcast
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mt-3">
                  {selectedPodcast.name}
                </h1>
                {selectedPodcast.description && (
                  <p className="text-gray-400 mt-3 line-clamp-3 text-sm sm:text-base">
                    {selectedPodcast.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-4 justify-center sm:justify-start">
                  {selectedPodcast.language && (
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      {selectedPodcast.language}
                    </span>
                  )}
                  {selectedPodcast.year && (
                    <span className="text-sm text-gray-400">
                      📅 {selectedPodcast.year}
                    </span>
                  )}
                  {selectedPodcast.artists?.primary && selectedPodcast.artists.primary.length > 0 && (
                    <span className="text-sm text-gray-400">
                      🎙️ {selectedPodcast.artists.primary.map(a => a.name).join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Episodes */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Episodes ({episodes.length})
              </h2>
              <EpisodeList
                episodes={episodes}
                currentEpisode={currentEpisode}
                onPlay={handlePlayEpisode}
                isLoading={isLoadingEpisodes && episodes.length === 0}
              />
              {hasMoreEpisodes && episodes.length > 0 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={loadMoreEpisodes}
                    disabled={isLoadingEpisodes}
                    className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-all disabled:opacity-50"
                  >
                    {isLoadingEpisodes ? 'Loading...' : 'Load More Episodes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Album Detail View */}
        {view === 'album-detail' && selectedAlbum && (
          <AlbumDetail
            album={selectedAlbum}
            onBack={handleBack}
            onPlayTrack={handlePlaySong}
            currentTrack={currentSong}
            isPlaying={showSongPlayer}
          />
        )}

        {/* iTunes Podcast Detail View */}
        {view === 'itunes-podcast-detail' && selectedITunesPodcast && (
          <ITunesPodcastDetail
            podcast={selectedITunesPodcast}
            onBack={handleBack}
          />
        )}

        {/* Playlist Detail View */}
        {view === 'playlist-detail' && selectedPlaylist && (
          <PlaylistDetail
            playlist={selectedPlaylist}
            onBack={handleBack}
            onPlaySong={handlePlayPlaylistSong}
            onPlayAll={handlePlayAll}
            currentSong={currentPlaylistSong}
            isPlaying={showPlaylistPlayer}
          />
        )}

        {/* Radio View */}
        {view === 'radio' && (
          <Radio
            onPlayStation={handlePlayStation}
            currentStation={currentStation}
            isPlaying={showRadioPlayer}
          />
        )}
      </main>

      {/* Podcast Audio Player */}
      {showPlayer && (
        <AudioPlayer
          episode={currentEpisode}
          onClose={handleClosePlayer}
        />
      )}

      {/* Song Player */}
      {showSongPlayer && (
        <SongPlayer
          track={currentSong}
          onClose={handleCloseSongPlayer}
        />
      )}

      {/* Playlist Song Player */}
      {showPlaylistPlayer && currentPlaylistSong && (
        <AudioPlayer
          episode={{
            id: currentPlaylistSong.id,
            name: currentPlaylistSong.name,
            type: 'song',
            year: currentPlaylistSong.year,
            duration: currentPlaylistSong.duration,
            language: currentPlaylistSong.language,
            url: currentPlaylistSong.url,
            image: currentPlaylistSong.image,
            downloadUrl: currentPlaylistSong.downloadUrl,
            artists: currentPlaylistSong.artists,
          }}
          onClose={handleClosePlaylistPlayer}
          onEnded={handleSongEnded}
        />
      )}

      {/* Radio Player */}
      {showRadioPlayer && currentStation && (
        <RadioPlayer
          station={currentStation}
          onClose={handleCloseRadioPlayer}
        />
      )}
      </div>
    </div>
  );
}
