# Cinema Booking Backend

## Description

This project implements a backend system for booking cinema seats, designed to handle concurrent requests and ensure data consistency. It uses a polyglot persistence approach with MongoDB for user and reservation data and PostgreSQL for session, hall, and seat data.

## Features

- RESTful API for managing sessions and reservations.
- Optimistic locking for concurrency control.
- MongoDB for user and reservation data.
- PostgreSQL for session, hall, and seat data.
- Key Performance Indicator (KPI) tracking for monitoring system performance.
- Basic frontend interface built with Tailwind CSS.

## Setup

1.  Install dependencies: `npm install`
2.  Configure database connections in `Dockerfile`.
3.  Start the server: `docker-compose up -d --build`

## API Endpoints

- `GET /sessions`: Get all cinema sessions.
- `GET /sessions/:id/seats`: Get seat availability for a session.
- `POST /sessions/:id/seats/reserve`: Reserve seats for a session.

## Data Models

- **MongoDB:**
  - `User`: Stores user details and reservation history.
  - `Reservation`: Tracks seat reservations and associated sessions.
- **PostgreSQL:**
  - `Session`: Contains session data, hall ID, seats, and timing.
  - `Hall`: Stores cinema hall information, including seat configurations.
  - `Seat`: Defines seat layout and availability for each hall.

## Concurrency Handling

- Optimistic locking is used with a `version` field in the `sessions` table (PostgreSQL) to handle concurrent seat reservations and prevent conflicts.

## Key Performance Indicators (KPIs)

The following KPIs are tracked:

- **Success Rate:** Percentage of successful seat reservations.
- **Concurrency Rate:** Number of concurrent requests to the reservation endpoint.
- **Conflict Rate:** Percentage of reservation attempts that result in optimistic locking conflicts.
- **Average Response Time:** Average time taken to process reservation requests.

## Frontend

A basic frontend interface (`public/index.html`) built with Tailwind CSS allows users to view sessions, select seats, and make reservations.

## Running with Docker Compose

1.  Make sure you have Docker and Docker Compose installed.
2.  Update `Dockerfile` file with your database credentials.
3.  Run `docker-compose up -d --build` to start the application.

## Additional Notes

- The application uses ES Modules.
- The `pg` library is used for PostgreSQL interaction.
- The `mongoose` library is used for MongoDB interaction.
- The frontend uses Tailwind CSS for styling.

## Future Improvements

- Implement user authentication.
- Add more robust error handling and logging.
- Implement a more comprehensive frontend with user accounts and more features.
- Use a database migration tool for managing schema changes.
- Add more sophisticated KPI tracking and monitoring.
