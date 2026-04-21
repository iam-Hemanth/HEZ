import { useState, useEffect, useMemo } from "react";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { MovieRow } from "./components/MovieRow";
import { PlayerModal } from "./components/PlayerModal";
import { Movie } from "./types";
import { fetchTrending, fetchTrendingTV, fetchTopRated, fetchUpcoming, searchMedia } from "./services/tmdb";
import { Settings, LogOut, ChevronRight, UserCircle, KeySquare, MonitorPlay } from "lucide-react";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState("Home");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [trending, setTrending] = useState<Movie[]>([]);
  const [trendingTV, setTrendingTV] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    
    const loadAppData = async () => {
      setIsLoading(true);
      try {
        const [trendingData, trendingTVData, topRatedData, upcomingData] = await Promise.all([
          fetchTrending(),
          fetchTrendingTV(),
          fetchTopRated(),
          fetchUpcoming()
        ]);
        setTrending(trendingData);
        setTrendingTV(trendingTVData);
        setTopRated(topRatedData);
        setUpcoming(upcomingData);
      } catch (err) {
        console.error("Failed to fetch TMDB data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAppData();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    
    if (searchQuery.trim().length > 2) {
      const delayInfo = setTimeout(async () => {
        const results = await searchMedia(searchQuery);
        setSearchResults(results);
      }, 500);
      return () => clearTimeout(delayInfo);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, isLoggedIn]);

  const allMoviesCombined = useMemo(() => {
    const map = new Map<number, Movie>();
    [...trending, ...trendingTV, ...topRated, ...upcoming].forEach(m => map.set(m.id, m));
    return Array.from(map.values());
  }, [trending, trendingTV, topRated, upcoming]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-neutral-900 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -z-10 -translate-y-1/2 translate-x-1/2"></div>
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-3xl italic mx-auto mb-4 tracking-tighter">
              H
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
            <p className="text-neutral-400">Sign in to continue to Hemanth Entertainment Zone (HEZ)</p>
          </div>
          <button 
            onClick={() => {
              setIsLoggedIn(true);
              setActiveTab("Home");
            }} 
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white transition-colors shadow-lg shadow-blue-500/25"
          >
            Start Watching
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (searchQuery && searchResults) {
      return (
        <div className="px-6 md:px-12 py-8 mt-16 min-h-screen">
          <h2 className="text-2xl font-bold mb-6">Search Results for "{searchQuery}"</h2>
          <div className="flex flex-wrap gap-4">
            {searchResults.length > 0 ? (
              searchResults.map(movie => (
                <div key={movie.id} className="w-[130px] md:w-[150px] lg:w-[170px]" onClick={() => setSelectedMovie(movie)}>
                  <img 
                    src={movie.poster_path || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=500"} 
                    alt={movie.title} 
                    className="w-full aspect-[2/3] object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <p className="text-sm font-medium mt-2 truncate">{movie.title}</p>
                </div>
              ))
            ) : (
              <p className="text-neutral-400">No media found matching your search.</p>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === "Settings") {
      return (
        <div className="px-6 md:px-12 py-10 mt-16 min-h-screen max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 flex items-center text-white tracking-tight">
            Settings
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 transition-colors hover:bg-white/10 cursor-pointer flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
                  <UserCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Account Details</h3>
                  <p className="text-sm text-neutral-400">Manage your profile, email, and password</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 transition-colors hover:bg-white/10 cursor-pointer flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
                  <MonitorPlay className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Playback & Quality</h3>
                  <p className="text-sm text-neutral-400">Adjust video quality, autoplay, and subtitles</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 transition-colors hover:bg-white/10 cursor-pointer flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
                  <KeySquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Privacy & Safety</h3>
                  <p className="text-sm text-neutral-400">Manage your data, block list, and permissions</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
            </div>

          </div>
        </div>
      );
    }

    if (activeTab === "Logout") {
      return (
        <div className="px-6 md:px-8 py-8 mt-16 min-h-[60vh] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
            <LogOut className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Sign Out</h2>
          <p className="text-gray-400 max-w-sm mb-8">
            Are you sure you want to sign out of your Cineby account? You will need to log back in to access your library.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab("Home")} 
              className="px-6 py-2.5 rounded-xl font-medium text-white bg-white/10 hover:bg-white/20 transition-colors"
            >
              Cancel 
            </button>
            <button 
              onClick={() => {
                setIsLoggedIn(false);
                setActiveTab("Home");
              }} 
              className="px-6 py-2.5 rounded-xl font-medium text-white bg-red-600 hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20"
            >
              Confirm Logout
            </button>
          </div>
        </div>
      );
    }

    if (activeTab !== "Home") {
      let tabMovies: Movie[] = [];
      
      if (activeTab === "Recent") {
        tabMovies = [...allMoviesCombined].reverse();
      } else if (activeTab === "Discovery") {
        tabMovies = [...allMoviesCombined].sort(() => Math.random() - 0.5);
      } else if (activeTab === "Live Action") {
        tabMovies = allMoviesCombined.filter(m => !m.genre_ids.includes(16));
      } else if (activeTab === "Anime") {
        tabMovies = allMoviesCombined.filter(m => m.genre_ids.includes(16));
      } else if (activeTab === "Upcoming") {
        tabMovies = upcoming;
      } else if (activeTab === "Bookmarks") {
        return (
          <div className="px-6 md:px-8 py-8 mt-16 min-h-[60vh] flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-bold mb-4">{activeTab}</h2>
            <p className="text-gray-400 max-w-md">
              The {activeTab} section is currently under development. Check back later!
            </p>
          </div>
        );
      }

      return (
        <div className="px-6 md:px-8 py-8 mt-16 min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-8 flex items-center text-white tracking-tight">
            <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
            {activeTab}
          </h2>
          <div className="flex flex-wrap gap-4 md:gap-5">
            {tabMovies.map(movie => (
               <div key={movie.id} onClick={() => setSelectedMovie(movie)}>
                  <img 
                    src={movie.poster_path || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=500"} 
                    alt={movie.title} 
                    className="w-[130px] md:w-[150px] lg:w-[170px] aspect-[2/3] object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
               </div>
            ))}
            {tabMovies.length === 0 && (
              <p className="text-gray-400">No media found in this category.</p>
            )}
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-neutral-400">Loading data...</p>
        </div>
      );
    }

    return (
      <>
        {trending.length > 0 && <Hero onPlay={setSelectedMovie} heroMovie={trending[0]} />}
        <div className="relative z-20 flex flex-col gap-4 pb-20">
          <MovieRow title="Trending Movies" movies={trending.slice(1, 15)} onMovieClick={setSelectedMovie} />
          <MovieRow title="Trending TV Shows" movies={trendingTV.slice(0, 15)} onMovieClick={setSelectedMovie} />
          <MovieRow title="Top Rated Classics" movies={topRated} onMovieClick={setSelectedMovie} />
        </div>
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-blue-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 md:ml-64 w-full">
        <Navbar onSearch={setSearchQuery} />
        {renderContent()}
      </main>

      {selectedMovie && (
        <PlayerModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  );
}
