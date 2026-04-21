const TMDB_KEY = "422330314793cfddb004ce51a89d7a2a";
const BASE_URL = "https://api.themoviedb.org/3";

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

export const fetchTrending = async (): Promise<TMDBMovie[]> => {
  const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${TMDB_KEY}`);
  const data = await res.json();
  return data.results.map((m: any) => mapMovie(m, 'movie'));
};

export const fetchTrendingTV = async (): Promise<TMDBMovie[]> => {
  const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${TMDB_KEY}`);
  const data = await res.json();
  return data.results.map((m: any) => mapMovie(m, 'tv'));
};

export const fetchTopRated = async (): Promise<TMDBMovie[]> => {
  const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${TMDB_KEY}`);
  const data = await res.json();
  return data.results.map((m: any) => mapMovie(m, 'movie'));
};

export const fetchTopRatedTV = async (): Promise<TMDBMovie[]> => {
  const res = await fetch(`${BASE_URL}/tv/top_rated?api_key=${TMDB_KEY}`);
  const data = await res.json();
  return data.results.map((m: any) => mapMovie(m, 'tv'));
};

export const fetchUpcoming = async (): Promise<TMDBMovie[]> => {
  const res = await fetch(`${BASE_URL}/movie/upcoming?api_key=${TMDB_KEY}`);
  const data = await res.json();
  return data.results.map((m: any) => mapMovie(m, 'movie'));
};

export const searchMedia = async (query: string): Promise<TMDBMovie[]> => {
  if (!query) return [];
  const res = await fetch(`${BASE_URL}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`);
  const data = await res.json();
  // Filter out people, just keep movies and tv
  const media = data.results.filter((m: any) => m.media_type === 'movie' || m.media_type === 'tv');
  return media.map((m: any) => mapMovie(m));
};

export const fetchMovieTrailers = async (movieId: number) => {
  try {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_KEY}`);
    const data = await res.json();
    return data.results || [];
  } catch (e) {
    return [];
  }
};

export const fetchTVDetails = async (tvId: number) => {
  try {
    const res = await fetch(`${BASE_URL}/tv/${tvId}?api_key=${TMDB_KEY}`);
    return await res.json();
  } catch (e) {
    return null;
  }
};
