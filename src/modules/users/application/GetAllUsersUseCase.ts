import { User } from "@/modules/users/domain/entities";
import { UserRepository } from "@/modules/users/domain/repositories";
import { Database } from "@/modules/common/infrastructure";

export default class GetAllUsersUseCase {
    private database: Database;

    constructor(private userRepository: UserRepository) {
        this.database = Database.getInstance();
    }

    async execute(): Promise<User[]> {
        // Establish connection to database before getting all users
        await this.database.connect();

        try {
            // Get all users through the repository
            return await this.userRepository.getAllUsers();
        } catch (error) {
            // Handle any errors that may occur during users acquisition
            console.error("Error getting all users:", error);
            throw error;
        } finally {
            // Close the connection to the database upon completion of the operation
            await this.database.disconnect();
        }
    }
}
