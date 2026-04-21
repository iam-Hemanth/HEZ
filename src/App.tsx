import { useState, useEffect, useMemo } from "react";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { MovieRow } from "./components/MovieRow";
import { PlayerModal } from "./components/PlayerModal";
import { MobileNav } from "./components/MobileNav";
import { ViewAllGrid } from "./components/ViewAllGrid";
import { Movie } from "./types";
import { fetchTrending, fetchTrendingTV, fetchTopRated, fetchUpcoming, searchMedia, fetchAnime, fetchLiveAction, fetchRecent, fetchDiscovery } from "./services/tmdb";
import { Settings, LogOut, ChevronRight, UserCircle, KeySquare, MonitorPlay } from "lucide-react";

import { auth, db, googleProvider } from "./services/firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("Home");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [trending, setTrending] = useState<Movie[]>([]);
  const [trendingTV, setTrendingTV] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Infinite Scroll "View All" State
  const [viewAllConfig, setViewAllConfig] = useState<{ title: string; fetchFn: (page: number) => Promise<Movie[]> } | null>(null);

  // Cache for dynamic category tabs
  const [categoryData, setCategoryData] = useState<Record<string, Movie[]>>({});
  const [isLoadingTab, setIsLoadingTab] = useState(false);

  const [bookmarks, setBookmarks] = useState<Movie[]>([]);

  useEffect(() => {
    setViewAllConfig(null);
  }, [activeTab, searchQuery]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      return;
    }
    
    // Listen to firestore bookmarks
    const bookmarksRef = collection(db, "users", user.uid, "bookmarks");
    const unsubscribe = onSnapshot(bookmarksRef, (snapshot) => {
      const bks: Movie[] = [];
      snapshot.forEach((docSnap) => {
        bks.push(docSnap.data() as Movie);
      });
      // Optional sort by createdAt if needed, but array order will naturally follow firestore order
      setBookmarks(bks);
    }, (error) => {
      console.error("Error fetching bookmarks:", error);
    });
    
    return () => unsubscribe();
  }, [user]);

  const handleToggleBookmark = async (movie: Movie) => {
    if (!user) return;
    const exists = bookmarks.some((m) => m.id === movie.id);
    const bookmarkRef = doc(db, "users", user.uid, "bookmarks", movie.id.toString());
    
    try {
      if (exists) {
        await deleteDoc(bookmarkRef);
      } else {
        await setDoc(bookmarkRef, {
          id: movie.id,
          title: movie.title || "",
          overview: movie.overview || "",
          backdrop_path: movie.backdrop_path || "",
          poster_path: movie.poster_path || "",
          release_date: movie.release_date || "",
          vote_average: movie.vote_average || 0,
          genre_ids: movie.genre_ids || [],
          media_type: movie.media_type || "movie",
          ownerId: user.uid,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.error("Failed to toggle bookmark", err);
    }
  };

  useEffect(() => {
    if (!user) return;
    
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
  }, [user]);

  useEffect(() => {
    if (!user) return;
    
    if (searchQuery.trim().length > 2) {
      const delayInfo = setTimeout(async () => {
        const results = await searchMedia(searchQuery);
        setSearchResults(results);
      }, 500);
      return () => clearTimeout(delayInfo);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, user]);

  const allMoviesCombined = useMemo(() => {
    const map = new Map<number, Movie>();
    [...trending, ...trendingTV, ...topRated, ...upcoming].forEach(m => map.set(m.id, m));
    return Array.from(map.values());
  }, [trending, trendingTV, topRated, upcoming]);

  useEffect(() => {
    if (!user) return;
    
    // Manage dynamic specific category lookups so they aren't computed identically to Home
    if (activeTab === "Anime" || activeTab === "Live Action" || activeTab === "Recent" || activeTab === "Discovery") {
      if (categoryData[activeTab]) return; // Already cached
      
      const loadCategory = async () => {
        setIsLoadingTab(true);
        try {
          let data: Movie[] = [];
          if (activeTab === "Anime") data = await fetchAnime();
          else if (activeTab === "Live Action") data = await fetchLiveAction();
          else if (activeTab === "Recent") data = await fetchRecent();
          else if (activeTab === "Discovery") data = await fetchDiscovery();
          
          setCategoryData(prev => ({ ...prev, [activeTab]: data }));
        } catch (err) {
          console.error("Failed to load category", err);
        } finally {
          setIsLoadingTab(false);
        }
      };
      
      loadCategory();
    }
  }, [activeTab, user, categoryData]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-neutral-900 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -z-10 -translate-y-1/2 translate-x-1/2"></div>
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-3xl italic mx-auto mb-4 tracking-tighter">
              H
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome to HEZ</h1>
            <p className="text-neutral-400">Sign in securely with Google</p>
          </div>
          <button 
            onClick={() => {
              signInWithPopup(auth, googleProvider).then(() => {
                setActiveTab("Home");
              }).catch((e) => console.error("Login failed", e));
            }} 
            className="w-full flex items-center justify-center gap-3 py-4 bg-white hover:bg-neutral-200 rounded-xl font-bold text-neutral-900 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (viewAllConfig) {
      return (
        <ViewAllGrid 
          title={viewAllConfig.title}
          fetchMore={viewAllConfig.fetchFn}
          onBack={() => setViewAllConfig(null)}
          onMovieClick={setSelectedMovie}
        />
      );
    }

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
                signOut(auth).then(() => {
                  setActiveTab("Home");
                });
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
      if (isLoadingTab && activeTab !== "Bookmarks" && activeTab !== "Upcoming") {
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-neutral-400">Curating {activeTab}...</p>
          </div>
        );
      }

      let tabMovies: Movie[] = [];
      
      if (activeTab === "Upcoming") {
        tabMovies = upcoming;
      } else if (activeTab === "Bookmarks") {
        tabMovies = bookmarks;
      } else if (categoryData[activeTab]) {
        tabMovies = categoryData[activeTab];
      }

      return (
        <div className="px-6 md:px-8 py-8 mt-16 min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-8 flex items-center text-white tracking-tight">
            <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
            {activeTab} {activeTab === "Bookmarks" && `(${bookmarks.length})`}
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
          <MovieRow 
            title="Trending Movies" 
            movies={trending.slice(1, 15)} 
            onMovieClick={setSelectedMovie} 
            onViewAll={() => setViewAllConfig({ title: "Trending Movies", fetchFn: fetchTrending })}
          />
          <MovieRow 
            title="Trending TV Shows" 
            movies={trendingTV.slice(0, 15)} 
            onMovieClick={setSelectedMovie} 
            onViewAll={() => setViewAllConfig({ title: "Trending TV Shows", fetchFn: fetchTrendingTV })}
          />
          <MovieRow 
            title="Top Rated Classics" 
            movies={topRated} 
            onMovieClick={setSelectedMovie} 
            onViewAll={() => setViewAllConfig({ title: "Top Rated Classics", fetchFn: fetchTopRated })}
          />
        </div>
      </>
    );
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery("");
    setViewAllConfig(null);
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-blue-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      
      {/* pb-24 ensures content doesn't get hidden behind bottom nav on mobile */}
      <main className="flex-1 md:ml-64 w-full pb-24 md:pb-0">
        <Navbar onSearch={setSearchQuery} searchQuery={searchQuery} />
        {renderContent()}
      </main>

      <MobileNav activeTab={activeTab} setActiveTab={handleTabChange} />

      {selectedMovie && (
        <PlayerModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
          isBookmarked={bookmarks.some(m => m.id === selectedMovie.id)}
          onToggleBookmark={handleToggleBookmark}
          onPlay={setSelectedMovie}
        />
      )}
    </div>
  );
}
