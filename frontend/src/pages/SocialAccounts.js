import React, { useState, useEffect } from "react";
import { socialAPI } from "../services/api";

const PLATFORMS = ["youtube","tiktok","instagram","twitter"];
const ICONS     = { youtube: "â–¶ï¸", tiktok: "ðŸŽµ", instagram: "ðŸ“¸", twitter: "ðŸ¦" };

export default function SocialAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm]         = useState({ platform: "youtube", accountId: "", accountName: "", accessToken: "" });
  const [loading, setLoading]   = useState(false);

  useEffect(() => { socialAPI.getAccounts().then(r => setAccounts(r.data)).catch(console.error); }, []);

  const connect = async () => {
    if (!form.accountId || !form.accountName || !form.accessToken) return alert("Fill all fields");
    setLoading(true);
    try {
      const r = await socialAPI.connect(form.platform, { accountId: form.accountId, accountName: form.accountName, accessToken: form.accessToken });
      setAccounts(prev => { const f = prev.filter(a => a.platform !== form.platform); return [...f, r.data]; });
      setForm({ platform: "youtube", accountId: "", accountName: "", accessToken: "" });
    } catch { alert("Failed to connect account"); }
    finally { setLoading(false); }
  };

  const disconnect = async (platform) => {
    if (!window.confirm(`Disconnect ${platform}?`)) return;
    await socialAPI.disconnect(platform);
    setAccounts(accounts.filter(a => a.platform !== platform));
  };

  return (
    <div className="page">
      <h2 style={{ marginBottom: "1.5rem" }}>ðŸ”— Social Accounts</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div>
          <h3 style={{ marginBottom: "1rem" }}>Connected Accounts</h3>
          {accounts.length === 0 && <p style={{ color: "#aaa" }}>No accounts connected yet.</p>}
          {accounts.map(a => (
            <div key={a.platform} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{ICONS[a.platform]} {a.platform.charAt(0).toUpperCase()+a.platform.slice(1)}</div>
                <div style={{ color: "#aaa", fontSize: ".85rem" }}>@{a.accountName}</div>
              </div>
              <button className="btn btn-danger" onClick={() => disconnect(a.platform)}>Disconnect</button>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{ marginBottom: "1rem" }}>Connect New Account</h3>
          <div className="form-group">
            <label>Platform</label>
            <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}>
              {PLATFORMS.map(p => <option key={p} value={p}>{ICONS[p]} {p}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Account Username</label><input value={form.accountName} onChange={e => setForm({...form, accountName: e.target.value})} placeholder="e.g. myaccount" /></div>
          <div className="form-group"><label>Account ID</label><input value={form.accountId} onChange={e => setForm({...form, accountId: e.target.value})} /></div>
          <div className="form-group"><label>Access Token</label><input type="password" value={form.accessToken} onChange={e => setForm({...form, accessToken: e.target.value})} /></div>
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={connect} disabled={loading}>{loading ? "Connecting..." : "Connect Account"}</button>
        </div>
      </div>
    </div>
  );
}
