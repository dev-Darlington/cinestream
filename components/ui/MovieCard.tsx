import Image from "next/image";
import Link from "next/link";


export default function MovieCard({ movie }: { movie: { id: number; title: string; rating: string; poster: string } }) {
    return (
        <Link href={`/movies/${movie.id}`}>
            <div
                className="
                    group relative overflow-hidden rounded-xl bg-surface border border-white/5
                    transition-all duration-300 ease-out
                    hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent/10 hover:border-accent/30
                    focus-within:ring-2 focus-within:ring-accent
                "
            >
                <div className="overflow-hidden aspect-[2/3] relative">
                    <Image
                        src={movie.poster}
                        alt={movie.title}
                        width={500}
                        height={750}
                        className="
                            w-full h-full object-cover
                            transition-transform duration-500 ease-out
                            group-hover:scale-103
                        "
                    />
                </div>

                <div
                    className="
                        absolute inset-0 bg-linear-to-t
                        from-black/90 via-black/30 to-transparent
                        opacity-0 group-hover:opacity-100
                        transition-opacity duration-300
                        flex items-end p-4
                    "
                >
                    <div className="w-full">
                        <h3 className="text-sm font-bold text-white line-clamp-2 font-outfit">
                            {movie.title}
                        </h3>
                        <p className="text-xs text-accent font-extrabold mt-1">
                            ⭐ {movie.rating}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}