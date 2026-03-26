
import { betterAuth } from "better-auth"
import { authClient } from "../lib/auth-client.js"
import { useState } from "react"

const defaultimg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT18iwsdCCbBfpa50-5BmNa_m_BX087_x1oWQ&s"


export const SignUp = () => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const signUpHandler = async(e)=>{
        const { data, error } = await authClient.signUp.email({
            image: url? url : defaultimg,
            name: name,
            email: email, 
            password: password,
            rememberMe: true,
            elo:1000,
            callbackURL: "/",
        },{
            

        });   
        
    }


    return(
        <div className="bg-base-200 min-h-screen place-items-center place-content-center ">
            <fieldset className="fieldset bg-base-100/50 border-base-300 rounded-box w-xs border p-4 border-base-300">
                <legend className="fieldset-legend">Sign Up</legend>

                <div className="w-30 justify-self-center">
                    <img src={url? url : defaultimg} className="rounded-full p-5"/>
                </div>

                <label className="label">Image url</label>
                <input type="url" className="input" placeholder="Image url" value={url} onChange={(e)=> setUrl(e.target.value)}/>

                <label className="label">Name *</label>
                <input type="name" className="input" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)}/>

                <label className="label">Email *</label>
                <input type="email" className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>

                <label className="label">Password *</label>
                <input type="password" className="input" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)}/>

                <label class="label pt-4">
                    <input type="checkbox" checked={rememberMe} onChange={(e)=> setRememberMe(!rememberMe)} className="checkbox checkbox-sm" />
                    Remember me
                </label>



                <button className="btn btn-primary mt-4" onClick={signUpHandler}>Sign Up</button>
            </fieldset>
        </div>
    )
}