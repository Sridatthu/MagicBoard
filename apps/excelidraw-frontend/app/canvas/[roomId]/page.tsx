"use client"
import { useEffect, useRef } from "react";

export default function Canvas(){

    const canvasRef=useRef<HTMLCanvasElement>(null);

    useEffect(()=>{
        if(canvasRef.current){
            const canvas=canvasRef.current;
            const ctx=canvas.getContext("2d");
            if(!ctx){
                return
            }
            let clicked= false;
            let startX=0;
            let startY=0;

            canvas.addEventListener("mousedown",(e)=>{
                //called on the click of mouse
                clicked=true;
                startX=e.clientX;
                startY=e.clientY;
            })

            canvas.addEventListener("mouseup",(e)=>{
                //called on the while you remove click on mouse
                clicked=false;
            })

            canvas.addEventListener("mousemove",(e)=>{
                //here it calls on every move of mouse while clicking
                if(clicked){
                    const width=e.clientX-startX;
                    const height=e.clientY-startY;
                    ctx.clearRect(0,0,canvas.width,canvas.height);
                    ctx.strokeRect(startX,startY,width,height)
                }
            })

        }
    },[])



    return <div>
        <canvas ref={canvasRef} width={500} height={500}></canvas>
    </div>
}