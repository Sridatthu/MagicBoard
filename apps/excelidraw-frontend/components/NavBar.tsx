"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); 
  }, []);

 
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/signin"; 
  };

  return (
    <div className="fixed top-0 z-20 w-full ">
      <div className="max-w-6xl h-16 mx-auto flex items-center justify-between px-4">
       
        <div>
          <Link className="font-bold text-lg hover:opacity-80 transition" href={"/"}>
            Magical Draw
          </Link>
        </div>

     
        <div className="flex justify-between items-center gap-4">
          <AnimatedThemeToggler />
          <Link className="font-medium text-lg hover:text-primary transition" href={"/rooms"}>
            Rooms
          </Link>

         
          {isLoggedIn ? (
            <>
            
              <button
                onClick={handleLogout}
                className="font-medium text-lg text-red-500 hover:text-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="font-medium text-lg hover:text-primary transition" href={"/signin"}>
                Sign In
              </Link>
              <Link className="font-medium text-lg hover:text-primary transition" href={"/signup"}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
