import { IMovie } from "./../types/movieType";
import MovieApi from "./movieApi";

export const fetchMovies = async () => {
  const { data } = await MovieApi.getMovies();
  const moviesList = data.results;
  const movieList: IMovie[] = moviesList.map((movie: IMovie) => ({
    id: movie.id,
    original_title: movie.original_title,
    overview: movie.overview,
    title: movie.title,
  }));
  return movieList;
};
