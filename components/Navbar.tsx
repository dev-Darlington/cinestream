import Link from "next/link"
import { FaPlay } from "react-icons/fa6" 
import SearchBar from "./ui/SearchBar";
import FavoritesCounter from "@/components/ui/FavoritesCounter";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";



const Navbar = () => {
  return (
    <div className="sticky top-0 w-full flex text-white justify-between items-center p-4 z-999 bg-bg backdrop-blur border-b border-white/5 font-manrope">
        <div className="flex items-center gap-10">
            <div className="flex items-center gap-2 text-amber-400">
                <FaPlay/>
                <h2 className="text-2xl font-bold uppercase tracking-wide">cinestream</h2>
            </div>
            <ul className="flex items-center gap-4 text-sm font-medium text-textSecondary group-hover:text-textPrimary">
                <Link className="px-3 py-2 rounded-xl hover:bg-surface transition group" href="/">Home</Link>
                <Link className="px-3 py-2 rounded-xl hover:bg-surface transition group" href="/genres">Genre</Link>
                <Link className="px-3 py-2 rounded-xl hover:bg-surface transition group" href="/trending">Trending</Link>
                <FavoritesCounter />
            </ul>
        </div>
        <div className="flex items-center gap-2">
            <SearchBar />
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
            </div>
        </div>
    </div>
  )
}
export default Navbar