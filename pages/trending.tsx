import { GetServerSideProps } from "next";
import { fetchTrending } from "@/lib/tmdb";
import { TMDBMovie } from "@/types/tmdb";
import MovieCard from "@/components/ui/MovieCard";

interface TrendingProps {
    movies: TMDBMovie[];
}

export const getServerSideProps: GetServerSideProps<TrendingProps> = async () => {
    const movies = await fetchTrending();

    return {
        props: { movies },
    };
};

export default function TrendingPage({movies}: TrendingProps) {
    return (
        <main className="min-h-screen bg-bg text-text-primary px-6 py-10">
          <h1 className="text-3xl font-bold mb-6">🔥 Trending This Week</h1>
    
          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={
                {
                    id: movie.id,
                    title: movie.title,
                    rating: movie.vote_average.toFixed(1),
                    poster: movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/placeholder.png",
                  }
              } />
            ))}
          </section>
        </main>
      );
}