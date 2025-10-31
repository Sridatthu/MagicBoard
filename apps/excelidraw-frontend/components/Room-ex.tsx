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


export function Component() {
  return (
    <Card className="relative w-[350px] overflow-hidden">
      <CardHeader>
        <CardTitle className="text-center font-sans text-2xl">Room</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Room Name</Label>
              <Input id="email" type="email" placeholder="Enter Room Name" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center items-center gap-3">
        <Button>Join Room</Button>
        <Button>Create Room</Button>
      </CardFooter>
      <BorderBeam duration={8} size={100} />
    </Card>
  )
}
