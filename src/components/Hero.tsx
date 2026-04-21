import { Play, Plus, Info } from "lucide-react";
import { Movie } from "../types";

export function Hero({ onPlay, heroMovie }: { onPlay: (movie: Movie) => void; heroMovie?: Movie }) {
  if (!heroMovie) return null;

  return (
    <section className="px-6 md:px-8 pt-6 pb-2 md:pb-8 flex-1 flex flex-col space-y-8">
      <div className="relative h-[340px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl group flex flex-col justify-end">
        {/* Background Image & Gradients */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src={heroMovie.backdrop_path || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=1920"}
            alt={heroMovie.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 md:px-10 py-10 max-w-2xl">
          <div className="flex items-center space-x-2 text-xs font-medium text-gray-300 mb-3 drop-shadow-sm">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Premium</span>
            <span>{heroMovie.vote_average ? heroMovie.vote_average.toFixed(1) : ''} Rating &bull; {heroMovie.release_date ? heroMovie.release_date.substring(0, 4) : ''}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-none drop-shadow-md">
            {heroMovie.title}
          </h1>

          <p className="text-gray-300 text-sm md:text-sm leading-relaxed mb-6 drop-shadow-sm line-clamp-2 md:line-clamp-3">
            {heroMovie.overview}
          </p>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onPlay(heroMovie)}
              className="bg-white text-black px-8 py-2.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-all flex items-center space-x-2 shadow-lg"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch Now</span>
            </button>
            <button className="glass px-6 py-2.5 rounded-full font-bold text-sm hover:bg-white/10 transition-all text-white flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add to List
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
