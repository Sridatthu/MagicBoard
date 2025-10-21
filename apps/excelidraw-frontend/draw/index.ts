

export function initDraw(canvas:HTMLCanvasElement){
            const ctx=canvas.getContext("2d");
            if(!ctx){
                return
            }
            ctx.fillStyle="rgba(0,0,0)";
            ctx.fillRect(0,0,canvas.width,canvas.height)

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
                    ctx.fillStyle="rgba(0,0,0)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
              ctx.strokeStyle = "rgba(255, 255, 255)"
                    ctx.strokeRect(startX,startY,width,height)
                }
            })
}