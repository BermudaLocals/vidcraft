import React, { useState, useEffect } from "react";
import { videoAPI, socialAPI } from "../services/api";

export default function VideoGeneratorPage() {
  const [videos, setVideos]       = useState([]);
  const [accounts, setAccounts]   = useState([]);
  const [selected, setSelected]   = useState(null);
  const [caption, setCaption]     = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [schedDate, setSchedDate] = useState("");
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    videoAPI.list().then(r => setVideos(r.data)).catch(console.error);
    socialAPI.getAccounts().then(r => setAccounts(r.data)).catch(console.error);
  }, []);

  const togglePlatform = (p) => setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const publish = async () => {
    if (!selected || !platforms.length) return alert("Select a video and at least one platform");
    setLoading(true);
    try {
      await socialAPI.publish(selected._id, caption, platforms, schedDate || null);
      alert(schedDate ? "Post scheduled!" : "Published successfully!");
    } catch { alert("Publish failed"); }
    finally { setLoading(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this video?")) return;
    await videoAPI.remove(id);
    setVideos(videos.filter(v => v._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  return (
    <div className="page" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem" }}>
      <div>
        <h2 style={{ marginBottom: "1.5rem" }}>ðŸŽ¬ My Videos</h2>
        {videos.length === 0 && <p style={{ color: "#aaa" }}>No videos yet. Discover content and generate your first!</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {videos.map(v => (
            <div key={v._id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", border: selected?._id === v._id ? "2px solid #6c63ff" : undefined }}
              onClick={() => setSelected(v)}>
              <div>
                <strong>{v.title}</strong>
                <p style={{ color: "#aaa", fontSize: ".82rem", marginTop: ".3rem" }}>{v.script?.substring(0,80)}...</p>
              </div>
              <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                <span className={`badge badge-${v.status === "completed" ? "success" : "warning"}`}>{v.status}</span>
                <button className="btn btn-danger" onClick={e => { e.stopPropagation(); remove(v._id); }}>âœ•</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="card" style={{ position: "sticky", top: "5rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>ðŸ“¤ Publish</h3>
          {!selected ? <p style={{ color: "#aaa" }}>Select a video to publish</p> : (
            <>
              <p style={{ marginBottom: "1rem", fontSize: ".9rem", color: "#aaa" }}>Selected: <strong style={{ color: "#fff" }}>{selected.title}</strong></p>
              <div className="form-group"><label>Caption</label><textarea rows={3} value={caption} onChange={e => setCaption(e.target.value)} placeholder="Write your caption..." /></div>
              <div className="form-group">
                <label>Platforms</label>
                <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                  {accounts.map(a => (
                    <button key={a.platform} className={`btn ${platforms.includes(a.platform) ? "btn-primary" : "btn-outline"}`} style={{ fontSize: ".8rem" }}
                      onClick={() => togglePlatform(a.platform)}>{a.platform}</button>
                  ))}
                  {accounts.length === 0 && <p style={{ color: "#aaa", fontSize: ".85rem" }}>No social accounts connected</p>}
                </div>
              </div>
              <div className="form-group"><label>Schedule (optional)</label><input type="datetime-local" value={schedDate} onChange={e => setSchedDate(e.target.value)} /></div>
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={publish} disabled={loading}>{loading ? "Publishing..." : schedDate ? "Schedule Post" : "Publish Now"}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
