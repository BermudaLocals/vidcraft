import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { videoAPI, socialAPI, userAPI } from "../services/api";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats]   = useState({ videos: 0, posted: 0, accounts: 0, scheduled: 0 });
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    Promise.all([videoAPI.list(), socialAPI.getAccounts(), socialAPI.scheduled(), userAPI.profile()])
      .then(([v, a, s, p]) => {
        setVideos(v.data.slice(0, 5));
        setStats({ videos: v.data.length, posted: p.data.postsPublished || 0, accounts: a.data.length, scheduled: s.data.length });
      }).catch(console.error);
  }, []);

  const statCards = [
    { label: "Videos Made",        value: stats.videos,    color: "#6c63ff" },
    { label: "Posts Published",    value: stats.posted,    color: "#38b2ac" },
    { label: "Social Accounts",    value: stats.accounts,  color: "#ed8936" },
    { label: "Scheduled Posts",    value: stats.scheduled, color: "#e53e3e" }
  ];

  return (
    <div className="page">
      <h1 style={{ marginBottom: ".5rem" }}>Welcome back, {currentUser?.name} ðŸ‘‹</h1>
      <p style={{ color: "#aaa", marginBottom: "2rem" }}>Here&apos;s your content automation overview.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {statCards.map(s => (
          <div key={s.label} className="card" style={{ borderLeft: `4px solid ${s.color}` }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ color: "#aaa", fontSize: ".85rem" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div className="card">
          <h3 style={{ marginBottom: "1rem" }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: ".7rem" }}>
            <Link to="/content" className="btn btn-primary">ðŸ” Discover Trending Content</Link>
            <Link to="/video"   className="btn btn-outline">ðŸŽ¬ Generate New Video</Link>
            <Link to="/social"  className="btn btn-outline">ðŸ”— Connect Social Account</Link>
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: "1rem" }}>Recent Videos</h3>
          {videos.length === 0 && <p style={{ color: "#aaa" }}>No videos yet. Generate your first one!</p>}
          {videos.map(v => (
            <div key={v._id} style={{ padding: ".5rem 0", borderBottom: "1px solid #222", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: ".9rem" }}>{v.title}</span>
              <span className={`badge badge-${v.status === "completed" ? "success" : "warning"}`}>{v.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
