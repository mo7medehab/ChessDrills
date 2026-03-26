import { useEffect, useState } from 'react'

import { authClient } from "../lib/auth-client.js"  
import { Link, useNavigate } from 'react-router'

export const Navbar =  ({session}) =>{

    const signOut = async () =>{
        await authClient.signOut();
        window.location.reload();
        
    }

    if(session?.user?.name){
        return(
            <header>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@40,400,1,0" rel="stylesheet" />
                
                <div className="flex navbar bg-base-200 border border-base-300 px-30 justify-between ">
                
                <ul className="menu menu-horizontal px-1 text-base-content/50 self-center">
                    <span class="material-symbols-outlined text-3xl text-primary"  data-icon="chess_knight" style={{fontSize: '30px'}}>chess_knight</span> 
                    <Link class="text-primary-content text-2xl tracking-tight pr-10"  to="">ChessDrills</Link>
                    <li><Link to="/leaderboard">leaderboard</Link></li>
                    <li><Link to="/puzzle">Puzzles</Link></li>
                    <li><Link to="/collection/collections">Collections</Link></li>
                </ul>
                
                <ul className="menu menu-horizontal px-1 items-center self-center">
                    <Link className="pr-15 text-base-content/70" to="/user">{session?.user?.name}</Link>
                    <li><div className="btn btn-primary" onClick={signOut}>Sign out</div></li>
                </ul>
            
                </div>
            </header>
        )
    }else{
        return(
            <header>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@40,400,1,0" rel="stylesheet" />

                <div className="navbar bg-base-200 border border-base-300 px-30  justify-between ">

                <ul className="menu menu-horizontal px-1 text-base-content/50 self-center">
                    <span class="material-symbols-outlined text-3xl text-primary"  data-icon="chess_knight" style={{fontSize: '30px'}}>chess_knight</span> 
                    <Link class="text-primary-content text-2xl tracking-tight pr-10"  to="">Chess train</Link>
                        <li><Link to="/leaderboard">leaderboard</Link></li>
                        <li><Link to="/puzzle">Puzzles</Link></li>
                </ul>

                <ul className="menu menu-horizontal px-1 items-center self-center">
                    <Link className=" pr-15 text-base-content/70" to="/signin">Sign in</Link>
                    <Link className="btn btn-primary" to="/signUp">Sign up</Link>
                </ul>

                </div>
            </header>
        )
    }
}
