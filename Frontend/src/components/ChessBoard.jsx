import { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js'
import {Chessboard, INPUT_EVENT_TYPE , COLOR } from "cm-chessboard"

import {PromotionDialog} from "cm-chessboard/src/extensions/promotion-dialog/PromotionDialog.js"
import {MARKER_TYPE, Markers} from "cm-chessboard/src/extensions/markers/Markers.js"
import pieces from "cm-chessboard/assets/pieces/staunty.svg"

import "cm-chessboard/assets/chessboard.css"
import "cm-chessboard/assets/extensions/markers/markers.css"
import markers from "cm-chessboard/assets/extensions/markers/markers.svg"

import "cm-chessboard/assets/extensions/arrows/arrows.css"
import "cm-chessboard/assets/extensions/promotion-dialog/promotion-dialog.css"
let currentmove = 0;


const playerMakeMove = async (move ,moves ,board, chess, chessclone, isDone, setCurrentMove) => {
    try {
        chess.move(move)
        chessclone.move(moves[currentmove], { sloppy: true })
        if(chess.fen() === chessclone.fen() || chess.isCheckmate()){
            currentmove += 1;
            setCurrentMove(currentmove)
            if (currentmove >= moves.length - 1) {
                board.removeLegalMovesMarkers()
                board.disableMoveInput()
                isDone("Correct") 
                return true                      
            }else{
                
                board.setPosition(chess.fen(), true).then(()=>{
                    engineMakeMove(move ,moves ,board, chess, chessclone, setCurrentMove)
                    setCurrentMove(currentmove)
                    return true
                })

            }
        }else{
            isDone("Incorrect") 
            chess.undo()
            chessclone.load(chess.fen())
            board.setPosition(chess.fen(), true).then(()=>{
                board.setPosition(chess.fen(), true)
                return false
            })
            return false 
        }
    } catch (error) {
        const pmoves = chess.moves({verbose:true})
        let promote = false
        for (const pmove of pmoves) {
            if(pmove?.promotion && pmove.from.includes(move?.from) && pmove.to.includes(move?.to)){
                promote = true
                board.showPromotionDialog(move?.to, chess.turn(), async (result) => {
                    try {
                        chess.move({from:move?.from, to:move?.to, promotion: result.piece[1]})
                        chessclone.move(moves[currentmove], { sloppy: true })
                        if ( chess.fen() == chessclone.fen() || chess.isCheckmate()){
                            currentmove += 1;
                            setCurrentMove(currentmove)
                            if (currentmove >= moves.length-1 ) {
                                board.disableMoveInput()
                                isDone("Correct") 
                                return true                      
                            }else{
                                board.setPosition(chess.fen(), true).then(()=>{
                                    engineMakeMove(move ,moves ,board, chess, chessclone, isDone, setCurrentMove)
                                    setCurrentMove(currentmove)
                                    return true
                                })
                            }
                        }else{
                            isDone("Incorrect") 
                            chess.undo()
                            chessclone.load(chess.fen())
                            board.setPosition(chess.fen(), true).then(()=>{
                                board.setPosition(chess.fen(), true)
                                return false
                            })
                            return false    
                        }
                    } catch (error) {
                        board.setPosition(chess.fen(), true).then(()=>{
                            board.setPosition(chess.fen(), true)
                            return false
                        })
                        chessclone.load(chess.fen())
                        return false                              
                    }
                })
            }
        }
        if(!promote){       
            board.setPosition(chess.fen(), true).then(()=>{
                board.setPosition(chess.fen(), true)
                return false
            })
            chessclone.load(chess.fen())
            return false
        }
        
    }
}

const engineMakeMove = (move ,moves ,board, chess, chessclone, isDone, setCurrentMove) => {
    if (currentmove >= moves.length ) { 
        board.disableMoveInput()
        setCurrentMove(currentmove) 
        isDone("Correct") 
        return true                      
    }else{
        chessclone.move(moves[currentmove], { sloppy: true })
        chess.move(moves[currentmove], { sloppy: true })
        board.setPosition(chess.fen(), true)
        currentmove += 1;
    }
}

const  inputHandler = async (event, moves, chess, chessclone ,board, isDone, setCurrentMove) => {
    switch (event.type) {
        case INPUT_EVENT_TYPE.movingOverSquare:
            return
        case INPUT_EVENT_TYPE.moveInputStarted:
            const emoves = chess.moves({square: event.squareFrom, verbose: true})
            
            board.addLegalMovesMarkers(emoves)
            return moves.length > 0
        case INPUT_EVENT_TYPE.validateMoveInput:
            if (currentmove < moves.length) { 
                
                const move = {from: event.squareFrom, to: event.squareTo, promotion: event.promotion}
                return playerMakeMove(move ,moves , event.chessboard, chess, chessclone, isDone, setCurrentMove)
            }else {
                
                setCurrentMove(currentmove)
                await board.setPosition(chess.fen(), true) 
                isDone("Correct")
                
                return false
            }
        case INPUT_EVENT_TYPE.moveInputFinished:
            board.removeLegalMovesMarkers()
            break
        case INPUT_EVENT_TYPE.moveInputCanceled:
            board.removeLegalMovesMarkers()
            break            

    }
}


export const ChessBoard = ({fen, moves, setDone, setCurrentMove}) => {
    const board = useRef(null);
    const chess = useRef(null);
    const chessclone = useRef(null);
    const ref = useRef(null);
    const finished = useRef()
    
    const isDone = (e) => {
        if(!finished.current){
            finished.current = e
            setDone(e)
            
        }
    }


    useEffect(() => {

        if(!board.current){ 
            board.current = new Chessboard(ref.current, {
                assetsUrl: "cm-chessboard/assets",
                style: {pieces: {file: pieces}},
                extensions: [
                    {class: PromotionDialog},
                    {class: Markers, props: {autoMarkers: MARKER_TYPE.square, sprite: markers}},
                ]
            })
        }
    }, [fen]);

    useEffect(() => {
        finished.current = null
        chess.current = new Chess()
        chessclone.current = new Chess()
        if(board.current && fen){ 
            currentmove = 0
            board.current.disableMoveInput()

            chess.current.load(fen)
            chessclone.current.load(fen)
            const color = fen.includes('w') ? COLOR.black : COLOR.white;
            board.current.setOrientation(color)
            board.current.setPosition(fen)
            
            chessclone.current.move(moves[currentmove], { sloppy: true })
            chess.current.move(moves[currentmove], { sloppy: true })
            currentmove += 1;
            setCurrentMove(currentmove)
            board.current.setPosition(chess.current.fen(), true)
           
            board.current.enableMoveInput((e) => inputHandler(e, moves, chess.current, chessclone.current, board.current, (e)=>isDone(e), (e)=>setCurrentMove(e)), color)
           
        }
        
    }, [fen]);


    return(
        <div ref={ref}></div>
    )
}