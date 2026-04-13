import React, { useState } from "react";
import { contentAPI, videoAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ContentDiscovery() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [url, setUrl]       = useState("");
  const nav = useNavigate();

  const fetchTrending = async () => {
    setLoading(true);
    try { const r = await contentAPI.getTrending(20); setItems(r.data); }
    catch (e) { alert("Error fetching trending content"); }
    finally { setLoading(false); }
  };

  const scrapeUrl = async () => {
    if (!url) return;
    setLoading(true);
    try { const r = await contentAPI.scrapeUrl(url); setItems([r.data]); }
    catch { alert("Error scraping URL"); }
    finally { setLoading(false); }
  };

  const generate = async (item) => {
    try {
      await videoAPI.generate(item, { duration: 30, voice: "alloy" });
      nav("/video");
    } catch { alert("Error generating video"); }
  };

  return (
    <div className="page">
      <h2 style={{ marginBottom: "1.5rem" }}>ðŸ” Content Discovery</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={fetchTrending} disabled={loading}>
          {loading ? "Loading..." : "Fetch Trending"}
        </button>
        <input placeholder="Or paste a URL..." value={url} onChange={e => setUrl(e.target.value)} style={{ flex: 1, padding: ".6rem", background: "#111", border: "1px solid #333", borderRadius: 8, color: "#fff" }} />
        <button className="btn btn-outline" onClick={scrapeUrl} disabled={loading}>Scrape URL</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1rem" }}>
        {items.map((item, i) => (
          <div key={i} className="card">
            {item.image && <img src={item.image} alt="" style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 8, marginBottom: ".8rem" }} />}
            <h4 style={{ marginBottom: ".5rem", fontSize: ".95rem" }}>{item.title || "Untitled"}</h4>
            <p style={{ color: "#aaa", fontSize: ".82rem", marginBottom: "1rem" }}>{item.text?.substring(0,120)}...</p>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => generate(item)}>ðŸŽ¬ Generate Video</button>
          </div>
        ))}
      </div>
    </div>
  );
}
