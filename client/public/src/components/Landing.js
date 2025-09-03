import React from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  const goToRegister = () => {
    navigate("/register");
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="landing-container">
      <h1>Welcome to Our App</h1>
      <p className="intro-text">A platform to Create an account to track your location and tasks . Choose an option below to get started:</p>
      <div className="button-container">
        <button onClick={goToRegister} className="btn-register">Register</button>
        <button onClick={goToLogin} className="btn-login">Login</button>
      </div>
    </div>
  );
}

export default Landing;
