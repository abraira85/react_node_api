import { Database } from "@/modules/common/infrastructure";
import { User } from "@/modules/users/domain/entities";
import { UserRepository } from "@/modules/users/domain/repositories";
import { AvatarGenerator } from "random-avatar-generator";

describe("User CRUD tests", () => {
    let userRepository: UserRepository;
    const testUserIds: number[] = [];

    beforeAll(async () => {
        const database = Database.getInstance();
        await database.connect();

        userRepository = new UserRepository();
        userRepository.initialize();
    });

    afterAll(async () => {
        const database = Database.getInstance();

        for (const userId of testUserIds) {
            await userRepository.deleteUser(userId);
        }

        await database.disconnect();
    });

    test("Create user", async () => {
        const generator = new AvatarGenerator();

        const newUser: User = {
            fullname: "John Doe",
            email: "john@example.com",
            password: "password123",
            joinedDate: new Date(),
            avatar: generator.generateRandomAvatar(),
            accountStatus: "active",
            birthDate: new Date("1990-01-01"),
            address: "123 Main St",
            phoneNumber: "555-1234",
        };

        const createdUser = await userRepository.createUser(newUser);

        if (createdUser) {
            testUserIds.push(createdUser.id as number);
        }

        expect(createdUser).toHaveProperty("id");
    });

    test("Get all users", async () => {
        const generator = new AvatarGenerator();

        // Add some users to the database for testing
        const user1: User = {
            fullname: "Alice",
            email: "alice@example.com",
            password: "password1",
            joinedDate: new Date(),
            accountStatus: "active",
            avatar: generator.generateRandomAvatar(),
            birthDate: new Date("1990-01-01"),
            address: "123 Main St",
            phoneNumber: "555-1234",
        };

        const user2: User = {
            fullname: "Bob",
            email: "bob@example.com",
            password: "password2",
            joinedDate: new Date(),
            accountStatus: "active",
            avatar: generator.generateRandomAvatar(),
            birthDate: new Date("1990-01-01"),
            address: "456 Elm St",
            phoneNumber: "555-5678",
        };

        // Create the users in the database
        const createdUser1 = await userRepository.createUser(user1);
        if (createdUser1) {
            testUserIds.push(createdUser1.id as number);
        }

        const createdUser2 = await userRepository.createUser(user2);
        if (createdUser2) {
            testUserIds.push(createdUser2.id as number);
        }

        // Retrieve all users from the database
        const users: User[] = await userRepository.getAllUsers();

        // Find users by fullname
        const alice = users.find((u) => u.fullname === user1.fullname);
        const bob = users.find((u) => u.fullname === user2.fullname);

        // Check if users are found
        expect(alice).toBeDefined();
        expect(bob).toBeDefined();

        // Check Alice's properties
        expect(alice).toHaveProperty("id");
        expect(alice!.fullname).toBe(user1.fullname);
        expect(alice!.email).toBe(user1.email);
        expect(alice!.password).toBe(user1.password);
        expect(alice!.avatar).toBe(user1.avatar);
        expect(alice!.joinedDate).toEqual(user1.joinedDate);
        expect(alice!.accountStatus).toBe(user1.accountStatus);
        expect(alice!.birthDate).toEqual(user1.birthDate);
        expect(alice!.address).toBe(user1.address);
        expect(alice!.phoneNumber).toBe(user1.phoneNumber);

        // Check Bob's properties
        expect(bob).toHaveProperty("id");
        expect(bob!.fullname).toBe(user2.fullname);
        expect(bob!.email).toBe(user2.email);
        expect(bob!.password).toBe(user2.password);
        expect(bob!.avatar).toBe(user2.avatar);
        expect(bob!.joinedDate).toEqual(user2.joinedDate);
        expect(bob!.accountStatus).toBe(user2.accountStatus);
        expect(bob!.birthDate).toEqual(user2.birthDate);
        expect(bob!.address).toBe(user2.address);
        expect(bob!.phoneNumber).toBe(user2.phoneNumber);
    });

    test("Get user by ID", async () => {
        const generator = new AvatarGenerator();

        const newUser: User = {
            fullname: "Jane Doe",
            email: "jane@example.com",
            password: "password123",
            joinedDate: new Date(),
            accountStatus: "active",
            avatar: generator.generateRandomAvatar(),
            birthDate: new Date("1990-01-01"),
            address: "123 Main St",
            phoneNumber: "555-1234",
        };

        const createdUser = await userRepository.createUser(newUser);
        if (createdUser) {
            testUserIds.push(createdUser.id as number);
        }

        expect(createdUser).toHaveProperty("id");
        const testUserId = createdUser?.id as number;

        const user = await userRepository.getUserById(testUserId);
        expect(user).toBeDefined();
    });

    test("Update user", async () => {
        const generator = new AvatarGenerator();

        const updatedUserData: User = {
            id: testUserIds[0],
            fullname: "Updated Name",
            email: "updated@example.com",
            password: "updatedPassword",
            joinedDate: new Date(),
            avatar: generator.generateRandomAvatar(),
            accountStatus: "inactive",
            birthDate: new Date("1990-01-01"),
            address: "123 Main St",
            phoneNumber: "555-1234",
        };

        const updatedUser = await userRepository.updateUser(
            testUserIds[0],
            updatedUserData,
        );
        expect(updatedUser).toEqual(expect.objectContaining(updatedUserData));
    });

    test("Delete user", async () => {
        const result = await userRepository.deleteUser(testUserIds[0]);
        expect(result).toBe(true);
    });

    test("Get user by ID after deletion", async () => {
        const user = await userRepository.getUserById(testUserIds[0]);
        expect(user).toBeNull();
    });
});
