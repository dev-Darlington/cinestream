import { GetServerSideProps } from "next";
import { fetchMovieDetails } from "../../lib/tmdb";
import { TMDBMovieDetails } from "../../types/tmdb";
import Image from "next/image";
import FavoriteButton from "@/components/ui/FavoriteButton";


interface MovieDetailProps {
    movie: TMDBMovieDetails;
}


export const getServerSideProps: GetServerSideProps<MovieDetailProps> = async ({ params }) => {
    const id = params?.id as string;
    const movie = await fetchMovieDetails(id);


    return {
        props: {
            movie,
        },
    };
};


export default function MovieDetail({ movie }: MovieDetailProps) {
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
                <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                <p className="text-textSecondary mb-4">{movie.overview}</p>


                <div className="flex gap-4 mb-8">
                    <span>⭐ {movie.vote_average.toFixed(1)}</span>
                    <span>{movie.runtime} min</span>
                    <span>{movie.release_date?.slice(0, 4)}</span>
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