import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setError("");
    try { await register(form.name, form.email, form.password); nav("/dashboard"); }
    catch (err) { setError(err.response?.data?.message || "Registration failed"); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ width: 380 }}>
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Create Account</h2>
        {error && <p style={{ color: "#fc8181", marginBottom: "1rem" }}>{error}</p>}
        <form onSubmit={submit}>
          <div className="form-group"><label>Name</label><input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div className="form-group"><label>Email</label><input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
          <div className="form-group"><label>Password</label><input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
          <button className="btn btn-primary" style={{ width: "100%" }} type="submit">Create Account</button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1rem" }}><Link to="/login">Already have an account? Login</Link></p>
      </div>
    </div>
  );
}
