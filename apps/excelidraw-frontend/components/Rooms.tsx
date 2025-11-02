"use client";

import React, { useEffect, useState } from "react";
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { ShineBorderDemo } from "./Rooms-card";

interface Room {
  id: string;
  slug: string;
}

const getRooms = async (token: string): Promise<Room[]> => {
  const response = await axios.get(`${HTTP_BACKEND}/rooms`, {
    headers: {
      Authorization: token, 
    },
  });
  return response.data.rooms;
};

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    if (!token) return;
    getRooms(token).then(setRooms).catch(console.error);
  }, []);

  return (
    <div className="flex flex-wrap gap-4">
      {rooms.map((x) => (
        <ShineBorderDemo key={x.id} id={x.id} slug={x.slug} />
      ))}
    </div>
  );
};

export default Rooms;
