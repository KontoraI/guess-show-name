import axios, { AxiosResponse } from 'axios';
import { IMovie } from '../types/movieType';

export default class MovieService {
    static async getMovies(): Promise<AxiosResponse> {
      return axios.get<IMovie[]>("./movie.json");
    }
}