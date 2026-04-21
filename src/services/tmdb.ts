const BASE_URL = "/api/tmdb";

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  media_type: 'movie' | 'tv';
}

const mapMovie = (movie: any, forceMediaType?: 'movie' | 'tv'): TMDBMovie => ({
  id: movie.id,
  title: movie.title || movie.name,
  overview: movie.overview,
  backdrop_path: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : "",
  poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "",
  release_date: movie.release_date || movie.first_air_date || "",
  vote_average: movie.vote_average || 0,
  genre_ids: movie.genre_ids || [],
  media_type: forceMediaType || (movie.media_type === 'tv' ? 'tv' : 'movie'),
});

async function fetchTMDB(endpoint: string, params: Record<string, string | number> = {}) {
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    queryParams.append(key, String(value));
  }

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  
  try {
    const res = await fetch(`${BASE_URL}${endpoint}${queryString}`);
    if (!res.ok) {
      console.error(`TMDB API Error: ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`TMDB Request Failed:`, error);
    return null;
  }
}

export const fetchTrending = async (page: number = 1): Promise<TMDBMovie[]> => {
  const data = await fetchTMDB('/trending/movie/week', { page });
  return data?.results?.map((m: any) => mapMovie(m, 'movie')) || [];
};

export const fetchTrendingTV = async (page: number = 1): Promise<TMDBMovie[]> => {
  const data = await fetchTMDB('/trending/tv/week', { page });
  return data?.results?.map((m: any) => mapMovie(m, 'tv')) || [];
};

export const fetchTopRated = async (page: number = 1): Promise<TMDBMovie[]> => {
  const data = await fetchTMDB('/movie/top_rated', { page });
  return data?.results?.map((m: any) => mapMovie(m, 'movie')) || [];
};

export const fetchTopRatedTV = async (page: number = 1): Promise<TMDBMovie[]> => {
  const data = await fetchTMDB('/tv/top_rated', { page });
  return data?.results?.map((m: any) => mapMovie(m, 'tv')) || [];
};

export const fetchUpcoming = async (page: number = 1): Promise<TMDBMovie[]> => {
  const data = await fetchTMDB('/movie/upcoming', { page });
  return data?.results?.map((m: any) => mapMovie(m, 'movie')) || [];
};

export const fetchAnime = async (): Promise<TMDBMovie[]> => {
  const [tvData, movieData] = await Promise.all([
    fetchTMDB('/discover/tv', { with_genres: 16, with_original_language: 'ja', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_genres: 16, with_original_language: 'ja', sort_by: 'popularity.desc' })
  ]);
  const tvMapped = tvData?.results?.map((m: any) => mapMovie(m, 'tv')) || [];
  const movieMapped = movieData?.results?.map((m: any) => mapMovie(m, 'movie')) || [];
  return [...tvMapped, ...movieMapped].sort((a, b) => b.vote_average - a.vote_average);
};

export const fetchLiveAction = async (): Promise<TMDBMovie[]> => {
  const [tvData, movieData] = await Promise.all([
    fetchTMDB('/discover/tv', { without_genres: 16, sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { without_genres: 16, sort_by: 'popularity.desc' })
  ]);
  const tvMapped = tvData?.results?.map((m: any) => mapMovie(m, 'tv')) || [];
  const movieMapped = movieData?.results?.map((m: any) => mapMovie(m, 'movie')) || [];
  return [...tvMapped, ...movieMapped].sort((a, b) => Math.random() - 0.5); // Mix them up a bit
};

export const fetchRecent = async (): Promise<TMDBMovie[]> => {
  const [tvData, movieData] = await Promise.all([
    fetchTMDB('/tv/on_the_air'),
    fetchTMDB('/movie/now_playing')
  ]);
  const tvMapped = tvData?.results?.map((m: any) => mapMovie(m, 'tv')) || [];
  const movieMapped = movieData?.results?.map((m: any) => mapMovie(m, 'movie')) || [];
  return [...movieMapped, ...tvMapped]; // Keep movies then TV
};

export const fetchDiscovery = async (): Promise<TMDBMovie[]> => {
  // Discovery gives high-quality random pages of movies/tv
  const page = Math.floor(Math.random() * 5) + 1;
  const [tvData, movieData] = await Promise.all([
    fetchTMDB('/discover/tv', { sort_by: 'popularity.desc', page }),
    fetchTMDB('/discover/movie', { sort_by: 'popularity.desc', page })
  ]);
  const tvMapped = tvData?.results?.map((m: any) => mapMovie(m, 'tv')) || [];
  const movieMapped = movieData?.results?.map((m: any) => mapMovie(m, 'movie')) || [];
  return [...tvMapped, ...movieMapped].sort(() => Math.random() - 0.5);
};

export const searchMedia = async (query: string): Promise<TMDBMovie[]> => {
  if (!query) return [];
  const data = await fetchTMDB('/search/multi', { query });
  if (!data?.results) return [];
  // Filter out people, just keep movies and tv
  const media = data.results.filter((m: any) => m.media_type === 'movie' || m.media_type === 'tv');
  return media.map((m: any) => mapMovie(m));
};

export const fetchMovieTrailers = async (movieId: number) => {
  const data = await fetchTMDB(`/movie/${movieId}/videos`);
  return data?.results || [];
};

export const fetchTVDetails = async (tvId: number) => {
  return await fetchTMDB(`/tv/${tvId}`);
};

export const fetchMediaMetadata = async (id: number, type: 'movie' | 'tv') => {
  const [credits, similar, videos] = await Promise.all([
    fetchTMDB(`/${type}/${id}/credits`),
    fetchTMDB(`/${type}/${id}/similar`),
    fetchTMDB(`/${type}/${id}/videos`)
  ]);

  if (!credits || !similar || !videos) return null;

  return {
    cast: credits.cast?.slice(0, 4) || [],
    director: credits.crew?.find((c: any) => c.job === 'Director') || credits.crew?.find((c: any) => c.job === 'Executive Producer'),
    similar: (similar.results || []).map((m: any) => mapMovie(m, type)).filter((m: any) => m.poster_path).slice(0, 6),
    videos: (videos.results || []).filter((v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'))
  };
};
