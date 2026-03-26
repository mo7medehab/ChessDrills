import { useParams } from 'react-router';
import { ChessBoard } from '../components/ChessBoard';
import { useEffect, useRef, useState } from 'react';

export const Puzzle = () =>{
    let params = useParams();
    const [puzzle, setPuzzle] = useState(null);
    const [done, setDone] = useState("")
    const [currentMove, setCurrentMove] = useState(0)
    const [p, setP] = useState(Math.floor(Math.random() * 5000000) + 1)

    useEffect( ()=>{
        const fetchPuzzle = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/puzzle/"+p)

                const json = await response.json();
                setPuzzle(json[0]);
            } catch (error) {
                console.log(error)
            }
            
        }
        fetchPuzzle()

    },[p])

    const goNext = () =>{
        setP(Math.floor(Math.random() * 5000000) + 1)
        setPuzzle(null)
        setDone("")
        setCurrentMove(0)    

    }
    
    return(
        <div className='grid-flow-row grid grid-cols-10 bg-base-200 min-h-screen px-30'>
            <div className=" col-span-6 py-5 px-10 h-auto" >
                <div className="text-4xl text-base-content">Puzzle {p}</div>
            </div>
            <div className="row-span-10 col-span-4 row-span-2 p-20 h-auto ">
                <div>
                <div className="rounded-box bg-base-100 min-h-10 outline-1 outline-base-300">
                <div className="text-xl p-5">White to move</div>
                  <div className="grid grid-rows-2 px-5 pb-5">
                    <div className='grid grid-cols-2 border-b border-base-300'>
                        <div className='text-base-content/70 py-3'>Elo</div>
                        <div className=' py-3'>{puzzle?.Rating}</div>
                    </div>
                    <div className='grid row-span-2 grid-cols-1'>
                        <div className='text-base-content text-center py-3 text-primary text-lg font-bold'>{done? done + "!" : "..."}</div>
                    </div>
                </div>
                </div>
                </div>
                <div className="pt-20">
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
                    <ChessBoard  fen={puzzle?.FEN} moves={puzzle?.Moves.split(" ")} setDone={setDone} setCurrentMove={setCurrentMove}/>
                </div>
            </div>
        </div>
    )
}