# Winnie's NC News API

## Summary
This project is a backend API for a news website. It provides endpoints for retrieving, posting, updating, and deleting articles, comments, users and topics.

## Hosted Version
The hosted version of this API can be accessed at [Winnie's NC News API (Backend)](https://winnie-be-nc-news.onrender.com/api).

## Instructions
To run this project locally, follow these steps:

1. Clone the repository: `git clone` https://github.com/WinnieLamS/winnie-be-nc-news

2. Navigate to the project directory: `cd winnie-be-nc-news`

3. Install dependencies: `npm install`

4. Create `.env.development` and `.env.test` files based on the `.env-example` template provided.

5. Create local databases by running the following script: `npm run setup-dbs`

6. Seed the local development database: `npm run seed`

7. Start the server: `npm start`

8. The API should now be running locally at http://localhost:9090.

## Minimum Requirements
- Node.js v21.7.1 or higher
- PostgreSQL v10.0.0 or higher

## Testing
To run tests, use the following command: `npm test app`

## API Documentation
The API endpoints are documented in the code and can be accessed via the /api endpoint when the server is running. For detailed documentation, please refer to the comments and documentation provided in the codebase.

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)


