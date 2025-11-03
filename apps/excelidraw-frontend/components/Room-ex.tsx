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
import toast from "react-hot-toast"


export function Component() {
  const nameRef=useRef<HTMLInputElement>(null);
const router=useRouter();
async  function CreateRoom(){

  const name=nameRef.current?.value?.trim();
  if(!name){
    toast.error("Please fill all the required fields")
    return
  }
  try {
    const token=localStorage.getItem("token");
    const res=await axios.post(`${HTTP_BACKEND}/room`,{name},{
      headers:{
        Authorization:token
      }
    }) 
 
        toast.success("Room Created Successfully 🎉");
  
  } catch (error:any) {
    toast.error(error.response?.data?.message||"Something Went Wrong ❌");
  }finally{
    if (nameRef.current) nameRef.current.value = "";
  }
}
async function JoinRoom(){
const slug=nameRef.current?.value?.trim();
  if(!slug){
    toast.error("Please fill all the required fields")
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
     if (res.status === 200) {
        toast.success("Joining Room 🎉");
        setTimeout(() => {
            router.push(`/canvas/${roomId}`);
        }, 1500);
      }else{
         toast.error("No room found to join ❌");
      }
  } catch (error:any) {
   toast.error(error.response.data.message||"No room found to join ❌");
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
