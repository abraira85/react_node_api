import { User } from "@/modules/users/domain/entities";
import { UserRepository } from "@/modules/users/domain/repositories";
import { Database } from "@/modules/common/infrastructure";

export default class CreateUserUseCase {
    private database: Database;

    constructor(private userRepository: UserRepository) {
        this.database = Database.getInstance();
    }

    async execute(user: User): Promise<User | null> {
        if (!user) {
            throw new Error("User cannot be null");
        }

        // Establish connection to database before creating user
        await this.database.connect();

        try {
            // Create the user through the repository
            return await this.userRepository.createUser(user);
        } catch (error) {
            // Handle any errors that may occur during user creation
            console.error("Error creating user:", error);
            throw error;
        } finally {
            // Close the connection to the database upon completion of the operation
            await this.database.disconnect();
        }
    }
}
