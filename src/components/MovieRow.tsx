import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "../types";
import { MovieCard } from "./MovieCard";

export function MovieRow({ title, movies, onMovieClick, onViewAll }: { title: string; movies: Movie[]; onMovieClick: (m: Movie) => void; onViewAll?: () => void }) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-2 xl:py-4 relative group">
      <div className="flex items-center justify-between mb-4 px-6 md:px-8">
        <h2 className="text-lg font-bold flex items-center text-white tracking-tight">
          <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
          {title}
        </h2>
        {onViewAll && (
          <button onClick={onViewAll} className="text-xs text-blue-500 hover:text-blue-400 font-semibold cursor-pointer transition-colors bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full">
            View All
          </button>
        )}
      </div>
      
      <div className="relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-r from-[#050505] to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
        >
          <ChevronLeft className="w-8 h-8 text-white drop-shadow-md hover:scale-110 transition-transform" />
        </button>

        <div 
          ref={rowRef}
          className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar px-6 md:px-8 pb-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-l from-[#050505] to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-8 h-8 text-white drop-shadow-md hover:scale-110 transition-transform" />
        </button>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
