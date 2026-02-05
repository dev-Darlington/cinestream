import Link from "next/link"
import { FaPlay, FaBell } from "react-icons/fa6" 
import Avatar, { genConfig } from "react-nice-avatar";
import SearchBar from "./ui/SearchBar";

const config = genConfig({
    sex: "man" // or "woman"
  });


const Navbar = () => {
  return (
    <div className="w-full z-999 flex justify-between items-center p-4 bg-gray-950 text-white border-b border-gray-500/20 font-manrope">
        <div className="flex items-center gap-10">
            <div className="flex items-center gap-2 text-amber-400">
                <FaPlay/>
                <h2 className="text-2xl font-bold uppercase tracking-wide">cinestream</h2>
            </div>
            <ul className="flex items-center gap-4 text-sm font-semibold">
                <Link href="/">Home</Link>
                <Link href="/movies">Movies</Link>
                <Link href="/series">TV Series</Link>
                <Link href="/news">News &amp; Popular</Link>
                <Link href="/favorites">My List</Link>
            </ul>
        </div>
        <div className="flex items-center gap-2" suppressHydrationWarning>
            <SearchBar />
            <FaBell/>
            <Avatar {...config} style={{ width: 30, height: 30 }} />
        </div>
    </div>
  )
}
export default Navbar