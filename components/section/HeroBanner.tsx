import Image from "next/image";
import Link from "next/link";
import { HeroMovie } from "../../types/hero";
import FavoriteButton from "../ui/FavoriteButton";
import { FaPlay } from "react-icons/fa6";

interface HeroBannerProps {
    movie: HeroMovie;
    onPlay?: (id: number) => void;
}

export default function HeroBanner({
    movie,
}: HeroBannerProps) {
    const year = movie.release_date?.slice(0, 4);
    const rating = movie.vote_average.toFixed(1);

    return (
        <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden font-manrope mb-10 select-none">
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

            {/* Premium Gradient Overlay fading to background color */}
            <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />

            {/* Content */}
            <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex items-center">
                <div className="max-w-xl space-y-4">
                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight font-outfit drop-shadow-lg text-white">
                        {movie.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-textSecondary">
                        <span className="text-accent font-bold">
                            ⭐ {rating}
                        </span>
                        {year && <span className="font-semibold">{year}</span>}
                        {movie.genres && (
                            <span className="truncate">
                                {movie.genres.slice(0, 3).map((g) => g.name).join(", ")}
                            </span>
                        )}
                    </div>

                    {/* Overview */}
                    <p className="text-textSecondary line-clamp-3 leading-relaxed drop-shadow-xs">
                        {movie.overview}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link
                            href={`/watch/${movie.id}`}
                            className="bg-accent flex gap-2 items-center text-black px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-accent/20 hover:brightness-110 hover:-translate-y-0.5 transition-all text-sm cursor-pointer"
                        >
                            <FaPlay size={12} /> Watch Movie
                        </Link>

                        <FavoriteButton movie={movie}/>
                    </div>
                </div>
            </div>
        </section>
    );
}
