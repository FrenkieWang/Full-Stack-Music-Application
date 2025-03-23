# Assignment 3: Full-Stack Music Application

## Introduction

This assignment looks at developing a full-stack application utilizing React, MySQL, Express, Node.JS, and Axios to create a music website.

## Objective

- Develop a full-stack application capable of storing music information.
- Utilize Axios and React to perform CRUD activities with your Express server and MySQL database.

## Task Description

### Task 1: React [Frontend Technology] (30%)

- **Boilerplate (5%):** Create a standard React application with a folder for each page (Artist, Songs, Albums). Include a Home Page with sections for the other three components.
- **Pages (25%):** Create a seperate React component for artists, songs and albums. Each component should have the appropriate input fields and buttons for each of the CRUD (Create, Retrieve, Update and Delete) commands. Each component should also have a div that displays any information received back from the server on the page. Each component should have the functionality to query the server with each of the CRUD commands and return data accordingly.

### Task 2: Express/Node.js [Backend Technology] (30%)

- **Boilerplate (10%):** Set up a Node.js project with an Express server connecting to your Maynooth CS230 MySQL database. Generate folders for controllers and routes. The server file should be named server.js and import all controllers and routes.
- **Controllers (10%):** Implement all CRUD functionality for artists, songs and albums in their own separate controllers.
- **Routes (10%):** Create routes for each controller in their own file to direct all requests based on URLs.

### Task 3: SQL [Database Technology] (20%)

- **Artist Model (5%):** Define an artist model with fields for Artist Name, Number of Monthly Listeners, Genre, and two lists (songs, albums) containing references to the appropriate items in other databases.
- **Song Model (5%):** Define a song model with fields for song name, release year, and album.
- **Album Model (10%):** Define an album model with fields for album name, artist, release year, number of listens, and a list of songs. The songs and artist should reference to the appropriate items in the other databases.

### Task 4: Demonstrator Explanation (20%)

Students will be asked two questions regarding the assignment and key concepts used in the project. Each question is worth 10% of the assignment.

## Deliverables

Submit a .ZIP file to Moodle containing the following items:

- frontend
- backend
- screenshot.jpg (Screenshot of the home page)

Exclude the `node_modules` folder from both.

Backend deployment:
https://cs230-lab3-backend.vercel.app/

Frontend deployment:
https://full-stack-music-application.vercel.app/# Full-Stack Music Application

## Introduction

This project is a full-stack application utilizing **React, MySQL, Express, Node.JS, and Axios** to create a music website.

Backend deployment:
https://cs230-lab3-backend.vercel.app/

Frontend deployment:
https://full-stack-music-application.vercel.app/

## Technology Stack

### 1) Frontend Technology: React 

- **Boilerplate:** It has a Home Page with Navbar Link for the three subPages - **Artist, Album and Song**.
- **Sub Pages:** The folder **pages** contains seperate React component for **artists, songs and albums**. Each component has  input fields and buttons for each of the CRUD **(Create, Retrieve, Update and Delete)** commands. Each component has a table that displays the information received back from the server on the page. Each component has the functionality to query the server with each of the **CRUD commands** and return data accordingly.

### 2) Backend Technology: Express/Node.js 

- **Boilerplate:** It is Node.js project with an Express server connecting to **Maynooth CS230 MySQL database** (https://webcourse.cs.nuim.ie/phpmyadmin/index.php). The main file is **server.js**, and it imports all controllers and routes saved in the folders
- **Controllers:** Implement all **CRUD functionality** for **artists, songs and albums** in their own separate controllers.
- **Routes:** Each controller directs all requests based on URLs.

### 3) Database Technology: SQL

- **Artist Model:** Table has fields for **artist name, number of monthly listeners, genre, and two JSON lists (songs, albums)** containing references to the appropriate items in other databases.
- **Album Model:** Table has fields for **album name, artist, release year, number of listens, and a JSON list (songs)** refers to the appropriate items in the other databases.
- **Song Model:** Table has fields for **song name, release year, and album**.

## Project Structure

```
frontend/                  # Project root directory
├── src/                   # Source code directory
│   ├── pages/             # Directory for page-level components
│   │   ├── Album.js       # Album page component
│   │   ├── AlbumsModal.js # Each Artist's Album
│   │   ├── Artist.js      # Artist page component
│   │   ├── Home.js        # Home page component
│   │   ├── Song.js        # Song page component
│   │   ├── SongsModal.js  # Each Artist/Album's song
│   ├── App.js             # Main application component
│   └── index.js           # Entry point for the React application
├── .env                   # Environment variable configuration file
├── .gitignore             # Git ignore rules
├── package.json           # Project metadata and dependency configuration
├── package-lock.json      # Exact version lock for dependencies
└── model.sql              # SQL file for database model definitions
```

```
backend/                   # Backend root directory
├── controllers/           # Controller logic (handles request processing)
│   ├── albumController.js # Controller for album-related logic
│   ├── artistController.js# Controller for artist-related logic
│   └── songController.js  # Controller for song-related logic
├── routes/                # API route definitions
│   ├── albumRoutes.js     # Routes for album endpoints
│   ├── artistRoutes.js    # Routes for artist endpoints
│   └── songRoutes.js      # Routes for song endpoints
├── node_modules/          # Installed backend dependencies
├── .env                   # Environment variables
├── .gitignore             # Git ignore rules
├── db.js                  # Database connection configuration
├── package.json           # Project metadata and dependencies
├── package-lock.json      # Dependency version lock
├── server.js              # Entry point for backend server (Express app)
└── vercel.json            # Vercel deployment configuration
```