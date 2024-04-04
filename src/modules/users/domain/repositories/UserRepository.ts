import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Database } from "@/modules/common/infrastructure";
import { User } from "@/modules/users/domain/entities";

export default class UserRepository {
    private db: Database;

    constructor() {
        this.db = Database.getInstance();
    }

    public initialize(): void {
        this.createTableIfNotExists()
            .then(() => {
                console.log("User table created or already existing.");
            })
            .catch((error) => {
                console.error("Error initializing user repository:", error);
            });
    }

    private async createTableIfNotExists(): Promise<void> {
        try {
            const connection = this.db.getConnection();
            await connection.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    fullname VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    joinedDate DATETIME(3) NOT NULL,
                    accountStatus ENUM('active', 'inactive', 'suspended') NOT NULL,
                    birthDate DATETIME(3) NOT NULL,
                    address VARCHAR(255) NOT NULL,
                    phoneNumber VARCHAR(20) NOT NULL,
                    lastLogin DATETIME(3),
                    UNIQUE KEY (email)
                )
            `);
        } catch (error) {
            console.error("Error creating users table:", error);
            throw new Error("Failed to create users table.");
        }
    }

    public async createUser(user: User): Promise<User | null> {
        try {
            const connection = this.db.getConnection();
            const query = "INSERT INTO users SET ?";
            const [result] = await connection.query<ResultSetHeader>(query, [
                user,
            ]);
            const insertedUserId = result.insertId;
            return { ...user, id: insertedUserId };
        } catch (error) {
            console.error("Error creating user:", error);
            return null;
        }
    }

    public async getAllUsers(): Promise<User[]> {
        try {
            const connection = this.db.getConnection();
            const query = "SELECT * FROM users";
            const [rows] = await connection.query<RowDataPacket[]>(query);

            return rows.map((row) => row as unknown as User);
        } catch (error) {
            console.error("Error getting all users:", error);
            return [];
        }
    }

    public async getUserById(userId: number): Promise<User | null> {
        try {
            const connection = this.db.getConnection();
            const query = "SELECT * FROM users WHERE id = ?";
            const [rows] = await connection.query<RowDataPacket[]>(query, [
                userId,
            ]);

            if (rows.length > 0) {
                return rows[0] as unknown as User;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error getting user by ID:", error);
            return null;
        }
    }

    public async updateUser(
        userId: number,
        updatedUser: User,
    ): Promise<User | null> {
        try {
            const connection = this.db.getConnection();
            const { id, ...userData } = updatedUser;
            const query = "UPDATE users SET ? WHERE id = ?";
            await connection.query(query, [userData, userId]);
            return { ...updatedUser, id: userId };
        } catch (error) {
            console.error("Error updating user:", error);
            return null;
        }
    }

    public async deleteUser(userId: number): Promise<boolean> {
        try {
            const connection = this.db.getConnection();
            const query = "DELETE FROM users WHERE id = ?";
            await connection.query(query, [userId]);
            return true;
        } catch (error) {
            console.error("Error deleting user:", error);
            return false;
        }
    }
}
