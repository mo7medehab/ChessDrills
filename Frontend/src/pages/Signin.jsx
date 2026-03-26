
import { betterAuth } from "better-auth"
import { authClient } from "../lib/auth-client.js"
import { useState } from "react"



export const SignIn = () => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const signInHandler = async(e)=>{
        const { data, error } = await authClient.signIn.email({
            email: email,
            password: password,
            rememberMe: rememberMe,
            callbackURL: "/",
        }, {

        })
        

    }



    return(
        <div className="bg-base-200 min-h-screen place-items-center place-content-center ">
            <fieldset className="fieldset bg-base-100/50 border-base-300 rounded-box w-xs border p-4 border-base-300 ">
                <legend className="fieldset-legend">Sign In</legend>

                <label className="label">Email</label>
                <input type="email" className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>

                <label className="label">Password</label>
                <input type="password" className="input" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)}/>

                <label class="label pt-4">
                    <input type="checkbox" checked={rememberMe} onChange={(e)=> setRememberMe(!rememberMe)} className="checkbox checkbox-sm" />
                    Remember me
                </label>

                <button className="btn btn-primary mt-4" onClick={signInHandler}>Sign In</button>
            </fieldset>
        </div>
    )
}