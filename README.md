# Commute Portal

Welcome to **Commute Portal**! Users can search for a starting location and a destination, and the app will display the route on the map along with distance and estimated travel time for driving, cycling, or walking.

## Features

- **User Authentication:** Secure login and registration.
- **Commute Tracking:** Log daily commute details and view history.
- **Admin Dashboard:** Manage users, routes, and commute analytics.
- **Notifications:** Receive updates and alerts for commute events.
- **Google API Integration:** Fetch real-time route, distance, and traffic data using Google Maps APIs.
- **Responsive UI:** Accessible from both desktop and mobile devices.

## Getting Started

### Prerequisites

- Node.js (version 14+ recommended)
- npm or yarn package manager
- (Optional) MongoDB for data storage
- Google Maps API Key (for route and distance features)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Vikash8294/commute-portal.git
   cd commute-portal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the root directory.
   - Add required variables (see `.env.example` for reference).
   - **Google Maps API Key:**  
     Add your API key as `GOOGLE_MAPS_API_KEY=your-api-key` in your `.env` file.

4. **Start the application:**
   ```bash
   npm start
   # or
   yarn start
   ```

## Using Google API

The portal uses Google Maps APIs to:

- Calculate commute distances and estimated travel times
- Display route maps and traffic information
- Enhance accuracy of commute tracking

**Setup Steps:**

1. Obtain an API key from [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the required APIs:
    - Maps JavaScript API
    - Directions API
    - Distance Matrix API
3. Add your API key to the `.env` file as shown above.
4. The portal will automatically use the API for relevant features (route calculation, commute logs).

**How Google API Is Used:**

- When users log their commute, the portal queries the Google Maps APIs to calculate the exact distance and time needed based on real-time traffic and route information.
- Admin dashboards may utilize Google Maps for visualizing routes and commute patterns.
- All sensitive data (such as API keys) are securely managed using environment variables and never exposed in the source code.

## Usage

- Register a new account or login with existing credentials.
- Navigate through the dashboard to log commutes, view reports, and manage personal or administrative tasks.

## Project Structure

```
commute-portal/
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── ...
├── public/
├── package.json
├── README.md
└── ...
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Create a pull request.

## Contact

For questions or feedback, feel free to create an issue or reach out to [Vikash8294](https://github.com/Vikash8294).

```
Happy commuting!
```
