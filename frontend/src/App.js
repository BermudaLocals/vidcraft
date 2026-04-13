import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ContentDiscovery from "./pages/ContentDiscovery";
import VideoGeneratorPage from "./pages/VideoGeneratorPage";
import SocialAccounts from "./pages/SocialAccounts";
import AuthCallback from "./pages/AuthCallback";
import "./App.css";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/"                 element={<Navigate to="/dashboard" />} />
          <Route path="/login"            element={<Login />} />
          <Route path="/register"         element={<Register />} />
          <Route path="/auth/callback"    element={<AuthCallback />} />
          <Route path="/dashboard"        element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/content"          element={<PrivateRoute><ContentDiscovery /></PrivateRoute>} />
          <Route path="/video"            element={<PrivateRoute><VideoGeneratorPage /></PrivateRoute>} />
          <Route path="/social"           element={<PrivateRoute><SocialAccounts /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
