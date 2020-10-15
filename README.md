# Organizer API
*Goal of this project is to create a RESTful Web Services, with Node.js and Express framework, all written entirely in TypeScript which exposes API to manage a personal agenda of events.*  
*After signing up and logging in it's possible create, update, delete and obviously see an event.*  
*It is also possible to see all the events of the current week or see the events in the coming days.*

## Installation
1. To setup your environment run command **yarn setup:docker**
2. To install all dependencies run command **yarn install**
3. To start server run command **yarn start**

Now you have server up and running.
## Documentation

### Technologies Used
As mentioned before this project uses **Node.js** and **Express**.  
The application interfaces with the **PostgreSQL** database running on **Docker**, to be machine independent.   
Entity mapping and the various queries were made through an ORM, **TypeORM**.  
**JWT** was used to handle access to the application.  
All project is written in **TypeScript**. 

### Application Structure
* index.ts The entry point to our application. This file defines our express server and connects it to PostgreSQL using TypeORM. It also requires the routes we'll be using in the application.
* appExpressConfig.ts This file defines a function that encapsulates the settings of Express.
* /src 
    * /controllers This folder contains the class controllers for our API.
    * /entities This folder contains the entities for our API.
    * /middlewares This folder contains the middlewares for our API, to check JWT Token and Error Handler.
    * /routes This folder contains the route definitions for our API.
    * /views This folder contains static template.
* /test
    * /auth.test.ts This file contains some test case about register and login process.
    * /event.test.ts This file contains some test case about CRUD operation for our API.
    * /health.test.ts This file contain simple test case for our /health route.

### Public Route
There are 3 public route:
* /health route to check the health of the application, returns information on development environment and version
* /auth/login/ route to login
* /auth/register route to register

### Private Route
All other routes below /event are private and require JWT Token.

### CURL Examples
#### Login
+ **curl -X POST "${host:3010}/auth/login/" -H  "accept: */*" -H  "Content-Type: application/json" -d "{\"email\":\"lfrasca@example.com\",\"password\":\"12345678\"}"**
#### Register
+ **curl -X POST "${host:3010}/auth/register/" -H  "accept: */*" -H  "Content-Type: application/json" -d "{\"email\":\"luigi.frasca@organizer.com\",\"password\":\"12345678\",\"firstName\":\"Luigi\",\"lastName\":\"Frasca\"}"**
#### New event
+ **curl -X POST "${host:3010}/event/" -H  "accept: */*" -H  "auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMDVlZGNiNi01M2E2LTQzZjEtOWMyMS0zYmIxYWM5NGFjYWEiLCJ1c2VybmFtZSI6Imx1aWdpLmZyYXNjYUBvcmdhbml6ZXIuY29tIiwiaWF0IjoxNjAyNzk4NjY4LCJleHAiOjE2MDI4MDIyNjh9.7zPz3XE-qn-nVfFVbDWHLjO6idAAqg8oaHlgoA5BHBY" -H  "Content-Type: application/json" -d "{\"name\":\"Taglio Capelli\",\"address\":\"Via Alessandro Manzoni, 45, Milano, 20121\",\"start\":\"2020-10-16T10:51:30.241Z\",\"end\":\"2020-10-16T11:51:30.241Z\"}"**
#### Events in week
+ **curl -X GET "${host:3010}/event/in-week/" -H  "accept: */*" -H  "auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMDVlZGNiNi01M2E2LTQzZjEtOWMyMS0zYmIxYWM5NGFjYWEiLCJ1c2VybmFtZSI6Imx1aWdpLmZyYXNjYUBvcmdhbml6ZXIuY29tIiwiaWF0IjoxNjAyNzk4NjY4LCJleHAiOjE2MDI4MDIyNjh9.7zPz3XE-qn-nVfFVbDWHLjO6idAAqg8oaHlgoA5BHBY"**
#### Upcoming events 
+ **curl -X GET "${host:3010}/event/by-period/," -H  "accept: */*" -H  "auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMDVlZGNiNi01M2E2LTQzZjEtOWMyMS0zYmIxYWM5NGFjYWEiLCJ1c2VybmFtZSI6Imx1aWdpLmZyYXNjYUBvcmdhbml6ZXIuY29tIiwiaWF0IjoxNjAyNzk4NjY4LCJleHAiOjE2MDI4MDIyNjh9.7zPz3XE-qn-nVfFVbDWHLjO6idAAqg8oaHlgoA5BHBY"**
## Author 
Luigi Frasca 