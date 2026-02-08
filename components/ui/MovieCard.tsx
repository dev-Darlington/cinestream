import Image from "next/image";
import Link from "next/link";


export default function MovieCard({ movie }: { movie: { id: number; title: string; rating: string; poster: string } }) {
    return (
        <Link href={`/movies/${movie.id}`}>
            <div
                className="
    group relative overflow-hidden rounded-xl bg-surface
    transition-all duration-300 ease-out
    hover:-translate-y-1 hover:shadow-xl
    focus-within:ring-2 focus-within:ring-accent
  "
            >
                <div className="overflow-hidden">
                    <Image
                        src={movie.poster}
                        alt={movie.title}
                        width={500}
                        height={750}
                        className="
        w-full h-auto object-cover
        transition-transform duration-500 ease-out
        group-hover:scale-105
      "
                    />
                </div>

                <div
                    className="
      absolute inset-0 bg-linear-to-t
      from-black/80 via-black/20 to-transparent
      opacity-0 group-hover:opacity-100
      transition-opacity duration-300
      flex items-end p-4
    "
                >
                    <div>
                        <h3 className="text-sm font-semibold text-white line-clamp-2">
                            {movie.title}
                        </h3>
                        <p className="text-xs text-yellow-400 mt-1">
                            ⭐ {movie.rating}
                        </p>
                    </div>
                </div>
            </div>

        </Link>
    );
}