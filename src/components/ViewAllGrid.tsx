import { useState, useEffect, useRef, useCallback } from "react";
import { Movie } from "../types";
import { ChevronLeft } from "lucide-react";

export function ViewAllGrid({ 
  title, 
  fetchMore, 
  onBack, 
  onMovieClick 
}: { 
  title: string; 
  fetchMore: (page: number) => Promise<Movie[]>; 
  onBack: () => void; 
  onMovieClick: (m: Movie) => void;
}) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  
  const lastMovieElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    let active = true;
    const loadMovies = async () => {
      setLoading(true);
      try {
        const newMovies = await fetchMore(page);
        if (active) {
          if (newMovies.length === 0) setHasMore(false);
          // Deduplicate IDs
          setMovies(prev => {
            const all = [...prev, ...newMovies];
            return Array.from(new Map(all.map(m => [m.id, m])).values());
          });
        }
      } catch (err) {
        console.error("Failed to load more", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    
    loadMovies();
    return () => { active = false; };
  }, [page, fetchMore]);

  return (
    <div className="px-6 md:px-12 py-8 mt-16 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack} 
          className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors group"
        >
          <ChevronLeft className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors" />
        </button>
        <h2 className="text-2xl md:text-3xl font-bold flex items-center text-white tracking-tight">
          {title}
        </h2>
      </div>

      <div className="flex flex-wrap gap-4 md:gap-5">
        {movies.map((movie, index) => {
          const isLastElement = movies.length === index + 1;
          return (
            <div 
              ref={isLastElement ? lastMovieElementRef : null} 
              key={`${movie.id}-${index}`}
              onClick={() => onMovieClick(movie)}
              className="w-[130px] md:w-[150px] lg:w-[170px]"
            >
              <img 
                src={movie.poster_path || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=500"} 
                alt={movie.title} 
                className="w-full aspect-[2/3] object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg"
                referrerPolicy="no-referrer"
              />
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="flex justify-center mt-10 pb-10">
          <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
