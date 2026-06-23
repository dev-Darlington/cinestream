import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { FavoritesProvider } from "@/contexts/favoritesContext";
import { DownloadsProvider, useDownloads } from "@/contexts/downloadsContext";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { FaWifi, FaCircleExclamation } from "react-icons/fa6";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { isOffline } = useDownloads();

  const isOfflinePage = router.pathname === "/downloads";
  const isWatchPage = router.pathname === "/watch/[id]";

  // If simulated offline is active, only allow downloads & watch pages
  const showOfflineScreen = isOffline && !isOfflinePage && !isWatchPage;

  return (
    <div className={`${outfit.variable} ${plusJakarta.variable} min-h-screen bg-bg text-white flex flex-col font-manrope`}>
      {/* Top Banner when Offline Mode is active */}
      {isOffline && (
        <div className="bg-red-500 text-white text-center py-2 px-4 text-xs font-semibold flex items-center justify-center gap-2 select-none sticky top-0 z-9999 animate-pulse shadow-md">
          <FaCircleExclamation />
          <span>Offline Simulator Active — Catalog is disabled. Go to your Offline Library to play downloaded movies.</span>
        </div>
      )}
      
      <Navbar />

      {showOfflineScreen ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-bg">
          <div className="p-5 bg-red-500/10 rounded-full border border-red-500/20 text-red-400 mb-6 animate-bounce">
            <FaWifi size={48} />
          </div>
          <h1 className="text-3xl font-extrabold mb-3">You are Currently Offline</h1>
          <p className="text-textSecondary max-w-md text-sm md:text-base mb-8 leading-relaxed">
            You are simulating offline mode. Connect to the internet to browse our online catalogs, 
            or visit your offline library to stream downloaded videos.
          </p>
          <div className="flex gap-4">
            <Link
              href="/downloads"
              className="px-6 py-3 bg-accent text-black font-semibold rounded-xl hover:brightness-110 transition text-sm cursor-pointer shadow-lg shadow-accent/10"
            >
              Go to Downloads Library
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-surface border border-white/10 hover:bg-white/10 font-semibold rounded-xl transition text-sm cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        </div>
      ) : (
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
      )}
    </div>
  );
}

export default function App(props: AppProps) {
  return (
    <FavoritesProvider>
      <DownloadsProvider>
        <AppContent {...props} />
      </DownloadsProvider>
    </FavoritesProvider>
  );
}


