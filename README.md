# money-transfer

## Description

This is a test assignment and it's requirements are:
"The task is to implement an API to top-up account balance, withdraw money and transfer money from one account to another, using NodeJS, NestJS, Typeorm and any relational database you prefer. Things to consider: - money should have 2 decimal points, like 130.45 - account balance cannot go below 0; - API should work correctly with concurrent requests; has context menu"

## Prerequisites
- Npm version at least 10
- Node version at least 18.19
- Docker Compose version 2

## Installation

Install all necessary modules and dependencies.
```bash
$ npm install
```

## Running the application

NB! Following commands which defines environment variables or profile may not work or need some changes when you have Windows OS.

### Using local NPM with Postgres in Docker container

Before running application, database must be up and running.
```bash
# Start database container
$ docker compose up -d

# Stop database container
$ docker compose down -v
```

Run the application
```bash
# NODE_ENV sets file location where are environment variables defined.
# Following command uses .env.development.local file for environment variables
$ NODE_ENV=.development.local npm run start:dev
```

Swagger URL
http://localhost:3000/swagger

### Using only Docker containers

Following command starts 2 Docker containers. One for the application and another for the Postgres
```bash
# Start all containers
$ COMPOSE_PROFILES=development.docker docker compose up -d

# Stop all containers
$ COMPOSE_PROFILES=development.docker docker compose down -v
```

Swagger URL
http://localhost:53000/swagger

## Using the application

Currently, the only way how to use money-transfer application is Swagger URL. Before making some transactions you must create at least 2 accounts. After that you can use endpoints where you can add money, transfer money and take out money.

## Test

NB! Currently, there are no active tests due to the reason that there were no time for that.
