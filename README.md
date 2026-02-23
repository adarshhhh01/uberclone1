# Uber Clone

This project is a full-stack web application that mimics the core functionalities of Uber. It is built using the MERN stack (MongoDB, Express.js, React, Node.js) and features separate frontend and backend applications.

## Features

*   **User Authentication:** Secure registration and login for both riders and drivers.
*   **Real-time Ride Booking:** Users can request rides, and available drivers can accept them.
*   **Live Location Tracking:** See drivers on the map in real-time using geolocation.
*   **Profile Management:** Users can view and update their profile information.
*   **Ride History:** View past ride details and history.
*   **Interactive Map Interface:** Built with a mapping service like Google Maps for an intuitive user experience.

## Tech Stack

### Backend

*   **[Node.js](https://nodejs.org/)**: JavaScript runtime environment.
*   **[Express.js](https://expressjs.com/)**: Web framework for Node.js to build RESTful APIs.
*   **[MongoDB](https://www.mongodb.com/)**: NoSQL database to store user, driver, and ride data.
*   **[Mongoose](https://mongoosejs.com/)**: Object Data Modeling (ODM) library for MongoDB and Node.js.
*   **[JSON Web Tokens (JWT)](https://jwt.io/)**: For securing the APIs and managing user sessions.
*   **[Socket.IO](https://socket.io/)**: For enabling real-time, bidirectional communication for location tracking and ride status updates.
*   **[dotenv](https://www.npmjs.com/package/dotenv)**: To manage environment variables.

### Frontend

*   **[React.js](https://reactjs.org/)**: A JavaScript library for building user interfaces.
*   **[React Router](https://reactrouter.com/)**: For declarative routing in the React application.
*   **[Axios](https://axios-http.com/)**: Promise-based HTTP client for making API requests to the backend.
*   **[Socket.IO Client](https://socket.io/docs/v4/client-api/)**: To connect to the backend for real-time updates.
*   **[Google Maps API / Mapbox](https://developers.google.com/maps)**: For rendering maps and handling location services.

## Project Structure

The project is organized into two main directories: `Frontend` and `Backend`.

```
uberclone1/
├── Backend/
│   ├── controllers/  # Application logic
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   ├── .env          # Environment variables
│   └── server.js     # Express server entry point
│
└── Frontend/
    ├── public/
    ├── src/
    │   ├── components/ # Reusable React components
    │   ├── pages/      # Page components (Home, Login, etc.)
    │   ├── services/   # API call functions
    │   ├── App.js
    │   └── index.js
    └── .env            # Frontend environment variables
```

## Environment Variables

This project uses `.env` files to store sensitive information and configuration settings. You will need to create a `.env` file in both the `Backend` and `Frontend` directories.

### Backend `.env`

Create a file named `.env` in the `c:/Users/Addy/Desktop/uberclone1/Backend/` directory and add the following variables. Replace the placeholder values with your actual configuration.

```env
# Backend/.env

# Server Configuration
PORT=5000

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/uberclone

# JSON Web Token
JWT_SECRET=your_super_secret_jwt_key

# Google Maps API Key (or other mapping service)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Frontend `.env`

Create a file named `.env` in the `c:/Users/Addy/Desktop/uberclone1/Frontend/` directory. For Create React App, variables must be prefixed with `REACT_APP_`.

```env
# Frontend/.env

# The URL of your backend server
REACT_APP_API_URL=http://localhost:5000

# Google Maps API Key for the frontend client
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Installation and Setup

Follow these steps to get the application running on your local machine.

### Prerequisites

*   Node.js (v14 or later)
*   npm or yarn
*   MongoDB installed and running.

### Backend Setup

1.  **Navigate to the backend directory:**
    ```sh
    cd c:/Users/Addy/Desktop/uberclone1/Backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create and populate the `.env` file** as described in the Backend `.env` section.

4.  **Start the backend server:**
    ```sh
    npm start
    ```
    The server should now be running on `http://localhost:5000`.

### Frontend Setup

1.  **Open a new terminal and navigate to the frontend directory:**
    ```sh
    cd c:/Users/Addy/Desktop/uberclone1/Frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create and populate the `.env` file** as described in the Frontend `.env` section.

4.  **Start the React development server:**
    ```sh
    npm start
    ```
    The application should now be running and open in your browser at `http://localhost:3000`.

## API Endpoints (Backend Routes)

The backend exposes the following REST API endpoints. These would be defined in `c:/Users/Addy/Desktop/uberclone1/Backend/routes/`.

| Method | Endpoint                     | Description                               |
| :----- | :--------------------------- | :---------------------------------------- |
| `POST` | `/api/auth/register`         | Register a new user (rider or driver).    |
| `POST` | `/api/auth/login`            | Authenticate a user and get a JWT token.  |
| `GET` | `/api/users/profile`         | Get the profile of the logged-in user.    |
| `PUT` | `/api/users/profile`         | Update the profile of the logged-in user. |
| `POST` | `/api/rides/request`         | A rider requests a new ride.              |
| `GET` | `/api/rides`                 | Get a list of rides for the current user. |
| `GET` | `/api/rides/:id`             | Get details of a specific ride.           |
| `PUT` | `/api/rides/:id/accept`      | A driver accepts a ride request.          |
| `PUT` | `/api/rides/:id/status`      | Update the status of a ride (e.g., started, completed). |
| `POST`| `/api/drivers/location`      | Update a driver's current location.       |

## Application Pages (Frontend Routes)

The frontend contains the following pages, managed by React Router. These would be defined in `c:/Users/Addy/Desktop/uberclone1/Frontend/src/pages/`.

| Path              | Page Component      | Description                                       |
| :---------------- | :------------------ | :------------------------------------------------ |
| `/`               | `HomePage`          | Main page with the map, for booking and viewing rides. |
| `/login`          | `LoginPage`         | User login page.                                  |
| `/register`       | `RegisterPage`      | User registration page.                           |
| `/profile`        | `ProfilePage`       | View and edit user profile.                       |
| `/ride-history`   | `RideHistoryPage`   | Lists all past rides for the user.                |
| `/ride/:id`       | `RideDetailPage`    | Shows the status and details of an active or past ride. |

---

*This README was generated by Gemini Code Assist. Feel free to update it with more specific details about your project's implementation.*

