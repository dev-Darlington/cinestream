import { GetServerSideProps } from "next";
import Link from "next/link";
import { fetchGenres } from "../../lib/tmdb";
import { Genre } from "../../types/genre";

interface GenresProps {
  genres: Genre[];
}

export const getServerSideProps: GetServerSideProps<GenresProps> = async () => {
  const genres = await fetchGenres();

  return {
    props: { genres },
  };
};

export default function GenresPage({ genres }: GenresProps) {
  return (
    <main className="min-h-screen bg-bg px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">🎭 Browse by Genre</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={`/genres/${genre.id}`}
            className="bg-surface rounded-xl p-4 text-center
                       hover:bg-accent hover:text-black transition"
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
