import { useEffect, useState } from "react"
import { authClient } from "../lib/auth-client"

export const Leaderboard = () => {
    const { data: session, isPending, error, refetch } = authClient.useSession()
    const [leaderboard, setLeaderboard] = useState([])

    useEffect(()=>{
        const loadLeaderboard = async ()=> {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/leaderboard/", {
                method: "GET",
            })
            
            const json = await response.json();
            setLeaderboard(json)
            
        }
        loadLeaderboard()
        
    }, [])

    return(
        <div className="bg-base-200 min-h-screen">
            <div className="text-3xl text-center pt-20">Leaderboard</div>
            <div className="overflow-x-auto p-10">
                <table className="table">
                    <thead>
                    <tr className="text-center">
                        <th></th>
                        <th>Name</th>
                        <th>Elo</th>
                        <th>Win Rate</th>
                        <th>Total solved</th>
                    </tr>
                    </thead>
                    <tbody>

                    {leaderboard.map((e, i)=>{
                        const winrate = e?.solved ? (( e?.success/e?.solved)* 100).toFixed(2) : 0
                        return(
                            <tr className="text-center">
                                <th>{i + 1}</th>
                                <td>{e?.name}</td>
                                <td>{e?.elo}</td>
                                <td>{winrate} %</td>
                                <td>{e?.solved}</td>
                            </tr>
                        )
                    })}


                    </tbody>
                </table>
                </div>
        </div>
    )
}