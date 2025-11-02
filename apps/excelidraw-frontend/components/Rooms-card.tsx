"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShineBorder } from "./ui/shine-border";
import { Clipboard, Check } from "lucide-react";
import { useRouter } from "next/navigation";
interface RoomCardProps {
  id: string;
  slug: string;
}
export function ShineBorderDemo({ id, slug }: RoomCardProps) {
  const [copied, setCopied] = useState(false);
  const router=useRouter();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // revert after 2s
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  const handleClick=(id:string)=>{
    const roomId=id.toString();
      router.push(`/canvas/${roomId}`);
  }

  return (
    <Card className="relative w-full max-w-[250px] overflow-hidden">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
      <CardHeader>
        <CardTitle className="text-center">Room</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="relative">
          <Input
            type="text"
            value={slug}
            readOnly
            className="pr-10 text-center font-medium"
          />
          <button
            onClick={handleCopy}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Clipboard className="w-5 h-5" />
            )}
          </button>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={()=>handleClick(id)} className="w-full">Join Room</Button>
      </CardFooter>
    </Card>
  );
}
