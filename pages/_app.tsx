import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { FavoritesProvider } from "@/contexts/favoritesContext";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FavoritesProvider>
      <Navbar />
      <Component {...pageProps} />
    </FavoritesProvider>
  );
}


