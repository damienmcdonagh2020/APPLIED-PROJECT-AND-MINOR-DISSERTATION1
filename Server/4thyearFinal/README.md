# 4thyearFinal
## Backend README
Dependencies and Middleware
SurfApp backend utilizes the following dependencies and middleware:

Express: A fast, unopinionated, minimalist web framework for Node.js.
Express-GraphQL: A module that allows you to easily create a GraphQL HTTP server with Express.
GraphQL: A query language for your API, and a runtime for executing those queries.
Axios: A promise-based HTTP client for making HTTP requests from Node.js.
CORS: Cross-Origin Resource Sharing middleware for Express.
Installation
To set up the SurfApp backend on your local machine, follow these steps:

Clone the repository:
git clone <repository-url>
Navigate to the project directory:
cd SurfApp-backend
Install dependencies:
npm install
Configuration

Usage
To start the server, run the following command:

Copy code
node server.js
This will start the GraphQL API server at http://localhost:4000/graphql.

API Endpoints
/graphql: The GraphQL endpoint for querying surf data. You can use GraphiQL interface at this endpoint to interactively query the API.
