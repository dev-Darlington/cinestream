import { GetServerSideProps } from "next";
import { fetchTrending } from "../lib/tmdb";
import { TMDBMovie } from "../types/tmdb";
import MovieCard from "@/components/ui/MovieCard";
import HeroBanner from "../components/section/HeroBanner";

interface HomeProps {
  hero: TMDBMovie;
  movies: TMDBMovie[];
}


export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const movies = await fetchTrending();


  return {
    props: {
      hero: movies[0],
      movies,
    },
  };
};


export default function Home({ hero, movies }: HomeProps) {
  return (
    <div className="bg-bg min-h-screen text-textPrimary py-0">
      <HeroBanner movie={hero} />
      <div className="px-8">
      <h2 className="text-2xl font-semibold mb-4">Trending This Week</h2>
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
      </div>
    </div>
  );
}