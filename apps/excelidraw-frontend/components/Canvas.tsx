import { useEffect, useRef, useState } from "react"
import { IconButton } from "./IconButoon";
import { ArrowRight, Circle, Minus, Pencil, RectangleHorizontalIcon, Trash2 } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool="circle"|"rect"|"line"|"arrow"|"pencil"|"select";

export function Canvas({
    roomId,socket
}:{
    roomId:string,
    socket:WebSocket
}){
const canvasRef=useRef<HTMLCanvasElement>(null);
const [selectedTool,setSelectedTool]=useState<Tool>("circle");
const [game,setGame]=useState<Game>();

useEffect(()=>{
    game?.setTool(selectedTool);
},[selectedTool,game]);

useEffect(()=>{
    if(canvasRef.current){
        const g=new Game(canvasRef.current,roomId,socket)
        setGame(g);

        return ()=>{
            g.destroy();
        }
    }
},[canvasRef])

    return <div style={{height:"100vh",overflow:"hidden"}}>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} ></canvas>
        <TopBar 
            selectedTool={selectedTool} 
            setSelectedTool={setSelectedTool}
            onDelete={() => game?.deleteSelectedShape()}
        />
    </div>
}

function TopBar({selectedTool,setSelectedTool, onDelete}:{
    selectedTool:Tool,
    setSelectedTool:(s:Tool)=>void,
    onDelete: () => void
}){
      return <div style={{
        position:"fixed",
        top:10,
        left:10
      }}>
        <div className="flex gap-2">
            <IconButton onClick={()=>{
                setSelectedTool("line")
            }} activated={selectedTool==="line"} icon={<Minus/>} />
            <IconButton onClick={()=>{
                setSelectedTool("rect")
            }} activated={selectedTool==="rect"} icon={<RectangleHorizontalIcon/>}  />
            <IconButton onClick={()=>{
                setSelectedTool("circle")
            }} activated={selectedTool==="circle"} icon={<Circle/>} />
             <IconButton onClick={()=>{
                setSelectedTool("pencil")
            }} activated={selectedTool==="pencil"} icon={<Pencil/>} />
            <IconButton onClick={()=>{
                setSelectedTool("arrow")
            }} activated={selectedTool==="arrow"} icon={<ArrowRight/>} />
            <IconButton 
                onClick={onDelete} 
                activated={false} 
                icon={<Trash2/>} 
            />
        </div>
      </div>
}
