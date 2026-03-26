import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, and, between, like, sql } from 'drizzle-orm';
import {db} from "../db/db.js"
import { collectionTable, puzzleTable } from '../db/schema.js';
import { fromNodeHeaders } from "better-auth/node";
import Elorank from "elo-rank"

import 'dotenv/config'
import express from 'express'
import { auth } from '../lib/auth.js';
import { user } from '../db/auth-schema.ts';

const PuzzleRouter = express.Router()

PuzzleRouter.get("/collections", async (req, res) => {
    try{
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        const data = await db.select().from(collectionTable).where(eq(collectionTable.ownerId, session.user.id))
        res.json(data)
    }catch (error){
        res.status(500).json(error)
    }
})

PuzzleRouter.get("/collection/:id", async (req, res) => {
    try{
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        const data = await db.select().from(collectionTable).where(and(eq(collectionTable.ownerId, session.user.id), eq(collectionTable.id, parseInt(req.params.id))))

        res.json(data)
    }catch (error){
        res.status(500).json(error)
    }
})

PuzzleRouter.post("/collection/:id/done", async (req, res) => {
    try {

        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        var elo = new Elorank(15);
        const newelo = elo.updateRating(elo.getExpected(session.user.elo, parseInt(req.body.rating)), parseInt(req.body.success), session.user.elo);
        const data = await db.select().from(collectionTable).where(and(eq(collectionTable.ownerId, session.user.id), eq(collectionTable.id, parseInt(req.params.id))))
        const udata = await db.update(user).set({solved: sql`${user.solved} + 1`,success: sql`${user.success} + ${parseInt(req.body.success)}`, elo: newelo}).where(eq(user.id, session.user.id)).returning();
        let tries = data[0].tries
        let success = data[0].success
        tries[parseInt(req.body.pid)  - 1] += 1
        success[parseInt(req.body.pid)  - 1] += parseInt(req.body.success)
    
        const update = await db.update(collectionTable).set({tries: tries, success: success, currentPuzzle: parseInt(req.body.currentpuzzle), currentLoop: sql`${collectionTable.currentLoop} + ${parseInt(req.body.loopdone)}`}).where(and(eq(collectionTable.ownerId, session.user.id), eq(collectionTable.id, parseInt(req.params.id))))

        res.json(update)
    } catch (error) {
        res.status(500).json(error)
    }



})

PuzzleRouter.get("/collection/:id/:puzzleid", async (req, res) => {
    try{
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        const data = await db.select().from(collectionTable).where(and(eq(collectionTable.ownerId, session.user.id), eq(collectionTable.id, parseInt(req.params.id))))
        const puzzle = await db.select().from(puzzleTable).where(eq(puzzleTable.PuzzleId, data[0].content[parseInt(req.params.puzzleid - 1)])).limit(1)

        res.json({
            puzzle: puzzle,
            puzzleIndex: parseInt(req.params.puzzleid - 1)
        })
    }catch (error){
        res.status(500).json(error)
    }
})

PuzzleRouter.post("/newcollection", async (req, res) => {
    try {

        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        let puzzledata;
        const rating = parseInt(req.body.rating)
        const count = parseInt(req.body.count)
        if(req.body.theme.databaseName !== "mix"){
            puzzledata = await db.select().from(puzzleTable).where(and(between(puzzleTable.Rating, rating - 50, rating + 50), like(puzzleTable.Themes, "%"+req.body.theme.databaseName+"%"))).orderBy(sql`RANDOM()`).limit(count);
        }else{
            puzzledata = await db.select().from(puzzleTable).where(between(puzzleTable.Rating, rating - 50, rating + 50)).orderBy(sql`RANDOM()`).limit(count);
            
        }
        const puzzles = puzzledata.map((e)=>e.PuzzleId)
        
        const values = new Array(puzzles.length).fill(0)
        const data = await db.insert(collectionTable).values({type: req.body.theme.name ,name: req.body.name ,content: puzzles, ownerId: session.user.id, success: values, tries: values, currentPuzzle: 0, currentLoop: 0}).returning({id:collectionTable.id});
        res.json(data)

    } catch (error) {
        res.status(500).json(error)
    }
        

})



PuzzleRouter.get("/:id", async (req, res) => {
    try {
        const data = await db.select().from(puzzleTable).where(eq(puzzleTable.PuzzleId, parseInt(req.params.id))).limit(1)
        if (data) {
            res.json(data)
        }else{
            res.status(404).json()
        }
        
    } catch (error) {
        res.status(500).json(error)
    }    
})




export default PuzzleRouter