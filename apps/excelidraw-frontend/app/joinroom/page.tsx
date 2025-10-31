
import { ParticlesDemo } from '@/components/hero/HeroParticle'
import { Component } from '@/components/Room-ex'
import { FadeText } from '@/components/ui/fade-text'
import React from 'react'

const page = () => {
  return (
    <div className='relative h-screen'>
      <div className='absolute top-0 z-10 w-full h-screen flex flex-col justify-center items-center gap-10'>
            <FadeText text="Create and Join Your " direction="in" wordDelay={0.2} />
              <FadeText text="Custom Room" direction="in" wordDelay={0.2} />
            <Component  />
     </div>
     <ParticlesDemo />
    </div>
  )
}

export default page