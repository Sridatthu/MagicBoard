"use client";
import React from "react";
import { motion } from "framer-motion";
import { GradualSpacingText } from "../ui/gradual-spacing-text";
import { ShimmerButton } from "../ui/shimmer-button";
import { AnimatedGradientText } from "../ui/animated-gradient-text";
import { ChevronRight, MoveUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Link from "next/link";
import { ParticlesDemo } from "./HeroParticle";

const Hero = () => {
  const {resolvedTheme}=useTheme();
  console.log(resolvedTheme)
  return (
    <div className="relative h-screen">
      <div className="absolute top-0 w-full h-screen z-10 flex items-center justify-center flex-col space-y-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 5,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.5,
          }}
          className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]"
        >
          <span
            className={cn(
              "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
            )}
            style={{
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "destination-out",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "subtract",
              WebkitClipPath: "padding-box",
            }}
          />
          🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
          <AnimatedGradientText className="text-sm font-medium">
            Introducing Magical Draw
          </AnimatedGradientText>
          <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </motion.div>
        <GradualSpacingText
          className="text-2xl md:text-4xl font-mono text-shadow-xs"
          text="Magical Draw is Simple"
        />
        <motion.p 
           initial={{
            opacity: 0,
            y: 5,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.5,
          }} className="text-center font-sans">
             unleash your creative with our intuitive whiteboard tool.<br></br>Sketch, brainstorm and collaborate in real-time with your team,no matter<br></br> where you are.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
            y: 5,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.5,
          }}
        >
         <Link href={"/joinroom"}> <ShimmerButton className="shadow-2xl gap-2">
            <span className="text-center text-sm leading-none font-medium tracking-tight whitespace-pre-wrap text-white lg:text-lg dark:from-white dark:to-slate-900/10">
              Get Started
            </span>
            <MoveUpRight className="dark:text-white" />
          </ShimmerButton></Link>
        </motion.div>
      </div>
      <ParticlesDemo key={resolvedTheme}/>
    </div>
  );
};

export default Hero;
