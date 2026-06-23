import { useState } from "react";
import { GetServerSideProps } from "next";
import { fetchMovieDetails } from "../../lib/tmdb";
import { TMDBMovieDetails } from "../../types/tmdb";
import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { useDownloads } from "@/contexts/downloadsContext";
import { FaPlay, FaDownload, FaCircleCheck } from "react-icons/fa6";


interface MovieDetailProps {
    movie: TMDBMovieDetails;
}


export const getServerSideProps: GetServerSideProps<MovieDetailProps> = async ({ params }) => {
    const id = params?.id as string;
    const movie = await fetchMovieDetails(id);

    if(!movie){
        return {
            notFound: true,
        }
    }

    return {
        props: {
            movie,
        },
    };
};


export default function MovieDetail({ movie }: MovieDetailProps) {
    const { startDownload, activeDownloads, isDownloaded } = useDownloads();
    const [showDownloadOptions, setShowDownloadOptions] = useState(false);

    const activeDownload = activeDownloads.find((dl) => dl.id === movie.id);
    const isComp = isDownloaded(movie.id);

    const handleDownloadClick = (quality: string) => {
        startDownload(movie, quality);
        setShowDownloadOptions(false);
    };

    return (
        <div className="bg-bg min-h-screen text-textPrimary">
            <div
                className="h-[60vh] bg-cover bg-center"
                style={{
                    backgroundImage: movie.backdrop_path
                        ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                        : "none",
                }}
            />


            <div className="max-w-5xl mx-auto p-8">
                <h1 className="text-4xl font-bold mb-2">{movie?.title}</h1>
                <p className="text-textSecondary mb-4">{movie?.overview}</p>


                <div className="flex gap-4 mb-6">
                    <span>⭐ {movie.vote_average.toFixed(1)}</span>
                    <span>{movie.runtime} min</span>
                    <span>{movie.release_date?.slice(0, 4)}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <Link
                        href={`/watch/${movie.id}`}
                        className="bg-accent text-black flex gap-2 items-center px-6 py-3 rounded-xl font-bold hover:brightness-110 transition shadow-lg shadow-accent/15 cursor-pointer text-sm"
                    >
                        <FaPlay /> Watch Now
                    </Link>

                    <div className="relative">
                        {isComp ? (
                            <Link
                                href={`/watch/${movie.id}`}
                                className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex gap-2 items-center px-6 py-3 rounded-xl font-bold hover:bg-emerald-500/30 transition text-sm"
                            >
                                <FaCircleCheck /> Downloaded
                            </Link>
                        ) : activeDownload ? (
                            <div className="bg-white/10 text-white flex gap-3 items-center px-6 py-3 rounded-xl text-sm font-semibold select-none border border-white/5">
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-accent" />
                                <span>Downloading ({activeDownload.progress.toFixed(0)}%)</span>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                                    className="bg-surface text-textPrimary hover:bg-white/10 flex gap-2 items-center px-6 py-3 rounded-xl font-bold border border-white/5 transition cursor-pointer text-sm"
                                >
                                    <FaDownload /> Download Offline
                                </button>

                                {showDownloadOptions && (
                                    <div className="absolute top-14 left-0 bg-surface border border-white/10 rounded-xl p-2.5 flex flex-col gap-1.5 w-48 shadow-2xl z-20">
                                        <p className="text-[10px] text-textSecondary uppercase font-bold px-2 py-0.5">Select Quality</p>
                                        <button
                                            onClick={() => handleDownloadClick("1080p")}
                                            className="text-left text-xs px-2.5 py-2 rounded-lg transition hover:bg-white/10 text-white flex justify-between items-center"
                                        >
                                            <span>Full HD (1080p)</span>
                                            <span className="text-[10px] text-textSecondary">1.8 GB</span>
                                        </button>
                                        <button
                                            onClick={() => handleDownloadClick("720p")}
                                            className="text-left text-xs px-2.5 py-2 rounded-lg transition hover:bg-white/10 text-white flex justify-between items-center"
                                        >
                                            <span>HD (720p)</span>
                                            <span className="text-[10px] text-textSecondary">980 MB</span>
                                        </button>
                                        <button
                                            onClick={() => handleDownloadClick("480p")}
                                            className="text-left text-xs px-2.5 py-2 rounded-lg transition hover:bg-white/10 text-white flex justify-between items-center"
                                        >
                                            <span>SD (480p)</span>
                                            <span className="text-[10px] text-textSecondary">450 MB</span>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <FavoriteButton movie={movie}/>
                </div>


                <h2 className="text-xl font-semibold mb-4">Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {movie.credits.cast.slice(0, 6).map((actor) => (
                        <div key={actor.id} className="text-center">
                            {actor.profile_path && (
                                <Image
                                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                    className="rounded-lg mb-2"
                                    alt="actor-image"
                                    width={100}
                                    height={100}
                                />
                            )}
                            <p className="text-sm">{actor.name}</p>
                            <p className="text-xs text-textSecondary">
                                {actor.character}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
};