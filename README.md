# Next User Management System

This project is a User Management System developed using Next.js for both the web front-end and API backend.
It utilizes a monorepository structure with Next.js API routes handling backend functionality.  
It follows a Hexagonal Architecture and utilizes patterns like Singleton for database connection.

## Features
1. **Monorepo Structure**: Single repository containing both the API and web application.
2. **Next.js API Routes**: Implements backend functionality using Next.js API routes.
3. **Create, Read, Update, Delete (CRUD) Functionality**: Allows users to perform CRUD operations on user records.
4. **Singleton Database Connection**: Utilizes the Singleton pattern for efficient database connection management.
5. **Easy Deployment**: Simple steps to deploy the application using docker and docker compose.
6. **GitHub Repository**: The repository contains a README file with deployment instructions.
7. **Postman Collection**: Includes a collection of API endpoints with examples for consumption.

## Getting Started
1. **Clone Repository**: Clone the GitHub repository.
2. **Setup Database**: Set up a MySQL database and configure the application to connect to it.
3. **Install Dependencies**: Install the required dependencies.
4. **Run Application**: Start the application to manage users.

### API Endpoints
- **Create User**: POST `/api/users`
- **Get All Users**: GET `/api/users`
- **Get User by ID**: GET `/api/users/:id`
- **Update User**: PUT `/api/users/:id`
- **Delete User**: DELETE `/api/users/:id`

### API Features
- **Create User**: Allows the creation of a new user with specified details.
- **Get All Users**: Retrieves a list of all users currently stored in the database.
- **Update User**: Modifies the details of an existing user based on the provided user ID.
- **Delete User**: Deletes a user from the database using their unique ID.

### Web App Features
- **User Interface**: Provides a user-friendly interface for managing users.
- **Create User Form**: Allows users to input details and create new users.
- **User List**: Displays a list of all users with options to view, edit, and delete each user.
- **Edit User Form**: Enables users to modify the details of existing users.
- **Delete User**: Allows users to delete a user from the system.

### Postman Collection
A Postman collection containing examples for consuming the API endpoints is provided.
The Postman collection files are located in the /postman folder at the root of the project.

## Setup Instructions
Follow these steps to set up and run both the API and the Web App:

1. **Application Setup**:
    - Clone the Application repository from GitHub.
    - Configure the environment variables for MySQL database connection. Rename the file .env.example to .env and specify the values you want for the database data
    - Build and install application using `docker compose up -d`.
    - Create the table in the database and generate some random data for testing using `docker compose run app yarn gen-users -n 10`.
    - Run tests using `docker compose run app yarn test`

## Postman Collection
- Download the Postman collection from the provided link.
- Import the collection into Postman.
- Explore the available endpoints and examples for consumption.

---

By Rober de Avila Abraira <rober.abraira@gmail.com>
