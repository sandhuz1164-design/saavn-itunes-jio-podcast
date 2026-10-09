import { useState, useRef, useEffect } from 'react';
import { RadioStation } from '../api/radio';

interface RadioPlayerProps {
  station: RadioStation | null;
  onClose: () => void;
}

export default function RadioPlayer({ station, onClose }: RadioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (station && audioRef.current) {
      setError(null);
      setIsLoading(true);
      audioRef.current.src = station.url_resolved;
      audioRef.current.volume = volume;
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      }).catch((err) => {
        console.error('Error playing station:', err);
        setError('Unable to play this station');
        setIsLoading(false);
      });
    }
  }, [station]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      }).catch(() => {
        setError('Unable to play this station');
        setIsLoading(false);
      });
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  if (!station) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-red-500/30 backdrop-blur-xl z-50">
      <audio ref={audioRef} />
      
      {/* Live Indicator */}
      <div className="w-full px-4 pt-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
              {isPlaying ? 'Live' : 'Paused'}
            </span>
          </div>
          {station.bitrate > 0 && (
            <span className="text-xs text-gray-500">
              {station.bitrate} kbps
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 pb-3 pt-1">
        {/* Station info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-500 to-orange-500">
            {station.favicon ? (
              <img
                src={station.favicon}
                alt={station.name}
                className="w-full h-full object-contain bg-white"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{station.name}</p>
            <p className="text-gray-400 text-xs truncate">
              {station.country} {station.tags && `• ${station.tags.split(',')[0]}`}
            </p>
          </div>
        </div>

        {/* Playback controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-500 text-white transition-all hover:scale-105 disabled:opacity-50 shadow-lg shadow-red-500/30"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Volume & Close */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="hidden sm:flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500
                [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full 
                [&::-moz-range-thumb]:bg-red-500 [&::-moz-range-thumb]:border-0"
            />
          </div>
          {station.homepage && (
            <a
              href={station.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-400 transition-colors"
              title="Visit station website"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            title="Close player"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 pb-2">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
