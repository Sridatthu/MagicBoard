"use client"

import clsx from "clsx"
import { AnimatePresence, motion } from "motion/react"

interface GradualSpacingTextProps {
  text?: string
  className?: string
}

export const GradualSpacingText: React.FC<GradualSpacingTextProps> = ({
  text = "",
  className = "",
}) => {
  const gradual = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <div className="flex justify-center space-x-1">
      <AnimatePresence>
        {text.split("").map((char, i) => (
          <motion.h1
            key={i}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={gradual}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={clsx(
              "font-display text-center font-bold drop-shadow-sm",
              "tracking-[-0.02em]",
              "md:leading-[4rem] lg:leading-[4.5rem] xl:leading-[5rem]",
              className // 👈 merged here so your props apply directly
            )}
          >
            {char === " " ? <span>&nbsp;</span> : char}
          </motion.h1>
        ))}
      </AnimatePresence>
    </div>
  )
}
