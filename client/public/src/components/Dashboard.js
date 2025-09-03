/* global google */
import React, { useState, useEffect } from "react";
import './dashboard.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [mode, setMode] = useState("DRIVING");
  const [output, setOutput] = useState("");
  const [transitData, setTransitData] = useState("");
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [currentCircle, setCurrentCircle] = useState(null);

  const navigate = useNavigate();

  const FARE_RATES = {
    DRIVING: 10,
    WALKING: 0,
    TRANSIT: 5
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage(res.data.message);
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);
// AIzaSyDfJULX80zT6mcY3_gzn8R9GWg1QVcpg1w
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script");
      // script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDPh78gnC21VGbJeZ85M8jYIwEzEVi2GJM&libraries=places,directions`;
      // AIzaSyDfJULX80zT6mcY3_gzn8R9GWg1QVcpg1w   // old key
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDPh78gnC21VGbJeZ85M8jYIwEzEVi2GJM&libraries=places,directions`;

      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGoogleLoaded(true);
        const mapInstance = new google.maps.Map(document.getElementById("map"), {
          center: { lat: 40.730610, lng: -73.935242 },
          zoom: 12,
        });
        setMap(mapInstance);
      };
      script.onerror = () => {
        console.error("Error loading Google Maps API");
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const toggleTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      return alert("Geolocation not supported by your browser.");
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setOrigin(`${center.lat}, ${center.lng}`);

        if (google && map) {
          new google.maps.Marker({
            position: center,
            map: map,
            title: "You are here",
          });

          if (currentCircle) {
            currentCircle.setMap(null);
          }

          const circle = new google.maps.Circle({
            strokeColor: "#1E90FF",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#1E90FF",
            fillOpacity: 0.35,
            map: map,
            center: center,
            radius: 500,
          });

          setCurrentCircle(circle);
          map.setCenter(center);
          map.setZoom(15);
        }
      },
      (error) => {
        console.error("Error retrieving location:", error);
        alert("Unable to retrieve your location.");
      }
    );
  };

  const calculateRoute = () => {
    if (!origin || !destination) {
      return alert("Please enter both origin and destination.");
    }

    if (!googleLoaded) {
      return alert("Google Maps API is still loading. Please try again later.");
    }

    if (!map) {
      return alert("Map is not initialized. Please wait a moment.");
    }

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode[mode],
      },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
          const leg = result.routes[0].legs[0];

          // Fare Calculation
          const distanceInKm = leg.distance.value / 1000;
          const fareRate = FARE_RATES[mode] || 0;
          const fare = distanceInKm * fareRate;

          setOutput(`
            <strong>Mode:</strong> ${mode}<br>
            <strong>From:</strong> ${leg.start_address}<br>
            <strong>To:</strong> ${leg.end_address}<br>
            <strong>Distance:</strong> ${leg.distance.text}<br>
            <strong>Duration:</strong> ${leg.duration.text}<br>
            <strong>Estimated Fare:</strong> ₹${fare.toFixed(2)}
          `);
        } else if (status === "ZERO_RESULTS" && mode === "TRANSIT") {
          setOutput(`
            <strong>Mode:</strong> Transit<br>
            <em>No live transit route found; showing dummy options below.</em>
          `);
        } else {
          alert("Could not retrieve directions: " + status);  
        }
      }
    );
  };

  const dummyTransitData = {
    bus: [
      { line: "Bus 42", departure: "08:15 AM", arrival: "09:00 AM", fare: "₹30" },
      { line: "Bus 21A", departure: "08:45 AM", arrival: "09:35 AM", fare: "₹25" },
    ],
    train: [
      { line: "Local Express", departure: "08:10 AM", arrival: "08:50 AM", fare: "₹50" },
      { line: "City Rapid", departure: "08:30 AM", arrival: "09:05 AM", fare: "₹45" },
    ],
  };

  useEffect(() => {
    if (mode === "TRANSIT") {
      setTransitData(`
        <h4>Bus Options:</h4>
        <ul>
          ${dummyTransitData.bus
            .map(
              (b) =>
                `<li>${b.line}: Departs ${b.departure}, Arrives ${b.arrival}, Fare ${b.fare}</li>`
            )
            .join("")}
        </ul>
        <h4>Train Options:</h4>
        <ul>
          ${dummyTransitData.train
            .map(
              (t) =>
                `<li>${t.line}: Departs ${t.departure}, Arrives ${t.arrival}, Fare ${t.fare}</li>`
            )
            .join("")}
        </ul>
      `);
    } else {
      setTransitData("");
    }
  }, [mode]);

  return (
    <div>
      <h2>Route Finder</h2>
      <div>
        <input
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="Enter Origin"
        />
        <button onClick={useCurrentLocation}>Use Current Location</button>
        <br /><br />

        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter Destination"
        />
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="DRIVING">Driving</option>
          <option value="WALKING">Walking</option>
          <option value="TRANSIT">Transit (Bus/Train)</option>
        </select>
        <button onClick={calculateRoute}>Get Route</button>
        <p dangerouslySetInnerHTML={{ __html: output }}></p>
        <div dangerouslySetInnerHTML={{ __html: transitData }} />
      </div>

      <div id="map" style={{ height: "80vh", width: "100%" }}></div>

      <div className="task-manager">
        <input
          type="text"
          placeholder="Enter a new route..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add Route</button>

        <ul>
          {tasks.map((task, index) => (
            <li key={index} className={task.completed ? "completed" : ""}>
              <span onClick={() => toggleTask(index)}>{task.text}</span>
              <button onClick={() => deleteTask(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="actions">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;


