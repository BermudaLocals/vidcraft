import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const nav = useNavigate();
  const handleLogout = () => { logout(); nav("/login"); };
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">âš¡ VidCraft</Link>
      {currentUser ? (
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/content">Discover</Link>
          <Link to="/video">Generate</Link>
          <Link to="/social">Social</Link>
          <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="navbar-links">
          <Link to="/login">Login</Link>
          <Link to="/register" className="btn btn-primary">Sign Up</Link>
        </div>
      )}
    </nav>
  );
}
