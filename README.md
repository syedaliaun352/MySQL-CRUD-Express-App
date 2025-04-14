# MySQL CRUD Express App

## Overview

This Node.js Express application provides a basic CRUD API for managing users in a MySQL database.

## Features

- User registration, retrieval, update, and deletion
- Error handling middleware
- Hashed Password

## Dependencies

- express
- cors
- dotenv
- mysql2
- argon2
- express-rate-limit
- express-validator

## Installation

1. Clone this repository.
2. Install dependencies: npm install
3. Create a `.env` file in the project root with the following environment variables: HOST, USER, PASSWORD, DATABASE, PORT

4. Run the application: npm start

## API Endpoints

Base URL: `/api/v1/users`

- `POST /register`: Registers a new user.
- `GET /users`: Retrieves a list of all users.
- `GET /users/:id`: Retrieves a user by ID.
- `PUT /users/:id`: Updates a user by ID.
- `DELETE /users/:id`: Deletes a user by ID.

## Environment Variables

- `HOST`: MySQL database host
- `USER`: MySQL database user
- `PASSWORD`: MySQL database password
- `DATABASE`: MySQL database name
- `PORT`: Application port (optional, default is 4300)

## Usage

The API can be accessed at `http://localhost:4300/api/v1/users` (adjust port number as per your configuration).

## License

This project is licensed under the MIT License.
