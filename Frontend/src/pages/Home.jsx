import { useState, useEffect } from "react"

export const Home = ({session}) => {
    const [leaderboard, setLeaderboard] = useState()
    const [solved, setSolved] = useState(1)
    const [success, setSuccess] = useState(1)
    useEffect(()=>{
        const loadLeaderboard = async ()=> {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/leaderboard/", {
                method: "GET",
            })
            
            const json = await response.json();
            setLeaderboard(json)
            setSolved(json?.reduce((s, a)=> a.solved+s,0))
            setSuccess(json?.reduce((s, a)=> a.success+s,0))
            
        }
        loadLeaderboard()
        
    }, [])
    
    return(
        
        <div className="bg-base-200 min-h-screen px-30 py-10 ">
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@40,400,1,0" rel="stylesheet" />
            <div className="hero overflow-hidden outline-1 outline-base-300 rounded-xl bg-base-100 shadow-md">
                <div className=" grid grid-cols-2 text-center grow ">
                    <div className="col-span-1 bg-base-200 place-content-center p-2 mx-auto">
                        <img className='rounded-lg h-full w-full object-cover' src='https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8'/>
                    </div>                
                    <div className="col-span-1 place-self-center p-5">
                        
                        <h1 className="text-5xl font-bold ">Improve your chess</h1>
                        <p className="py-6 text-xl text-base-content/70">
                            Create collections and improve your chess by solving puzzles.
                        </p>
                        {!session && <a className="btn btn-primary px-20" href="/signup">Start now</a>}
                        {session && <a className="btn btn-primary px-20" href="/collection/collections">Start now</a>}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-5 py-10">
                <div className="flex rounded-lg bg-base-100 outline-1 outline-base-300 p-5 px-15 shadow-lg">
                    <div className="size-20 self-center rounded-lg bg-primary/10 flex items-center justify-center text-primary ">
                        <span className="material-symbols-outlined" data-icon="check_circle" style={{fontSize: '48px'}}>check_circle</span>
                    </div>
                    <div className='self-center px-5'>
                        <div className="text-base-content/70">Total players</div>
                        <div className="text-5xl text-bold">{leaderboard?.length}</div>
                    </div>
                </div>
                <div className="flex rounded-lg bg-base-100 outline-1 outline-base-300 p-2 px-15 shadow-lg">
                    <div className="size-20 self-center rounded-lg bg-primary/10 flex items-center justify-center text-primary ">
                        <span class="material-symbols-outlined" data-icon="groups" style={{fontSize: '48px'}}>groups</span>
                    </div>
                    <div className='self-center px-5'>
                    <div className="text-base-content/70">Puzzles Solved</div>
                    <div className="text-5xl text-bold">{solved}</div>
                    </div>
                </div>
                <div className="flex rounded-lg bg-base-100 outline-1 outline-base-300 p-2 px-15 shadow-lg">
                    <div className="size-20 self-center rounded-lg bg-primary/10 flex items-center justify-center text-primary ">
                        <span class="material-symbols-outlined" style={{fontSize: '48px'}}>insights</span>
                    </div>
                    <div className='self-center px-5'>
                    <div className="text-base-content/70">Average success rate</div>
                    <div className="text-5xl text-bold">{((success/solved) * 100).toFixed(2) }%</div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}