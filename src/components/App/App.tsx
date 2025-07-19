import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";
import { Toaster, toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import type { Movie } from "../../types/movie";
import Loader from "../Loader/Loader";
import { fetchMovies } from "../../services/movieService";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export default function App() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim().length > 0,
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (isSuccess && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, data]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          breakLabel="..."
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
          renderOnZeroPageCount={null}
        />
      )}
      {isLoading && <Loader />}
      {data?.results && data?.results?.length > 0 && (
        <MovieGrid movies={data?.results} onSelect={handleMovieSelect} />
      )}
      {isError && <ErrorMessage />}
      {selectedMovie && (
        <MovieModal
          onClose={() => setSelectedMovie(null)}
          movie={selectedMovie}
        />
      )}
    </div>
  );
}
