import Image from 'next/image'
import React from 'react'
import feature from "../public/feature.png"
const How = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-8">
        <div className="">
          <h1 className="text-2xl text-center font-bold">How magicaldraw Works</h1>
          <p className="p-3 text-gray-400">Get Started with magicaldraw in just a few simple steps</p>
        </div>
        <div className="flex justify-center mt-8">
          <div>
            <h1 className="font-bold text-2xl mb-4">Start collaborating in minutes</h1>
            <p className="text-gray-400 ">magicaldraw is designed to be intuitive and easy to use.Follow these simple<br></br>steps to get started with your team</p>
            <div></div>
          </div>
          <div>
            <Image src={feature} alt={"feature"}/>
          </div>

        </div>
      </div>
  )
}

export default How