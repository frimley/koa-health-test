# koa-health-test
Test exercise for Koa Health.

A live working example of this API can be found at this URL:
http://link.earth:3000/docs

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

6. View the Swagger UI in a web browser to browse and test the web methods (note configured port):
```
http://localhost:3000/docs
```

## Project Structure

## API

The API is a simple node.js app using express, express-validator, JWT, mocha/chai, and supertest.  The API connects to a PostgreSQL database using pg.

### API Structure

#### Configuration

The core config key value pairs are contained in the config file: 
```
./api/.env
```

Example:
```
PORT=3000
DATABASE_URL=postgres://api:gxuaJk1smioXLjm@localhost:5433/healthy_habits
JWT_SECRET=asdf89sad9fljaskdjfas98dfuasldfjas9d8fyuasdlfjasd
SESSION_TIME_EXPIRATION=4h
```

#### Routes

The following routes have been defined:

Route | Type | Description | Needs session? | Admin Only? 
--- | --- | --- | --- | ---
/docs | GET | Displays a Swagger/OpenAPI UI | No | No
/register | POST | Registers a new user.  Upon completion, the user is automatically signed in and a session token returned. | No | No
/login | POST | Logs a user in.  Returns a session token. | No | No
/activities | GET | Returns all available activities | Yes | No
/user/{activityId} | PUT | Sets an activity as completed for a user | Yes | No
/user/completed | GET | Returns all the completed activities for a user | Yes | No
/admin/activity | POST | Creates a new activity | Yes | Yes
/admin/activity/{activityId} | PUT | Updates an activity | Yes | Yes
/admin/activity/{activityId} | GET | Returns an activity | Yes | Yes


Only an admin account can call the 'admin' methods.  An admin account has been created upon database creation.  The details are:
```
Username: admin16180
Password: pass16180
```
If the above account is used to login, the session token will allow access to the admin methods above.  This account has column is_admin = true in table user_account.

#### Authentication/JWT & Security

Authentication is achieved by using JSON web tokens.  An authentication token is created which encapsulates a user's user_account_id.  This Id is a UUID (Universally Unique Identifier) which gives an added layer of security in that the Id is a 128 bit randomly generated value.

User passwords are saved encrypted to the database upon registering (one way md5 hash).  Saved hashed passwords therefore can only be compared to other hashed values.

#### Database

The database is called healthy_habits, the schema is straight forward:

![Database Diagram](database_diagram.png)

An ‘api’ postgres user is created and used by the node.js api.  This user has only limited rights to tables and functions.

The node API does not contain inline SQL, it uses postgres functions.  Only having access to functions provides an abstracted layer which gives many benefits:

- Table and column names are irrelevant to the API codebase - the postgres functions have simple input and output parameters
- The underlying database schema can be changed easily because only function names and parameters exist in the codebase.
- Performance tuning and query optimisation is much easier when all SQL is within a consistent set of functions (vs auto-generated SQL in an ORM library for example).

### Developer mode

When developing, nodemon can be used.

#### nodemod
nodemod monitors files and restarts the server if a change is detected.  Start dev mode by using:

```
npm run dev
```

#### biome.js
Biome is a fast formatter that can be used to validate all code and formatting in the project.

Check syntax manually with the biome linter:
```
npx @biomejs/biome check
```

To configure Visual Studio Code to change code upon save (CTRL+S), see:
https://marketplace.visualstudio.com/items?itemName=biomejs.biome

### Unit Tests
There are 21 unit tests written using mocha/chai/supertest.  These test all the functionality and security of the API.  To execute all the tests, which make requests to all the API endpoints, execute the command:

```
npm test
```

These tests connect to the running API like an external client.  An output (hopefully) such as this will be returned:
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

The project produces Swagger documentation.  This provides a convenient interface to test all the methods within the API.

## TODO
- More Swagger documentation to define more explicitly return types
- Better logging to capture usage and errors
- SSL / Security
- Login auditing
- Application performance metrics
- Dockerize the node.js app

