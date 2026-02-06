import { GetServerSideProps } from "next";
import { fetchMoviesByGenre, fetchGenres } from "../../lib/tmdb";
import { TMDBMovie } from "@/types/tmdb";
import MovieCard from "@/components/ui/MovieCard";

interface GenreMoviesProps {
  movies: TMDBMovie[];
  genreName: string;
}

export const getServerSideProps: GetServerSideProps<
  GenreMoviesProps
> = async ({ params }) => {
  const genreId = Number(params?.id);

  const [movies, genres] = await Promise.all([
    fetchMoviesByGenre(genreId),
    fetchGenres(),
  ]);

  const genre = genres.find((g) => g.id === genreId);

  return {
    props: {
      movies,
      genreName: genre?.name ?? "Genre",
    },
  };
};

export default function GenreMoviesPage({
  movies,
  genreName,
}: GenreMoviesProps) {
  return (
    <main className="min-h-screen bg-bg px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">
        🎬 {genreName} Movies
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={{
            id: movie.id,
            title: movie.title,
            rating: movie.vote_average.toFixed(1),
            poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "/placeholder.png",

          }} />
        ))}
      </div>
    </main>
  );
}
