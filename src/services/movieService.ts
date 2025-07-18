import axios from "axios";
import type { Movie } from "../types/movie";

const myKey = import.meta.env.VITE_TMDB_TOKEN;
axios.defaults.baseURL = "https://api.themoviedb.org/3";

export interface AxiosMovieResponse {
  results: Movie[];
  page: number;
  total_pages: number;
}

export const fetchMovies = async (
  query: string,
  page = 1
): Promise<AxiosMovieResponse> => {
  const response = await axios.get<AxiosMovieResponse>(`/search/movie`, {
    params: {
      query,
      page,
    },
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });

  return response.data;
};
