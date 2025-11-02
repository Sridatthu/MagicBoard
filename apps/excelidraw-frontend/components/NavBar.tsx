"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔍 Check for token when component loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // true if token exists
  }, []);

  // 🚪 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/signin"; // redirect to signin page
  };

  return (
    <div className="fixed top-0 z-20 w-full ">
      <div className="max-w-6xl h-16 mx-auto flex items-center justify-between px-4">
        {/* Left Section - Logo */}
        <div>
          <Link className="font-bold text-lg hover:opacity-80 transition" href={"/"}>
            Magical Draw
          </Link>
        </div>

        {/* Right Section - Links */}
        <div className="flex justify-between items-center gap-4">
          <AnimatedThemeToggler />
          <Link className="font-medium text-lg hover:text-primary transition" href={"/rooms"}>
            Rooms
          </Link>

          {/* Conditional Auth Buttons */}
          {isLoggedIn ? (
            <>
              {/* <Link
                className="font-medium text-lg hover:text-primary transition"
                href={"/profile"}
              >
                Profile
              </Link> */}
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
