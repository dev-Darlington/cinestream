import React from 'react'
import Link from 'next/link'

const NavLink = () => {
    return (
        <>
            <Link className="px-3 py-2 rounded-xl hover:bg-surface transition group" href="/">Home</Link>
            <Link className="px-3 py-2 rounded-xl hover:bg-surface transition group" href="/genres">Genre</Link>
            <Link className="px-3 py-2 rounded-xl hover:bg-surface transition group" href="/trending">Trending</Link>
        </>
    )
}

export default NavLink