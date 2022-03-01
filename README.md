# Warehouse Demo
A simple fullstack warehouse demo for maintaining products and articles.

Author: Daniel Johnsson (roedanne@gmail.com)
***

## Frameworks used

- Language of choice is Node.js with TypeScript
- Express.js is used for API routing
- Jest is used for testing
- Mongoose + MongoDB is used for persistence, MongoDB In-Memory for tests
- React.js is used for the frontend
- ESLink for linting

***
## Prequisites

npm, docker and docker-compose
***
## Installation

### With docker

Create and launch docker containers by running

```bash
docker-compose up
```
> Use -d flag to run in detached mode

Once up, the app should be accessible at <http://localhost:8080/>

### Without docker

Start by installing all Node.js packages

```bash
npm install && cd client && npm install
```

MongoDB should still run on

```bash
docker run --name mongo-dev -d -v mongovolume:/data/db -p 27017:27017 mongo
```

Create a .env file in the root of the project containing

```bash
PORT=8080
PROD_DB_CONNECTION_STRING=mongodb://localhost:27017/warehouse
```
Once up, the app should be accessible at <http://localhost:8080/>
***
## Entering data

Import the file /test-data/postman-examples.json into Postman and run both requests to put data into the app
***
## Unit Testing

Jest is used as a test framework. To execute the tests separately, running

```bash
npm test
```
***
## Notes

I changed the string values in the JSON input data to numbers where applicable (ID, stock and amount_of)
Added ID and Price to the Product model
***
### Client / Server architecture
To maintain simplicity and save time, the React client has been put in a subfolder in the same project rather than splitting into two projects.
***
### Security
In order to manage in time, security has been left out completely in the project, meaning neither SSL/TLS, admin access nor database credentials has been added.
***
### Admin UI
No admin UI is present. All admin actions needs to be preformed from a client tool such as Postman (<https://www.postman.com/>)
