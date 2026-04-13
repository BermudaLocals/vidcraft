import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
export default function AuthCallback() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  useEffect(() => {
    const token = params.get("token");
    if (token) { localStorage.setItem("token", token); nav("/dashboard"); }
    else nav("/login");
  }, []);
  return null;
}
