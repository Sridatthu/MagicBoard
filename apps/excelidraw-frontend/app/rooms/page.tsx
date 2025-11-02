import NavBar from '@/components/NavBar'
import { Component } from '@/components/Room-ex'
import Rooms from '@/components/Rooms'
import { ShineBorderDemo } from '@/components/Rooms-card'
import { FadeText } from '@/components/ui/fade-text'
import React from 'react'

const page = () => {
  return (
    <div className='h-screen flex flex-col justify-center items-center gap-10'>
      <NavBar />
        <FadeText text="your custom rooms" direction="in" wordDelay={0.2} />
        <Rooms />
        </div>

  )
}

export default page