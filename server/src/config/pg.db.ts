import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as dotenv  from "dotenv";
dotenv.config();


export const db = new Pool({
    connectionString: process.env.DB_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
 export const dbDrizzle = drizzle(db,{casing: "snake_case"});