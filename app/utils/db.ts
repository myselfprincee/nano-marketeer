"use server";
import { neon } from "@neondatabase/serverless";
import { v4 as uuidv4 } from 'uuid';

export async function getData() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable is not set");
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
        // Replace this with your actual SQL query
        const data = await sql`SELECT * FROM users LIMIT 10`;
        return data;
    } catch (error) {
        console.error("Database query failed:", error);
        throw new Error("Failed to fetch data from database");
    }
}

// Example: Get user by ID
export async function getUserById(id: number) {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable is not set");
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
        const data = await sql`SELECT * FROM users WHERE id = ${id}`;
        return data[0] || null;
    } catch (error) {
        console.error("Database query failed:", error);
        throw new Error("Failed to fetch user from database");
    }
}

// Example: Create a new user
export async function createUser(email: string, name: string, password: string) {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable is not set");
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
        const data = await sql`
            INSERT INTO users (id, name, email, password) 
            VALUES (${uuidv4()},${email}, ${name}, ${password}) 
            RETURNING *
        `;
        return data[0];
    } catch (error) {
        console.error("Database insert failed:", error);
        throw new Error("Failed to create user");
    }
}

export async function getUserfromDB(email: string, password: string) {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable is not set");
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
        const data = await sql`
            SELECT * FROM users WHERE email = ${email} AND password = ${password}
        `;
        return data[0] || null;
    } catch (error) {
        console.error("Database query failed:", error);
        throw new Error("Failed to get user");
    }
}