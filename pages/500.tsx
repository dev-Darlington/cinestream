import Link from "next/link";

export default function Custom500() {
  return (
    <div className="min-h-screen bg-linear-to-br from-bg to-black text-textPrimary flex flex-col items-center justify-center px-6 text-center">
      
      <h1 className="text-6xl font-bold text-accent mb-4">
        500
      </h1>

      <h2 className="text-2xl font-semibold mb-3">
        Something Went Wrong
      </h2>

      <p className="text-textSecondary max-w-md mb-6">
        The server ran into an unexpected plot twist.
        Please try again later.
      </p>

      <Link
        href="/"
        className="bg-accent text-black px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
      >
        Return Home
      </Link>
    </div>
  );
}
