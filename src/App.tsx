import { useState, useEffect, useCallback } from 'react';
import { searchPodcasts, getPodcastEpisodes, PodcastSearchResult, PodcastEpisode, getImageUrl } from './api/saavn';
import PodcastCard from './components/PodcastCard';
import EpisodeList from './components/EpisodeList';
import AudioPlayer from './components/AudioPlayer';

type View = 'home' | 'search' | 'podcast-detail';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PodcastSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<PodcastSearchResult | null>(null);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [trendingPodcasts, setTrendingPodcasts] = useState<PodcastSearchResult[]>([]);
  const [episodePage, setEpisodePage] = useState(0);
  const [hasMoreEpisodes, setHasMoreEpisodes] = useState(true);

  // Load trending podcasts on mount
  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    const results = await searchPodcasts('trending', 0, 12);
    setTrendingPodcasts(results);
  };

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setView('search');
    const results = await searchPodcasts(query, 0, 20);
    setSearchResults(results);
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
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
    setCurrentEpisode(null);
  };

  const handleBack = () => {
    if (view === 'podcast-detail') {
      setView('search');
      setSelectedPodcast(null);
    } else if (view === 'search') {
      setView('home');
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <button
              onClick={() => { setView('home'); setSearchQuery(''); setSearchResults([]); }}
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
                    if (e.key === 'Enter') handleSearch(searchQuery);
                  }}
                  placeholder="Search podcasts..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setSearchResults([]); setView('home'); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Search button */}
            <button
              onClick={() => handleSearch(searchQuery)}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-sm font-medium transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-4 py-6 ${showPlayer ? 'pb-32' : 'pb-6'}`}>
        {/* Home View */}
        {view === 'home' && (
          <div>
            {/* Hero Section */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Discover Podcasts
                </span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Search and listen to podcasts from JioSaavn. Find your favorite shows, explore new topics, and enjoy audio content.
              </p>
            </div>

            {/* Quick Search Categories */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-4">Popular Categories</h2>
              <div className="flex flex-wrap gap-2">
                {['Technology', 'Business', 'Comedy', 'Science', 'Health', 'Education', 'Sports', 'Music', 'News', 'True Crime', 'History', 'Culture'].map(category => (
                  <button
                    key={category}
                    onClick={() => { setSearchQuery(category); handleSearch(category); }}
                    className="px-4 py-2 bg-gray-800/50 hover:bg-purple-600/20 border border-gray-700/50 hover:border-purple-500/30 rounded-full text-sm text-gray-300 hover:text-purple-300 transition-all"
                  >
                    {category}
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

            {/* Spotify Section */}
            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-green-900/20 to-gray-900/50 border border-green-800/30">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-white">Also available on Spotify</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Spotify podcasts require API authentication. Browse the JioSaavn catalog above for instant access, or visit Spotify for their full podcast library.
                  </p>
                </div>
                <a
                  href="https://open.spotify.com/search/podcasts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-500 rounded-full text-sm font-medium text-white transition-colors flex-shrink-0"
                >
                  Open Spotify →
                </a>
              </div>
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

            {isSearching ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-800/30 rounded-xl p-4">
                    <div className="w-full aspect-square rounded-lg bg-gray-700 mb-3" />
                    <div className="h-4 bg-gray-700 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
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
      </main>

      {/* Audio Player */}
      {showPlayer && (
        <AudioPlayer
          episode={currentEpisode}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
}
