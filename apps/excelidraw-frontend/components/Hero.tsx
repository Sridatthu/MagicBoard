import Image from 'next/image'
import React from 'react'
import darkhero from "../public/darkmodehero1.png"
const Hero = () => {
  return (
  <div className="flex justify-center items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            Collaborate and <br></br>
            create <span className="text-blue-900 text-4xl font-bold">with Magicaldraw</span>
          </h1>
          <p className="m-3 text-gray-400">
            unleash your creative with our intuitive whiteboard tool.Sketch,<br></br>brainstorm,and collaborate in real-time with your team,no matter<br></br> where are you.
          </p>
          <div className="flex gap-4">
            <button className="rounded bg-blue-700 px-6 py-2">Get Started</button>
            <button className="rounded bg-blue-200 px-6 py-2 text-blue-800">Live Demo</button>
          </div>
        </div>
        <div>
          <Image className="" src={darkhero} alt={"hero"} />
        </div>
      </div>
  )
}

export default Hero