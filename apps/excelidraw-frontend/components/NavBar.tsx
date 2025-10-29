import Link from 'next/link'
import React from 'react'

const NavBar = () => {
  return (
    <div className="flex justify-evenly w-full p-4">
        <div className="flex justify-between gap-8">
          <div>
            LOGO
          </div>
         <li>Features</li>
         <li>How it Works</li>
         <li>Pricing</li>
         <li>canvas</li>
        </div>
        <div className="flex justify-between gap-6">
         <Link className="rounded bg-blue-700 px-6 py-2" href={"/signin"}>Sign In</Link>
         <Link className="rounded bg-blue-100 px-6 py-2 text-blue-800" href={"/signup"}>Sign Up</Link>
        </div>
      </div>

  )
}

export default NavBar