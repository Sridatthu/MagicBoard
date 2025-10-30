import { Login } from '@/components/AuthPage'
import React from 'react'

const page = () => {
  return (
   <div className='h-screen flex justify-center items-center'>
     <Login isSignin={true} />
   </div>
  )
}

export default page