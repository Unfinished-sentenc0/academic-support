import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAIL = "hannahessays445@gmail.com";

export default function Login() {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // redirect based on role
      if (email === ADMIN_EMAIL) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/\(.*\)/, "").trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        .cormorant { font-family: 'Cormorant Garamond', serif !important; }
        .dm { font-family: 'DM Sans', sans-serif !important; }
        input { width: 100%; background: #0e0e1a; border: 1px solid #1c1c2e; color: #f0ede6; font-family: 'DM Sans', sans-serif; font-size: 0.93rem; padding: 13px 16px; outline: none; transition: border-color 0.3s; box-sizing: border-box; border-radius: 0; }
        input:focus { border-color: #c9a84c; }
        input::placeholder { color: #444; }
        .btn-gold { font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.82rem; letter-spacing: 0.1em; text-transform: uppercase; background: linear-gradient(135deg, #c9a84c, #e8c97a); color: #07070f; border: none; padding: 15px 32px; cursor: pointer; transition: all 0.3s; width: 100%; }
        .btn-gold:hover { box-shadow: 0 12px 36px rgba(201,168,76,0.35); }
        .btn-gold:disabled { opacity: 0.6; cursor: not-allowed; }
        .tab { font-family: 'DM Sans', sans-serif; font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; padding: 10px 24px; transition: all 0.3s; border: none; background: none; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="cormorant" style={{ fontSize: "2rem", fontWeight: 700, color: "#f0ede6" }}>
            Academic<span style={{ color: "#c9a84c" }}>Pro</span>
          </div>
          <div className="dm" style={{ color: "#555", fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 6 }}>
            Student Portal
          </div>
        </div>

        <div style={{ background: "#0e0e1a", border: "1px solid #1c1c2e", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #c9a84c, #e8c97a)" }} />

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #14141e" }}>
            {["login", "register"].map(m => (
              <button key={m} className="tab" onClick={() => { setMode(m); setError(""); }} style={{
                flex: 1, color: mode === m ? "#c9a84c" : "#555",
                borderBottom: mode === m ? "2px solid #c9a84c" : "2px solid transparent",
              }}>{m === "login" ? "Sign In" : "Register"}</button>
            ))}
          </div>

          <div style={{ padding: "32px" }}>
            <h2 className="cormorant" style={{ fontSize: "1.6rem", fontWeight: 700, color: "#f0ede6", marginBottom: 8 }}>
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="dm" style={{ color: "#555", fontSize: "0.82rem", marginBottom: 28 }}>
              {mode === "login" ? "Sign in to track your orders" : "Register to start tracking your orders"}
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {mode === "register" && (
                <div>
                  <label className="dm" style={{ display: "block", fontSize: "0.69rem", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Full Name</label>
                  <input required placeholder="John Smith" value={name} onChange={e => setName(e.target.value)} />
                </div>
              )}
              <div>
                <label className="dm" style={{ display: "block", fontSize: "0.69rem", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Email</label>
                <input required type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="dm" style={{ display: "block", fontSize: "0.69rem", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Password</label>
                <input required type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              </div>

              {error && (
                <div className="dm" style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff6b6b", padding: "10px 14px", fontSize: "0.82rem" }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn-gold" disabled={loading} style={{ marginTop: 6 }}>
                {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
              </button>
            </form>

            <div className="dm" style={{ textAlign: "center", marginTop: 20, color: "#444", fontSize: "0.78rem" }}>
              <a href="/" style={{ color: "#c9a84c", textDecoration: "none" }}>← Back to website</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
