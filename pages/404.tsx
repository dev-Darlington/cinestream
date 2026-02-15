import Link from "next/link";

export default function Custom404() {
  return (
    <div className="min-h-screen bg-linear-to-br from-bg to-black text-textPrimary flex flex-col items-center justify-center px-6 text-center">
      
      <h1 className="text-6xl font-bold text-accent mb-4">
        404
      </h1>

      <h2 className="text-2xl font-semibold mb-3">
        Page Not Found
      </h2>

      <p className="text-textSecondary max-w-md mb-6">
        Looks like this scene doesn’t exist in our movie universe.
        Let’s get you back to something trending.
      </p>

      <Link
        href="/"
        className="bg-accent text-black px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
