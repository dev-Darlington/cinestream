import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const NavLink = () => {
    const router = useRouter();

    const links = [
        { href: "/", label: "Home" },
        { href: "/genres", label: "Genre" },
        { href: "/trending", label: "Trending" },
        { href: "/downloads", label: "Downloads" }
    ];

    return (
        <>
            {links.map((link) => {
                // Exact match for home, startsWith for subroutes (e.g. genre details /genres/123)
                const isActive = link.href === "/" 
                    ? router.pathname === "/" 
                    : router.pathname === link.href || router.pathname.startsWith(link.href);

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`px-3.5 py-1.5 rounded-xl text-xs transition-all duration-300 font-semibold border ${
                            isActive
                                ? "bg-accent/10 text-accent border-accent/20 font-bold"
                                : "text-textSecondary hover:text-white hover:bg-surface border-transparent"
                        }`}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </>
    )
}

export default NavLink