import { IMovie } from "./../types/movieType";
import MovieService from "./movieService";

export const fetchMovies = async () => {
  const { data } = await MovieService.getMovies();
  const moviesList = data.results;
  const movieList: IMovie[] = moviesList.map((movie: IMovie) => ({
    id: movie.id,
    original_title: movie.original_title,
    overview: movie.overview,
    title: movie.title,
  }));
  return movieList;
};
