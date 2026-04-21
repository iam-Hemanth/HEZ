import { Movie } from "./types";

export const FEATURED_MOVIE: Movie = {
  id: 693134,
  title: "Dune: Part Two",
  overview:
    "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
  backdrop_path: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=1920",
  poster_path: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=500",
  release_date: "2024-02-27",
  vote_average: 8.3,
  genre_ids: [878, 12],
  duration: "2h 46m",
  maturity_rating: "PG-13",
  trailer_url: "Way9Dexny3w", 
};

export const TRENDING_MOVIES: Movie[] = [
  {
    id: 155,
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    backdrop_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1920",
    poster_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=500",
    release_date: "2008-07-16",
    vote_average: 9.0,
    genre_ids: [28, 80, 18, 53],
    trailer_url: "EXeTwQWrcwY",
  },
  {
    id: 27205,
    title: "Inception",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible.",
    backdrop_path: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1920",
    poster_path: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=500",
    release_date: "2010-07-15",
    vote_average: 8.8,
    genre_ids: [28, 878, 12],
    trailer_url: "YoHD9XEInc0",
  },
  {
    id: 680,
    title: "Pulp Fiction",
    overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
    backdrop_path: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=1920",
    poster_path: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=500",
    release_date: "1994-09-10",
    vote_average: 8.9,
    genre_ids: [53, 80],
    trailer_url: "s7EdQ4FqbhY",
  },
  {
    id: 157336,
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    backdrop_path: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?auto=format&fit=crop&q=80&w=1920",
    poster_path: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?auto=format&fit=crop&q=80&w=500",
    release_date: "2014-11-05",
    vote_average: 8.4,
    genre_ids: [12, 18, 878],
    trailer_url: "zSWdZVtXT7E",
  },
  {
    id: 603,
    title: "The Matrix",
    overview: "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
    backdrop_path: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&q=80&w=1920",
    poster_path: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&q=80&w=500",
    release_date: "1999-03-30",
    vote_average: 8.2,
    genre_ids: [28, 878],
    trailer_url: "m8e-FF8MsqU",
  },
  {
      id: 555,
      title: "Gladiator II",
      overview: "Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius is forced to enter the Colosseum after his home is conquered by the tyrannical Emperors.",
      backdrop_path: "https://images.unsplash.com/photo-1542204172-3c1f81706f8c?auto=format&fit=crop&q=80&w=1920",
      poster_path: "https://images.unsplash.com/photo-1542204172-3c1f81706f8c?auto=format&fit=crop&q=80&w=500",
      release_date: "2024-11-22",
      vote_average: 8.5,
      genre_ids: [28, 12, 18],
      trailer_url: "4rgYUipGJNo",
  }
];

export const TOP_RATED: Movie[] = [
  ...TRENDING_MOVIES.slice().reverse()
];

// Quick combine for search simulation
export const ALL_MOVIES = [FEATURED_MOVIE, ...TRENDING_MOVIES, ...TOP_RATED];
