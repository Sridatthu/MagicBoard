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

export function Login({isSignin}:{isSignin:boolean}) {
  return (
    <Card className="relative w-[350px] overflow-hidden">
      <CardHeader>
        <CardTitle>{isSignin?"Login":"SignUp"}</CardTitle>
        <CardDescription>
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            {!isSignin &&  <div className="flex flex-col space-y-1.5">
              <Label htmlFor="text">Name</Label>
              <Input id="text" type="text" placeholder="Enter your name" />
            </div>}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">{isSignin?"Register":"Login"}</Button>
        <Button>{isSignin?"Login":"Signup"}</Button>
      </CardFooter>
      <BorderBeam duration={8} size={100} />
    </Card>
  )
}