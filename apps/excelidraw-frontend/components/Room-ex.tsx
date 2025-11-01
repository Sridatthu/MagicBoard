"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BorderBeam } from "./ui/BorderBeam"
import { useRef } from "react"
import axios from "axios"
import { HTTP_BACKEND } from "@/config"
import { useRouter } from "next/navigation"


export function Component() {
  const nameRef=useRef<HTMLInputElement>(null);
const router=useRouter();
async  function CreateRoom(){

  const name=nameRef.current?.value?.trim();
  if(!name){
    alert("please fill the required fields");
    return
  }
  try {
    const token=localStorage.getItem("token");
    const res=await axios.post(`${HTTP_BACKEND}/room`,{name},{
      headers:{
        Authorization:token
      }
    })
    alert("room created successfully")
  } catch (error:any) {
    alert(error.esponse?.data?.message || "Something went wrong")
  }finally{
    if (nameRef.current) nameRef.current.value = "";
  }
}
async function JoinRoom(){
const slug=nameRef.current?.value?.trim();
  if(!slug){
    alert("please fill the required fields");
    return
  }
  try {
    const token=localStorage.getItem("token");
    const res=await axios.get(`${HTTP_BACKEND}/room/${slug}`,{
      headers:{
        Authorization:token
      }
    })
    const roomId=res.data.roomId;
  router.push(`/canvas/${roomId}`);
    
  } catch (error:any) {
     alert(error.esponse?.data?.message || "Something went wrong")
  }finally{
    if (nameRef.current) nameRef.current.value = "";
  }


}
  return (
    <Card className="relative w-[350px] overflow-hidden">
      <CardHeader>
        <CardTitle className="text-center font-sans text-2xl">Room</CardTitle>
      </CardHeader>
      <CardContent>
       
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Room Name</Label>
              <Input ref={nameRef}
              id="email" type="email" placeholder="Enter Room Name" />
            </div>
          </div>
       
      </CardContent>
      <CardFooter className="flex justify-center items-center gap-3">
        <Button onClick={JoinRoom}>Join Room</Button>
        <Button onClick={CreateRoom}>Create Room</Button>
      </CardFooter>
      <BorderBeam duration={8} size={100} />
    </Card>
  )
}
