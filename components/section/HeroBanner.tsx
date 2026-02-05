import Image from "next/image";
import { HeroMovie } from "../../types/hero";
import FavoriteButton from "../ui/FavoriteButton";
import { FaPlay } from "react-icons/fa";

interface HeroBannerProps {
    movie: HeroMovie;
    onPlay?: (id: number) => void;
    onAddToWatchlist?: (id: number) => void;
}

export default function HeroBanner({
    movie,
    onPlay,
}: HeroBannerProps) {
    const year = movie.release_date?.slice(0, 4);
    const rating = movie.vote_average.toFixed(1);

    return (
        <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden font-manrope mb-10">
            {/* Backdrop */}
            {movie.backdrop_path && (
                <Image
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    fill
                    priority
                    className="object-cover"
                />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-transparent" />

            {/* Content */}
            <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex items-center">
                <div className="max-w-xl space-y-4">
                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                        {movie.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-textSecondary">
                        <span className="text-accent font-semibold">
                            ⭐ {rating}
                        </span>
                        {year && <span>{year}</span>}
                        {movie.genres && (
                            <span className="truncate">
                                {movie.genres.slice(0, 3).map((g) => g.name).join(", ")}
                            </span>
                        )}
                    </div>

                    {/* Overview */}
                    <p className="text-textSecondary line-clamp-3">
                        {movie.overview}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={() => onPlay?.(movie.id)}
                            className="bg-accent flex gap-2 items-center text-black px-6 py-3 rounded-xl font-semibold hover:brightness-110 transition"
                        >
                            <FaPlay /> Play Trailer
                        </button>

                        <FavoriteButton movie={movie}/>
                    </div>
                </div>
            </div>
        </section>
    );
}
