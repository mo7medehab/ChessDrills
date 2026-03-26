import { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router";
import { authClient } from "../lib/auth-client";

export const ProtectedRoute = ()=>{
    const [session, setSession] = useState()
    const navigate = useNavigate(); 

    useEffect(()=>{
        const loadSession = async () => {
            const session = await authClient.getSession()
            setSession(session)
            if (!session.data) {
                navigate("/")
                
            }
            
        }
        if(!session){
            loadSession()
        }

    }, [])



    return <Outlet /> ;
}