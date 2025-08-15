# Cricket Data Analytics

This is a web application for analysing cricket data. It consists of a backend server with Rest API & PostgreSQL database, and a frontend client built with Next.js.

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/en/download)
- [Postgres](https://www.postgresql.org/download/)

### Database Setup
1. Run `psql -U postgres` to connect to the database (optional: you can replace `postgres` with your user account)
  - Default psql password is `postgres`
2. Run `CREATE DATABASE cricket_analysis;` to create the database

### Backend Setup
1. Navigate to `backend/`
2. Run `npm install` to install the node modules
3. Create a `.env` file in the project root
  - Insert `DATABASE_URL="postgresql://postgres:{password}@localhost:5432/cricket_analysis"` (replace `{password}`) and save
3. Run `npm run init` to parse the cricket data and fill the database
4. Run `npm run dev` to start the backend webserver

### Frontend Setup
1. Navigate to `frontend/`
2. Run `npm install` to install the node modules
3. Run `npm run dev` to start the frontend web app

### Usage
Just navigate to http://localhost:3000/ !