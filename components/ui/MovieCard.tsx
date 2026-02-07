import Image from "next/image";
import Link from "next/link";


export default function MovieCard({ movie }: { movie: { id: number; title: string; rating: string; poster: string } }) {
    return (
        <Link href={`/movies/${movie.id}`}>
        <div className="group relative rounded-xl overflow-hidden bg-surface shadow-lg">
            <Image
                src={movie.poster}
                alt={movie.title}
                className="w-full transition-transform duration-200 group-hover:scale-105"
                width={500}
                height={750}
            />
            <div className="absolute bottom-0 w-full p-3 bg-linear-to-t from-black/80">
                <h3 className="mt-2 text-sm text-primary sm:text-base font-semibold truncate">
                    {movie.title}
                </h3>
                <span className="text-xs text-accent">
                    ⭐ {movie.rating}
                </span>
            </div>
        </div>
        </Link>
    );
}