"use client"
import { WS_URL } from "@/config";
import { useEffect, useState } from "react"
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}:{roomId:string}){

    const [socket,setSocket]=useState<WebSocket |null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading,setLoading]=useState<boolean>(true);
    useEffect(()=>{
        setToken(localStorage.getItem("token"))
        setLoading(false)
    },[])
    useEffect(()=>{
        
        if(!token){
            return
        }
        const ws=new WebSocket(`${WS_URL}?token=${token}`)
        ws.onopen=()=>{
            setSocket(ws);
            const data=JSON.stringify({
                type:"join_room",
                roomId
            })
            ws.send(data)
        }
    },[roomId,token])
if (loading) {
    return <div>Loading...</div>;
  }
if(!token){
        return  <div>please login to access this room</div>
    }
    
    if(!socket){
        return <div>
           connecting to server..
        </div>
    }
   
     
    
    return  <Canvas roomId={roomId} socket={socket}/>

}