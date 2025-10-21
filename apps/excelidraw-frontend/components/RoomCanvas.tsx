"use client"
import { WS_URL } from "@/config";
import { useEffect, useState } from "react"
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}:{roomId:string}){

    const [socket,setSocket]=useState<WebSocket |null>(null);

    useEffect(()=>{
        const ws=new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwZmU2MDkwMy05YmQzLTRiMzAtOWFhYS1iN2M5MDc4NTZjYjgiLCJpYXQiOjE3NjA5NTYyNzd9.zq1UuZXdqYnSMc9C0GAtQHGGHgRkGm0dL0fdybhiZTU`)
        ws.onopen=()=>{
            setSocket(ws);
            const data=JSON.stringify({
                type:"join_room",
                roomId
            })
            ws.send(data)
        }
    })

    if(!socket){
        return <div>
           connecting to server..
        </div>
    }
    return  <Canvas roomId={roomId} socket={socket}/>

}