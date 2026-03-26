
import PuzzleRouter from "./routes/puzzleroutes.js"

import express from "express";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "./lib/auth.js";
import {db} from "./db/db.js"
const app = express()
const port = 3000
import cors from "cors"
import { user } from "./db/auth-schema.ts";
import { desc, eq } from "drizzle-orm";


const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
  credentials: true
};


app.use(cors(corsOptions))

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json())

app.get('/', async (req, res) => {
    const h = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    })
    return res.json(h);
})

app.get("/api/me", async (req, res) => {
 	const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
	return res.json(session);
});

app.get("/leaderboard", async (req, res) => {
  try {
    const data = await db.select({name: user.name, elo: user.elo, solved: user.solved, success: user.success}).from(user).orderBy(desc(user.elo)).limit(25)
    return res.json(data);
  } catch (error) {
    res.status(500).json(error)
  }

});

app.get("/leaderboardpos", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    const data = await db.select().from(user).orderBy(desc(user.elo)).limit(25)
    let pos;
    data.map((e,i)=>e.id == session.user.id ? pos = i : null)
    
    return res.json(pos);
  } catch (error) {
    res.status(500).json(error)
  }

});



app.use("/puzzle", PuzzleRouter)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})