# Homework 4: Simple Movie Database/API utilizing reviews

In this assignment, I have constructed a simple API for a movie database that requires a sign up and login. You can create reviews and retrieve movie information with their respective reviews.

This project was built using Node.js , Express, and Mongoose

## Author

- Abraham Gutierrez
- Due Date: 3/16/2025

### Installing

1. Clone the repository

```zsh
git clone 
```

1. Install dependencies

```zsh
cd current_Repository
npm install
```

1. Start the server

```zsh
npm start
```

The server will start on `localhost:8000`.

## Running the tests

To run the tests, use the following command:

```bash
npm test
```

## API Endpoints

### User Authentication

- `POST /signup`: Create a new user account
- `POST /signin`: Sign in a with an existing user

### Movies

- `GET /movies`: Get a list of all movies.
- `POST /movies`: Create a Movie
- `GET /movies/:id`: Get a specific movie by getting the id alongside it's reviews
- `PUT /movies/:id`: update a movie using an movie id
- `DELETE /movies/:id`: Delete a movie.

### Reviews

- `GET /reviews`: Get a list of all reviews for all movies.
- `POST /reviews`: Create a review for a movie

## Postman Environment

Collection: CSCI3916_HW4

Environment: Abraham_HW4


## Postman Button

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/41591718-7ebf5b1a-db84-49c8-a458-d95995ae88e4?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D41591718-7ebf5b1a-db84-49c8-a458-d95995ae88e4%26entityType%3Dcollection%26workspaceId%3D01844ba1-5b74-48d1-a6fc-09d6dac43dcb#?env%5BHW4_Abraham%5D=W3sia2V5IjoiSldUIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiZGVmYXVsdCIsInNlc3Npb25WYWx1ZSI6IkpXVC4uLiIsImNvbXBsZXRlU2Vzc2lvblZhbHVlIjoiSldUIGV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwWkNJNklqWTNaR0UwTkRVNVptSTVNMlU0T1RJd1pEYzNObVJsWlNJc0luVnpaWEp1WVcxbElqb2lhbTlvYmk1a2IyVkFaMjFoYVd3dVkyOXRJaXdpYVdGMElqb3hOelF6TnpVd05UQTRMQ0psZUhBaU9qRTNORE0zTlRReE1EaDkuSmdQY2t5Mi1nc0tOVXU3MmRXWUdTTV90Q3VKbk1qR2ppXzh3ejZaN0VNRSIsInNlc3Npb25JbmRleCI6MH0seyJrZXkiOiJtb3ZpZUlkIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiYW55Iiwic2Vzc2lvblZhbHVlIjoiNjdlYzRkODE3NzkxNjhmYjY0OWExODU5IiwiY29tcGxldGVTZXNzaW9uVmFsdWUiOiI2N2VjNGQ4MTc3OTE2OGZiNjQ5YTE4NTkiLCJzZXNzaW9uSW5kZXgiOjF9LHsia2V5IjoiZmFrZW1vdmllSWQiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJkZWZhdWx0Iiwic2Vzc2lvblZhbHVlIjoiZmRzZjg1ODNxOTQ1eTM4OTdzZGEiLCJjb21wbGV0ZVNlc3Npb25WYWx1ZSI6ImZkc2Y4NTgzcTk0NXkzODk3c2RhIiwic2Vzc2lvbkluZGV4IjoyfV0=)
