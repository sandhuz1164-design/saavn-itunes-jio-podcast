import { useState, useEffect } from 'react';
import { RadioStation, getTopStations, getStationsByGenre, getStationsByCountry, searchStations, RADIO_GENRES, RADIO_COUNTRIES } from '../api/radio';

interface RadioProps {
  onPlayStation: (station: RadioStation) => void;
  currentStation: RadioStation | null;
  isPlaying: boolean;
}

export default function Radio({ onPlayStation, currentStation, isPlaying }: RadioProps) {
  const [topStations, setTopStations] = useState<RadioStation[]>([]);
  const [genreStations, setGenreStations] = useState<Record<string, RadioStation[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RadioStation[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadRadioData();
  }, []);

  const loadRadioData = async () => {
    setIsLoading(true);
    try {
      // Load top stations
      const top = await getTopStations(20);
      setTopStations(top);

      // Load stations for each genre
      const genrePromises = RADIO_GENRES.slice(0, 6).map(async (genre) => {
        const stations = await getStationsByGenre(genre.name, 10);
        return { genre: genre.name, stations };
      });

      const genreResults = await Promise.all(genrePromises);
      const genreMap: Record<string, RadioStation[]> = {};
      genreResults.forEach(({ genre, stations }) => {
        genreMap[genre] = stations;
      });
      setGenreStations(genreMap);
    } catch (error) {
      console.error('Error loading radio data:', error);
    }
    setIsLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const results = await searchStations(searchQuery, 20);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleGenreClick = async (genre: string) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null);
      return;
    }
    setSelectedGenre(genre);
    
    // Load genre stations if not already loaded
    if (!genreStations[genre]) {
      const stations = await getStationsByGenre(genre, 20);
      setGenreStations(prev => ({ ...prev, [genre]: stations }));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </div>
          <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Radio
          </span>
        </h1>
        <p className="text-gray-400 text-lg">
          Live radio stations from around the world
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search radio stations..."
            className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium text-white transition-colors"
            >
              Search
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Search Results ({searchResults.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((station) => (
              <StationCard
                key={station.stationuuid}
                station={station}
                isPlaying={currentStation?.stationuuid === station.stationuuid && isPlaying}
                onClick={() => onPlayStation(station)}
              />
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-8 bg-gray-700 rounded w-48 mb-4 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="animate-pulse bg-gray-800/30 rounded-xl p-4 h-32" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Genre Filter */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Browse by Genre</h2>
            <div className="flex flex-wrap gap-3">
              {RADIO_GENRES.map((genre) => (
                <button
                  key={genre.name}
                  onClick={() => handleGenreClick(genre.name)}
                  className={`px-5 py-3 rounded-xl font-medium transition-all ${
                    selectedGenre === genre.name
                      ? `bg-gradient-to-r ${genre.color} text-white shadow-lg scale-105`
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
                  }`}
                >
                  <span className="mr-2">{genre.emoji}</span>
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Genre Stations */}
          {selectedGenre && genreStations[selectedGenre] && genreStations[selectedGenre].length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-3xl">{RADIO_GENRES.find(g => g.name === selectedGenre)?.emoji}</span>
                {selectedGenre} Stations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {genreStations[selectedGenre].map((station) => (
                  <StationCard
                    key={station.stationuuid}
                    station={station}
                    isPlaying={currentStation?.stationuuid === station.stationuuid && isPlaying}
                    onClick={() => onPlayStation(station)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Top Stations */}
          {topStations.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <svg className="w-7 h-7 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Top Stations Worldwide
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topStations.map((station) => (
                  <StationCard
                    key={station.stationuuid}
                    station={station}
                    isPlaying={currentStation?.stationuuid === station.stationuuid && isPlaying}
                    onClick={() => onPlayStation(station)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Genres */}
          {Object.entries(genreStations).filter(([genre]) => genre !== selectedGenre).map(([genre, stations]) => (
            stations.length > 0 && (
              <div key={genre} className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-3xl">{RADIO_GENRES.find(g => g.name === genre)?.emoji}</span>
                  {genre} Stations
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stations.slice(0, 6).map((station) => (
                    <StationCard
                      key={station.stationuuid}
                      station={station}
                      isPlaying={currentStation?.stationuuid === station.stationuuid && isPlaying}
                      onClick={() => onPlayStation(station)}
                    />
                  ))}
                </div>
              </div>
            )
          ))}
        </>
      )}
    </div>
  );
}

// Station Card Component
interface StationCardProps {
  station: RadioStation;
  isPlaying: boolean;
  onClick: () => void;
}

function StationCard({ station, isPlaying, onClick }: StationCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 text-left w-full ${
        isPlaying
          ? 'bg-gradient-to-br from-red-600/20 to-orange-600/20 border-2 border-red-500/50 shadow-lg shadow-red-500/20'
          : 'bg-gray-800/30 hover:bg-gray-700/50 border border-gray-700/50 hover:border-red-500/30'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Station Icon */}
        <div className={`w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden ${
          station.favicon ? 'bg-white' : 'bg-gradient-to-br from-red-500 to-orange-500'
        }`}>
          {station.favicon ? (
            <img
              src={station.favicon}
              alt={station.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = `
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                `;
              }}
            />
          ) : (
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          )}
        </div>

        {/* Station Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm mb-1 line-clamp-2 ${
            isPlaying ? 'text-red-300' : 'text-white group-hover:text-red-300'
          }`}>
            {station.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {station.country && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {station.country}
              </span>
            )}
            {station.tags && (
              <span className="truncate">• {station.tags.split(',')[0]}</span>
            )}
          </div>
          {station.bitrate > 0 && (
            <div className="mt-1 text-xs text-gray-500">
              {station.bitrate} kbps • {station.codec}
            </div>
          )}
        </div>

        {/* Play Indicator */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
          isPlaying
            ? 'bg-red-600 text-white'
            : 'bg-gray-700/50 text-gray-400 group-hover:bg-red-600 group-hover:text-white'
        }`}>
          {isPlaying ? (
            <div className="flex gap-0.5">
              <div className="w-1 h-4 bg-white rounded-full animate-pulse" />
              <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
              <div className="w-1 h-5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            </div>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
