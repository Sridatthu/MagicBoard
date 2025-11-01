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

export function Login({isSignin}:{isSignin:boolean}) {
  const emailRef=useRef<HTMLInputElement>(null);
  const passwordRef=useRef<HTMLInputElement>(null);
  const nameRef=useRef<HTMLInputElement>(null);
  const router=useRouter();

  function handleRoute(){
    const route=isSignin?"/signup":"/signin";
    router.push(route);
  }
  
async function handleSignin(){

const  username=emailRef.current?.value?.trim();
  const  password=passwordRef.current?.value?.trim();
  const name=nameRef.current?.value?.trim();
  console.log(username)

if (!username || !password || (!isSignin && !name)) {
  alert("Please fill all required fields");
  return;
}
  try {
    const endPoint=isSignin? "/signin":"/signup";
    const payload=isSignin? {username,password}:{name,username,password};
    const res=await axios.post(`${HTTP_BACKEND}${endPoint}`,payload);
    if(!isSignin){
      router.push("/signin");
    }else{
      const token=res.data.token;
      localStorage.setItem("token",token);
      router.push("/rooms")
    }
  } catch (error:any) {
    alert(error.response?.data?.message || "something went wrong")
  }
}

  return (
    <Card className="relative w-[350px] overflow-hidden">
      <CardHeader>
        <CardTitle>{isSignin?"Login":"SignUp"}</CardTitle>
        <CardDescription>
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" ref={emailRef} placeholder="Enter your email" />
            </div>
            {!isSignin &&  <div className="flex flex-col space-y-1.5">
              <Label htmlFor="text">Name</Label>
              <Input id="text" type="text" ref={nameRef} placeholder="Enter your name" />
            </div>}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                ref={passwordRef}
                placeholder="Enter your password"
              />
            </div>
          </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleRoute} variant="outline">{isSignin?"Register":"Login"}</Button>
        <Button onClick={handleSignin}>{isSignin?"Login":"Signup"}</Button>
      </CardFooter>
      <BorderBeam duration={8} size={100} />
    </Card>
  )
}