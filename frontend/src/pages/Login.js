import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setError("");
    try { await login(form.email, form.password); nav("/dashboard"); }
    catch (err) { setError(err.response?.data?.message || "Login failed"); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ width: 380 }}>
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Welcome Back</h2>
        {error && <p style={{ color: "#fc8181", marginBottom: "1rem" }}>{error}</p>}
        <form onSubmit={submit}>
          <div className="form-group"><label>Email</label><input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
          <div className="form-group"><label>Password</label><input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
          <button className="btn btn-primary" style={{ width: "100%" }} type="submit">Login</button>
        </form>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <a href={authAPI.googleUrl()} className="btn btn-outline" style={{ display: "block", marginBottom: ".5rem" }}>Continue with Google</a>
          <Link to="/register">Don&apos;t have an account? Sign up</Link>
        </div>
      </div>
    </div>
  );
}
