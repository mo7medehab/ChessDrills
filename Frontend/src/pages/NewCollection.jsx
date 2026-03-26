import { useId, useState } from "react"
import { redirect } from "react-router"
import { useNavigate } from 'react-router';



const options = [
    {name: "Mix", databaseName: "mix"},
    {name: "Openings", databaseName: "opening"},
    {name: "Middlegame", databaseName: "middlegame"},
    {name: "Endgame", databaseName: "endgame"},
    {name: "Checkmate", databaseName: "mate"},
    {name: "Fork", databaseName: "fork"},
    {name: "Pin", databaseName: "pin"},
]

export const NewCollection = () => {
    const [name, setName] = useState("")
    const [elo, setElo] = useState(1500)
    const [count, setCount] = useState(10)
    const [type, setType] = useState(0)
    const navigate = useNavigate();

    const createCollection = async () => {
        const response = await fetch( '${import.meta.env.VITE_BACKEND_URL}/puzzle/newcollection', {
            method: "Post",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                    "name"  : name,
                    "rating": elo, 
                    "theme": {"name":  options[type]?.name, "databaseName": options[type]?.databaseName}, 
                    "count": count
                })
            
        }
        )
        const json = await response.json();

        navigate("/collection/"+json[0].id)

        

    }
    
    return(
        <div className="bg-base-200 min-h-screen place-items-center place-content-center ">
            <fieldset className="fieldset bg-base-100/50 border-base-300 rounded-box w-sm border p-4 border-base-300 ">
                <legend className="fieldset-legend w-sm">New Collection</legend>

                <label className="label">Name</label>
                <input type="name" className="input w-sm" placeholder="Collection name" value={name} onChange={(e)=>setName(e.target.value)}/>

                <label className="label">Elo</label>
                <input type="number" className="input w-sm" placeholder="Elo" value={elo} onChange={(e)=> setElo(e.target.value)}/>

                <label className="label">Puzzle Count</label>
                <input type="number" step="1" min="1" max="100" className="input w-sm" placeholder="Count" value={count} onChange={(e)=> setCount(e.target.value)}/>                

                <label className="label">Puzzle type</label>
                <select defaultValue={options[0]} value={type} onChange={(e)=> setType(e.target.value)} className="select w-sm">
                    {options.map((e, i)=>{
                        return <option key={e.databaseName} value={i}>{e.name}</option>
                    })}
                </select>

                <button className="btn btn-primary mt-4" onClick={createCollection}>Create collection</button>
            </fieldset>
        </div>
    )
}