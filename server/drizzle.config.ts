import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
config();


export default defineConfig({
    schema: './src/schema/index.ts',
    out: "./src/migration",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DB_URL!,
    },
    casing: "snake_case",
});