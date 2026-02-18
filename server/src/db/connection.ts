import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
    throw new Error("DATABASE_URL must be defined in .env");
}

export const db = createClient({
    url,
    authToken: url.startsWith("file:") ? undefined : authToken,
});

export const initializeDB = async () => {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                name TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                module_id TEXT NOT NULL,
                exercise_id TEXT NOT NULL,
                status TEXT NOT NULL CHECK(status IN ('started', 'completed')),
                last_code TEXT,
                completed_at DATETIME,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        `);

        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};
