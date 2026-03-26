import { Link, useParams } from 'react-router';
import { ChessBoard } from '../components/ChessBoard';
import { useEffect, useRef, useState } from 'react';
import { authClient } from '../lib/auth-client';

export const CollectionPuzzle = () =>{
    let params = useParams();
    const [puzzle, setPuzzle] = useState(null);
    const [done, setDone] = useState("")
    const [currentMove, setCurrentMove] = useState(0)
    const [nextPuzzle, setNextPuzzle] = useState(0)
    const [collectionName, setCollections] = useState()
    const [nextLoop, setNextLoop] = useState(0)
    const { data: session, isPending, error, refetch } = authClient.useSession()


    useEffect(()=>{
        const fetchCollections = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL+"/puzzle/collection/"+params.id, {
                    method: "GET",
                    credentials: "include"
                })
                
                const json = await response.json();
                setCollections(json[0])
                setNextPuzzle(json[0].currentPuzzle + 1)
            } catch (error) {
                console.log(error)
            }
            
        }
        fetchCollections()    
    }, [])

    useEffect( ()=>{
        const fetchPuzzle = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/puzzle/collection/"+params.id+"/"+nextPuzzle, {
                    method: "GET",
                    credentials: "include"
                })
                
                const json = await response.json();
                setPuzzle(json.puzzle[0]);
            } catch (error) {
                console.log(error)
            }
            
        }
        fetchPuzzle()

    },[nextPuzzle])

    const onSolve = async (e)=> {
        
        setDone(e)
        let c;
        if(e == "Incorrect"){
            c = 0
        }else if(e== "Correct"){
            c = 1
        }
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/puzzle/collection/"+params.id+"/done", {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                    "pid"  : nextPuzzle,
                    "success": c,
                    "rating" : puzzle?.Rating,
                    "currentpuzzle": nextPuzzle,
                    "loopdone": nextLoop
                })
        })
        await refetch()
        setNextLoop(0)

    }

    const goNext = () =>{
        setPuzzle(null)
        setDone("")
        setCurrentMove(0)
        if(collectionName?.content?.length < (nextPuzzle + 1)){
            setNextLoop(1)
            setNextPuzzle(1)

        }else{
            setNextPuzzle(nextPuzzle + 1) 
        } 
        

    }


    
    return(
        <div className='grid-flow-row grid grid-cols-10 bg-base-200 min-h-screen px-30'>
            <div className=" col-span-6 py-5 px-10 h-auto" >
                <div className="breadcrumbs text-sm pb-5">
                <ul>
                    <li><a href='/user'>{session?.user?.name}</a></li>
                    <li><a href='/collection/collections'>Collections</a></li>
                    <li>{collectionName?.name}</li>
                </ul>
                </div>
                <div className="text-4xl text-base-content">Puzzle {params.puzzleId}</div>
            </div>
            <div className="row-span-10 col-span-4 row-span-2 p-10 h-auto ">
                <div>
                <div className="rounded-box bg-base-100 min-h-10 outline-1 outline-base-300">
                <div className="text-xl p-5">White to move</div>
                  <div className="grid grid-rows-2 px-5 pb-5">
                    <div className='grid grid-cols-2 border-b border-base-300'>
                        <div className='text-base-content/70 py-3'>Elo</div>
                        <div className=' py-3'>{session?.user?.elo}</div>
                    </div>
                    <div className='grid row-span-2 grid-cols-1'>
                        <div className='text-base-content text-center py-3 text-primary text-lg font-bold'>{done? done + "!" : "..."}</div>
                    </div>
                </div>
                </div>
                </div>
                <div className="pt-10">
                    <div className="rounded-box bg-base-100 h-100 outline-1 outline-base-300 ">
                    <div className="text-xl p-3 px-5 border-b border-base-300">Move history</div>
                    <div className="grid grid-rows-2 px-2 pt-5">
                        {puzzle?.Moves.split(" ").slice(0, currentMove  ).map((e, i)=>{ 
                            if(i%2 == 0 && i+1 == currentMove){
                                return(
                                    <div className='grid grid-cols-2 gap-2 pb-2 place-content-center'>
                                        <div className='text-primary-content py-2 bg-primary/30 rounded-md col-span-1 outline-1 outline-base-200/30 text-center'>{e}</div>
                                        <div className='text-primary-content py-2  rounded-md col-span-1 text-center'></div>
                                    </div>
                                )  
                            }else if(i%2==1){
                                return(
                                    <div className='grid grid-cols-2 gap-2 pb-2 place-content-center'>
                                        <div className='text-primary-content py-2 bg-primary/30 rounded-md col-span-1 outline-1 outline-base-200/30 text-center'>{puzzle?.Moves.split(" ")[i-1]}</div>
                                        <div className='text-primary-content py-2 bg-primary/30 rounded-md col-span-1 outline-1 outline-base-200/30 text-center'>{e}</div>
                                    </div>
                                )                                
                            }
                            
                        })
                        }
                    </div>
                    
                    </div>
                    <div className="col-span-1 pt-10 flex">
                        {done && <a className='btn btn-primary grow' onClick={goNext}>Next Puzzle</a>}
                        {!done && <a className='btn btn-disabled btn-primary grow'>Next Puzzle</a>}
                    </div>
                </div>

            </div>
            
            <div className="col-span-6 px-30 py-5">
                <div className=" aspect-square ">
                    <ChessBoard  fen={puzzle?.FEN} moves={puzzle?.Moves.split(" ")} setDone={onSolve} setCurrentMove={setCurrentMove}/>
                </div>
            </div>
        </div>
    )
}