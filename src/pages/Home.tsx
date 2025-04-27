import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Rekindle</h1>
      <p>Your place to connect and share memories.</p>

      <div className="action-buttons">
        <Link className="btn-primary" to="/login">
          Login
        </Link>
        <Link className="btn-secondary" to="/register">
          Register
        </Link>
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <ul>
          <li>Connect with friends and family</li>
          <li>Share your stories and memories</li>
          <li>Stay updated with your loved ones</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
