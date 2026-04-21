import { Play, X, Plus, Check, ThumbsUp, Volume2, Film } from "lucide-react";
import { useState, useEffect } from "react";
import { Movie, GENRES } from "../types";
import { fetchTVDetails, fetchMediaMetadata } from "../services/tmdb";

export function PlayerModal({ movie, onClose, isBookmarked = false, onToggleBookmark, onPlay }: { movie: Movie; onClose: () => void; isBookmarked?: boolean; onToggleBookmark?: (movie: Movie) => void; onPlay?: (movie: Movie) => void; }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrailer, setIsTrailer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [tvDetails, setTvDetails] = useState<any>(null);
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    setIsPlaying(false);
    setIsTrailer(false);
    setMetadata(null);
    setTvDetails(null);

    fetchMediaMetadata(movie.id, movie.media_type).then(data => setMetadata(data));

    if (movie?.media_type === 'tv') {
      fetchTVDetails(movie.id).then(data => {
        if (data) {
          setTvDetails(data);
          // Find the first valid season
          const firstValidSeason = data.seasons?.find((s: any) => s.season_number > 0);
          if (firstValidSeason) {
            setSelectedSeason(firstValidSeason.season_number);
          }
        }
      });
    }
  }, [movie]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!movie) return null;

  const trailerKey = metadata?.videos?.[0]?.key;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl shadow-black ring-1 ring-white/10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-neutral-900/50 hover:bg-neutral-800 rounded-full text-white backdrop-blur-md transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header / Player Area */}
        <div className="relative w-full aspect-video bg-black flex-none">
          {isPlaying ? (
            <iframe
              className="w-full h-full"
              src={isTrailer && trailerKey
                ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`
                : (movie.media_type === 'tv' 
                  ? `https://www.vidking.net/embed/tv/${movie.id}/${selectedSeason}/${selectedEpisode}`
                  : `https://www.vidking.net/embed/movie/${movie.id}`)
              }
              title="Movie Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <>
              <img 
                src={movie.backdrop_path || movie.poster_path} 
                alt={movie.title}
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center gap-6 group overflow-hidden">
                <button 
                  onClick={() => { setIsTrailer(false); setIsPlaying(true); }}
                  className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300 shadow-xl border border-white/30 group-hover:border-blue-400"
                  title="Play Full Media"
                >
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>
                {trailerKey && (
                  <button 
                    onClick={() => { setIsTrailer(true); setIsPlaying(true); }}
                    className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-xl border border-white/20"
                    title="Watch Trailer"
                  >
                    <Film className="w-6 h-6" />
                  </button>
                )}
                <div className="absolute bottom-4 right-4 p-2 bg-black/40 rounded-full text-white backdrop-blur-md hidden md:block">
                  <Volume2 className="w-4 h-4" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Movie Info */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar" style={{ overscrollBehavior: 'contain' }}>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">{movie.title}</h2>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-neutral-300 mb-6">
                <span className="text-green-400 font-bold text-base">{Math.round(movie.vote_average * 10)}% Match</span>
                <span>{movie.release_date?.substring(0, 4)}</span>
                <span className="px-2 py-0.5 border border-neutral-600 rounded text-xs">{movie.media_type === 'tv' ? 'TV-MA' : 'PG-13'}</span>
                {movie.media_type === 'tv' ? (
                  <span>{tvDetails?.number_of_seasons ? `${tvDetails.number_of_seasons} Seasons` : 'TV Series'}</span>
                ) : (
                  <span>{movie.duration || "2h 4m"}</span>
                )}
                <span className="px-2 py-0.5 border border-white/20 rounded text-xs text-white/80 bg-white/5">HD</span>
              </div>

              <p className="text-neutral-300 text-base md:text-lg leading-relaxed mb-8">
                {movie.overview}
              </p>
              
              {/* Cast & Crew from Metadata */}
              {metadata && metadata.cast?.length > 0 && (
                <div className="mb-8">
                  <div className="text-sm text-neutral-400 mb-1">
                    <span className="text-neutral-500">Starring: </span>
                    <span className="text-white">{metadata.cast.map((c: any) => c.name).join(', ')}</span>
                  </div>
                  {metadata.director && (
                    <div className="text-sm text-neutral-400">
                      <span className="text-neutral-500">Director: </span>
                      <span className="text-white">{metadata.director.name}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="w-full md:w-64 space-y-4 text-sm text-neutral-400 flex-none">
              <div>
                <span className="text-neutral-500">Genres: </span>
                <span className="text-white">
                  {movie.genre_ids?.map(id => GENRES[id]).filter(Boolean).join(", ")}
                </span>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button 
                  onClick={() => onToggleBookmark?.(movie)}
                  className="flex flex-col items-center gap-2 hover:text-white transition-colors group"
                >
                  <div className={`p-3 rounded-full border transition-all ${isBookmarked ? 'border-white bg-white/10 text-white' : 'border-neutral-600 group-hover:border-white group-hover:bg-white/5'}`}>
                    {isBookmarked ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                  <span className="text-xs">{isBookmarked ? "Added" : "My List"}</span>
                </button>
                <button className="flex flex-col items-center gap-2 hover:text-white transition-colors group">
                  <div className="p-3 rounded-full border border-neutral-600 group-hover:border-white group-hover:bg-white/5 transition-all">
                    <ThumbsUp className="w-5 h-5" />
                  </div>
                  <span className="text-xs">Rate</span>
                </button>
              </div>
            </div>
          </div>
          
          {movie.media_type === 'tv' && tvDetails && tvDetails.seasons && (
            <div className="mt-8 mb-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <span className="w-1 h-5 bg-blue-600 rounded-full mr-2"></span>
                Select Season & Episode
              </h3>
              
              {/* Seasons Row */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-4 border-b border-white/5">
                {tvDetails.seasons.filter((s: any) => s.season_number > 0).map((season: any) => (
                  <button 
                    key={season.id} 
                    onClick={() => { 
                      setSelectedSeason(season.season_number); 
                      setSelectedEpisode(1); 
                      setIsTrailer(false);
                      setIsPlaying(true); 
                    }}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                      selectedSeason === season.season_number 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {season.name}
                  </button>
                ))}
              </div>

              {/* Episodes Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 max-h-[140px] overflow-y-auto no-scrollbar pr-2">
                {Array.from({ length: tvDetails.seasons.find((s: any) => s.season_number === selectedSeason)?.episode_count || 0 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { 
                      setSelectedEpisode(i + 1); 
                      setIsTrailer(false);
                      setIsPlaying(true); 
                    }}
                    className={`w-full aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                      selectedEpisode === i + 1 && isPlaying && !isTrailer
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* More Like This */}
          {metadata && metadata.similar?.length > 0 && (
            <div className="mt-10 pt-10 border-t border-white/10">
               <h3 className="text-xl font-bold text-white mb-6">More Like This</h3>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                 {metadata.similar.map((sim: Movie) => (
                   <div key={sim.id} className="cursor-pointer group" onClick={() => onPlay && onPlay(sim)}>
                     <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2">
                       <img 
                         src={sim.poster_path} 
                         alt={sim.title} 
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                         referrerPolicy="no-referrer"
                       />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <Play className="w-8 h-8 text-white fill-current drop-shadow-xl" />
                       </div>
                     </div>
                     <p className="text-sm font-medium text-white/80 group-hover:text-white truncate">{sim.title}</p>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
           display: none;
        }
      `}</style>
    </div>
  );
}
