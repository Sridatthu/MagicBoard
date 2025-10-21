"use client"

export function AuthPage({isSignin}:{
    isSignin:boolean
}){
    return <div className="w-screen h-screen flex justify-center items-center">
        <div className="m-4 bg-white rounded">
            <input type="text" placeholder="email"></input>
            <input type="password" placeholder="password"></input>

            <button>{isSignin? "sign in":"sign up"}</button>

        </div>
    </div>
}