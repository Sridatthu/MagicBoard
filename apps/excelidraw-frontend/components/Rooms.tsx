"use client"
import React, { useEffect, useState } from 'react'
import { HTTP_BACKEND } from '@/config'
import axios from 'axios'

const getRooms = async (token:string) => {
  const response = await axios.get(`${HTTP_BACKEND}/rooms`,{
    headers:{
      Authorization:token
    }
  })
  return response.data.rooms
}

const Rooms = () => {
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    const token:string=localStorage.getItem("token")|| "";
    getRooms(token).then(setRooms)
  }, [])

  return (
    <div>
      Rooms: {JSON.stringify(rooms)}
    </div>
  )
}

export default Rooms
