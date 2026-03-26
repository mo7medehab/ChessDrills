import defaultimg from "../assets/default.png"
import { useEffect, useState } from 'react';
import { authClient } from "../lib/auth-client";

export const User = () => {
    const [collections, setCollections] = useState([])
    const [winrate, setWinrate] = useState(0)
    const [solved, setSolved] = useState(0)
    const [pos, setPos] = useState()

    const [session, setSession] = useState()

    useEffect(()=>{
        const loadSession = async () => {
            const { data: session} = await authClient.getSession()
            setSession(session)
        }
        loadSession()

    }, [solved])

    useEffect( ()=>{
        const fetchCollections = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/puzzle/collections/", {
                    method: "GET",
                    credentials: "include"
                })
                const json = await response.json();
                setSolved(json.map((e)=>e.tries).flat().reduce((accumulator, current) => accumulator + current, 0))
                setWinrate(json.map((e)=>e.success).flat().reduce((accumulator, current) => accumulator + current, 0))
                setCollections(json)
            } catch (error) {
                console.log(error)
            }  
        }

        fetchCollections()

    },[winrate])

    useEffect( ()=>{
        const fetchPos = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/leaderboardpos", {
                    method: "GET",
                    credentials: "include"
                })
                const json = await response.json();
                setPos(json)
            } catch (error) {
                console.log(error)
            }  
        }

        fetchPos()

    },[winrate])

    return(
        <div className="bg-base-200 min-h-screen px-50 py-25 ">
            <div className=" grid grid-rows-row grid-cols-4  gap-5 items-start ">
                <div className="rounded-box bg-base-100 min-h-10 outline-1 outline-base-300 col-span-1 row-span-2 shadow-md">
                    <div className="w-30 justify-self-center">
                        <img src={session?.user?.image ? session?.user?.image :defaultimg} className="rounded-full p-5"/>
                    </div>
                    <div className="grid grid-rows-2 px-5 pb-5">
                        <div className='text-xl py-3 text-center'>{session?.user?.name}</div>
                        
                        <div className='text-base-content/70 py-3 text-center'>Elo: {session?.user?.elo}</div>
                        <div className='text-base-content/70 pb-3 text-center'>Joined {[session?.user?.createdAt.toLocaleDateString()]}</div>
                    </div>
                </div>

                <div className="rounded-box bg-base-100 outline-1 outline-base-300 col-span-1 shadow-md">
                    <div className="px-5 pb-5">
                        <div className='text-base-content/70 py-5'>Puzzles solved</div>
                        <div className='text-xl pb-3'>{session?.user?.solved}</div>
                    </div>
                </div>

                <div className="rounded-box bg-base-100 outline-1 outline-base-300 col-span-1 shadow-md">
                    <div className="px-5 pb-5">
                        <div className='text-base-content/70 py-5'>Win rate</div>
                        <div className='text-xl pb-3'>{session?.user?.success ? ((session?.user?.success / session?.user?.solved)* 100).toFixed(2): 0}%</div>
                    </div>
                </div>


                <div className="rounded-box bg-base-100 outline-1 outline-base-300 col-span-1 shadow-md">
                    <div className="px-5 pb-5">
                        <div className='text-base-content/70 py-5'>Global Rank</div>
                        <div className='text-xl pb-3'>#{pos + 1}</div>
                    </div>
                </div>
    
                <div className="rounded-box bg-base-100 outline-1 outline-base-300 col-span-3 shadow-md">
                    <a href="/collection/collections"><div className='text-xl py-3 text-center'>Collections</div></a>
                    {collections.map((e)=>{
                        return (
                        <div className='flex border-t border-base-300 '>
                            <a className='text-xl p-5 grow' href={"/collection/" + e.id }>
                                {e.name}
                            </a>
                            <div className="place-self-end text-sm px-5 py-2">
                                <span className='text-green-500'>{e.success.reduce((accumulator, currentValue) => accumulator + currentValue, 0)}</span>
                                <span className='text-red-500'>  {e.tries.reduce((accumulator, currentValue) => accumulator + currentValue, 0) - e.success.reduce((accumulator, currentValue) => accumulator + currentValue, 0)}</span>
                            </div>
                        </div>
                        )
                            
                    })}
                        
                                       
                </div>        

            </div>


            

        </div>

            
    )
}