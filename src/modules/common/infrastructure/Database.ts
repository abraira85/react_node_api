import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export default class Database {
    private static instance: Database;
    private connection: mysql.Connection | undefined;

    private constructor() {}

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async connect(): Promise<void> {
        try {
            this.connection = await mysql.createConnection({
                host: process.env.MYSQL_HOST || "localhost",
                user: process.env.MYSQL_USER || "root",
                password: process.env.MYSQL_PASSWORD || "",
                database: process.env.MYSQL_DATABASE || "mydatabase",
            });
            console.log("Connection established with the database.");
        } catch (error) {
            console.error("Failed to connect to database:", error);
        }
    }

    public async disconnect(): Promise<void> {
        if (this.connection) {
            await this.connection.end();
            console.log("Closed connection.");
        }
    }

    public getConnection(): mysql.Connection {
        if (!this.connection) {
            throw new Error("Database connection is not established.");
        }
        return this.connection;
    }
}
