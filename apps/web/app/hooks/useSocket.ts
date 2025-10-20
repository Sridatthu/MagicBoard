import { useEffect, useState } from "react";
import { WS_URL } from "../confg";

export function useSocket(){
    const [loading,setLoading]=useState(true);
    const [socket,setSocket]=useState<WebSocket>();


    useEffect(()=>{
        const ws=new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwZmU2MDkwMy05YmQzLTRiMzAtOWFhYS1iN2M5MDc4NTZjYjgiLCJpYXQiOjE3NjA5NTYyNzd9.zq1UuZXdqYnSMc9C0GAtQHGGHgRkGm0dL0fdybhiZTU`);

        ws.onopen=()=>{
            setLoading(false);
            setSocket(ws);
        }

    },[])

    return {
        socket,
        loading
    }
}