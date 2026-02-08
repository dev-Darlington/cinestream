import { GetServerSideProps } from "next";
import { fetchTrending } from "../lib/tmdb";
import { TMDBMovie } from "../types/tmdb";
import MovieCard from "@/components/ui/MovieCard";
import HeroBanner from "../components/section/HeroBanner";

interface HomeProps {
  hero: TMDBMovie | null;
  movies: TMDBMovie[];
}


export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const movies = await fetchTrending()

  return {
    props: {
      hero: movies.length > 0 ? movies[0] : null,
      movies,
    },
  };
};




export default function Home({ hero, movies }: HomeProps) {
  return (
    <div className="bg-bg min-h-screen text-textPrimary py-0">
      { hero && <HeroBanner movie={hero} />}
      <div className="px-8">
      <h2 className="text-2xl font-semibold mb-4">Trending This Week</h2>
      {movies.length > 0 ? (

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={{
              id: movie.id,
              title: movie.title,
              rating: movie.vote_average.toFixed(1),
              poster: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/placeholder.png",
            }}
          />
        ))}
      </div>
      ): (
        <p className="text-textSecondary text-center">
            No trending content available.
          </p>
      )}
      </div>
    </div>
  );
}