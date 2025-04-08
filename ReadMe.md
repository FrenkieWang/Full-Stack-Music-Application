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