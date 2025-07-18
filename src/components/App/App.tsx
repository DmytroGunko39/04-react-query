import "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Pagination from "../Pagination/Pagination";
import { Toaster, toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import type { Movie } from "../../types/movie";
import Loader from "../Loader/Loader";
import { fetchMovies } from "../../services/movieService";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export default function App() {
  const [page, setPage] = useState(1);
  const [topic, setSearchTopic] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", topic, page],
    queryFn: () => fetchMovies(topic, page),
    enabled: topic.trim().length > 0,
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (!isLoading && !isError && data?.results?.length === 0 && topic.trim()) {
      toast.error("No movies found for your request.");
    }
  }, [data, topic, isLoading, isError]);

  const handleSearch = (newTopic: string) => {
    setSearchTopic(newTopic);
    setPage(1);
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && data?.results?.length > 0 && (
        <Pagination totalP={totalPages} onChange={setPage} currentPage={page} />
      )}
      {isLoading && <Loader />}
      {data?.results && data?.results?.length > 0 && (
        <MovieGrid
          movies={data?.results}
          onSelect={(movie) => setSelectedMovie(movie)}
        />
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
