# koa-health-test
Test exercise for Koa Health.

A live working example of this API can be found at this URL:
http://link.earth:3000/

## Setup

### Database Setup

1. Open a terminal in the ./database directory:
```
cd database
```

2. Create the postgres docker container:
```
docker compose up --detach
```

3. Execute script to create the healthy_habits database with all the required objects (tables & functions) and data:
```
docker exec -it postgres sh /etc/postgresql/sql/create_healthy_habits.sh
```

### API Setup

1. Open a terminal to the ./api directory:
```
cd api
```

2. Configure the API as desired by editing the .env file:
```
vi .env
```

3. Install npm packages:
```
npm install
```

4. (Optional step) Validate that the database is configured correctly by executing all the unit tests:
```
npm test
```
CTRL-C to exit.

5. If all tests pass, run the node application:
```
npm start
```

6. View the Swagger UI in a web browser to browse and test the web methods (insert configured port):
```
http://localhost:3000/docs
```

## Project Structure

## API

The API is a simple node.js app using express, express-validator, JWT, mocha/chai, and supertest.  The API connects to a PostgreSQL database using pg.

### API Structure

The structure is simple

#### Configuration

The core config key value pairs are contained in the config file: 
`./api/.env`

Example:
```
PORT=3000
DATABASE_URL=postgres://api:gxuaJk1smioXLjm@localhost:5433/healthy_habits
JWT_SECRET=asdf89sad9fljaskdjfas98dfuasldfjas9d8fyuasdlfjasd
SESSION_TIME_EXPIRATION=4h
```

#### Routes

The following routes have been defined:


#### Controllers

#### Authentication/JWT

#### Database

The database is called healthy_habits, the schema is straight forward:

![Database Diagram](database_diagram.png)

The database is initialized with 

### Developer mode

#### nodemod
nodemod monitors files and restarts the server if a change is detected.  Start the dev server by using:

```
npm run dev
```

#### biome.js
biome 

### Unit Tests
There are 21 unit tests written using mocha/chai/supertest.  To execute all the tests, which make requests to all the API endpoints, execute the command:

```
npm test
```

An output (hopefully) such as this will be returned:
```
  Activity Endpoints
    ✔ should list all activities available to a logged in user (43ms)
    ✔ should return unauthorized if listing activities when not logged in
    ✔ an activity can be set as completed by a logged in user
    ✔ an activity CANNOT be set as completed by a user not logged in
    ✔ completed activities can be retrieved by a logged in user
    ✔ completed activities CANNOT be retrieved by a user not logged in

  Activity Admin Endpoints
    ✔ a standard user CANNOT create a new activity
    ✔ an admin user can create a new activity
    ✔ an admin user can update an activity
    ✔ a standard user CANNOT update an activity
    ✔ an admin user can get an activity
    ✔ a standard user CANNOT get an activity
    ✔ an admin user can delete an activity
    ✔ a standard user CANNOT delete an activity

  User Endpoints
    ✔ should validate that a session token can be created and then received to infer a user id
    ✔ should register a new user and create a session token successfully
    ✔ should return an error when registering with bad input username
    ✔ should return an error when registering with bad email
    ✔ should return an error when registering with a bad password
    ✔ should validate that a user can login and a session token is created
    ✔ should validate that a user CANNOT login when an incorrect password is provided
```
### Swagger / OpenAPI


## TODO
- More Swagger documentation to define more explicitly return types
- Dockerize the node.js app

