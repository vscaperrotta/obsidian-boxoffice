export type MovieRating = {
  Source: string;
  Value: string;
};

export type CineVaultMovie = {
  id: string;
  imdbId: string;
  title: string;
  year: string;
  rated: string;
  released: string;
  runtime: string;
  genre: string;
  director: string;
  writer: string;
  actors: string;
  plot: string;
  language: string;
  country: string;
  awards: string;
  poster: string;
  posterLocal: string;
  ratings: MovieRating[];
  metascore: string;
  imdbRating: string;
  imdbVotes: string;
  type: string;
  dvd: string;
  boxOffice: string;
  production: string;
  website: string;
  totalSeasons: string;
  // Rotten Tomatoes fields
  tomatoURL: string;
  tomatoMeter: string;
  tomatoImage: string;
  tomatoRating: string;
  tomatoReviews: string;
  tomatoFresh: string;
  tomatoRotten: string;
  tomatoConsensus: string;
  tomatoUserMeter: string;
  tomatoUserRating: string;
  tomatoUserReviews: string;
  // CineVault specific fields
  starRating: number;
  watched: boolean;
  notes: string;
};

export type CineVaultData = {
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  libraryName: string;
  owner: string;
  source: string;
  movies: CineVaultMovie[];
};

export type CineVaultSearchItem = {
  imdbId: string;
  title: string;
  year: string;
  type: string;
  poster: string;
};

export type OmdbDetailedResponse = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: MovieRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  totalSeasons: string;
  Response: string;
};