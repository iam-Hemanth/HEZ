import { Play } from "lucide-react";
import React from "react";
import { Movie } from "../types";

export const MovieCard: React.FC<{ movie: Movie; onClick: (m: Movie) => void }> = ({ movie, onClick }) => {
  return (
    <div 
      className="movie-card relative group cursor-pointer flex-none w-[130px] md:w-[150px] lg:w-[170px]"
      onClick={() => onClick(movie)}
    >
      <div className="h-44 md:h-52 bg-gray-800 rounded-xl overflow-hidden mb-2 border border-white/5 shadow-lg relative">
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        
        {/* Play Icon overlay on hover inside the image box */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center">
          <div className="bg-blue-600/90 text-white p-3 rounded-full shadow-lg shadow-blue-600/40 transform scale-90 group-hover:scale-100 transition-all duration-300">
             <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>
      
      <h3 className="text-xs font-bold text-white truncate px-1">{movie.title}</h3>
      <div className="flex justify-between items-center px-1 mt-0.5">
        <span className="text-[10px] text-gray-500">{movie.release_date.substring(0, 4)} &bull; Movie</span>
        <span className="text-[10px] text-yellow-500 font-bold">{movie.vote_average.toFixed(1)}</span>
      </div>
    </div>
  );
}
