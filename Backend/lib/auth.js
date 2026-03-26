import {db} from "../db/db.js"
import * as schema from "../db/auth-schema.ts"
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import 'dotenv/config'


export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema
    }),
    user: {
        additionalFields: {
            elo: {
                type: "number",
                required: true,
                defaultValue: 1200,
                input: true,
            },
            solved: {
                type: "number",
                required: false,
                defaultValue: 0,
                input: false,
            },
            success: {
                type: "number",
                required: false,
                defaultValue: 0,
                input: false,
            },

        },
    },
    emailAndPassword: { 
        enabled: true, 
    },
     trustedOrigins: [
        process.env.FRONTEND_URL,
        "myapp://",
     ]
    
})