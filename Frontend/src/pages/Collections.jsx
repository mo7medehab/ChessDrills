import { useEffect, useState } from 'react';

export const Collection = ({session}) => {
    const [collections, setCollections] = useState([])


    useEffect( ()=>{
        const fetchCollections = async () => {
            try {
                const response = await fetch( import.meta.env.VITE_BACKEND_URL + "/puzzle/collections/", {
                    method: "GET",
                    credentials: "include"
                })
                const json = await response.json();
                setCollections(json)
            } catch (error) {
                console.log(error)
            }
            
        }
        fetchCollections()

    },[])

    return(
        <div className="bg-base-200 min-h-screen px-30 py-25 ">
            <div className=" grid grid-flow-row auto-rows grid-cols-5 gap-5 auto-rows-fr">
  
                {collections.map((e)=>{
                    const tries = e.tries.reduce((a, c) => a + c, 0)
                    const success = e.success.reduce((a, c) => a + c, 0)
                    const losses = tries - success
                    const count = e.content.length
                    return (
                    <div className="card-body rounded-box bg-base-100 outline-1 outline-base-300 col-span-1 row-span-1">
                        <a className='text-xl py-3 text-center' href={"/collection/" + e.id}>{e.name}</a>
                        <div className="flex flex-col">
                            <div className='text-md pb-3 text-left'>Puzzles type: {e.type}</div>
                            <div className='text-md pb-3 text-left'>Puzzles count: {count}</div>
                            <div className="place-self-end text-sm pb-2">
                                <span className='text-green-500'>{success} </span>
                                <span className='text-red-500'>{losses} </span>
                            </div>
                            <span className='place-self-end text-sm pb-2 text-base-content'>{((success/tries)*100).toFixed(2)} % </span>
                        </div> 
                    </div>  
                    )
                        
                })}
                
                <div className="card-body rounded-box bg-base-100 outline-1 outline-base-300 col-span-1 row-span-1 flex flex-col">
                    <div className='text-xl py-3 text-center grow-0'>Add collection</div>
                    <a href="/collection/newcollection" className=' card-body place-content-center'>
                        <div className="grow-1 text-4xl text-primary-content card-actions place-content-center">
                            +
                        </div>
                    </a>
                </div>  


            </div>
            
        </div>

            
    )
}