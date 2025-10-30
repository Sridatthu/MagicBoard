import Link from 'next/link'
import React from 'react'
import { AnimatedThemeToggler } from './ui/animated-theme-toggler'

const NavBar = () => {
  return (
    <div className='fixed top-0 z-20 w-full'>
      <div className='max-w-6xl h-16 mx-auto flex items-center justify-between'>
      <div>  <Link className='font-bold text-lg' href={"/"}>Magical Draw</Link></div>
      <div className='flex justify-between items-center gap-4'>  
        <AnimatedThemeToggler />
         <Link className='font-medium text-lg' href={"/about"}>About</Link>
        <Link className='font-medium text-lg' href={"/signin"}>Sign In</Link>
         <Link className='font-medium text-lg' href={"/signup"}>Sign Up</Link>
      </div>
      </div>
    </div>
  )
}

export default NavBar