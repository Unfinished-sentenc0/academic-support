import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAIL = "hannahessays445@gmail.com";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .cormorant { font-family: 'Cormorant Garamond', serif !important; }
        .dm { font-family: 'DM Sans', sans-serif !important; }
        .input-wrap { position: relative; width: 100%; }
        .input-wrap input { width: 100%; background: #0e0e1a; border: 1px solid #1c1c2e; color: #f0ede6; font-family: 'DM Sans', sans-serif; font-size: 0.93rem; padding: 13px 44px 13px 16px; outline: none; transition: border-color 0.3s; border-radius: 0; box-sizing: border-box; }
        .input-wrap input:focus { border-color: #c9a84c; }
        .input-wrap input::placeholder { color: #444; }
        .eye-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #555; font-size: 1rem; transition: color 0.2s; padding: 0; display: flex; align-items: center; }
        .eye-btn:hover { color: #c9a84c; }
        .plain-input { width: 100%; background: #0e0e1a; border: 1px solid #1c1c2e; color: #f0ede6; font-family: 'DM Sans', sans-serif; font-size: 0.93rem; padding: 13px 16px; outline: none; transition: border-color 0.3s; border-radius: 0; box-sizing: border-box; }
        .plain-input:focus { border-color: #c9a84c; }
        .plain-input::placeholder { color: #444; }
        .btn-gold { font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.82rem; letter-spacing: 0.1em; text-transform: uppercase; background: linear-gradient(135deg, #c9a84c, #e8c97a); color: #07070f; border: none; padding: 15px 32px; cursor: pointer; transition: all 0.3s; width: 100%; }
        .btn-gold:hover { box-shadow: 0 12px 36px rgba(201,168,76,0.35); }
        .btn-gold:disabled { opacity: 0.6; cursor: not-allowed; }
        .tab { font-family: 'DM Sans', sans-serif; font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; padding: 10px 24px; transition: all 0.3s; border: none; background: none; flex: 1; }
        ::-webkit-scrollbar { width: 3px; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <a href="/" className="cormorant" style={{ fontSize: "2rem", fontWeight: 700, color: "#f0ede6", textDecoration: "none" }}>
            Academic<span style={{ color: "#c9a84c" }}>Pro</span>
          </a>
          <div className="dm" style={{ color: "#555", fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 6 }}>
            Student Portal
          </div>
        </div>

        <div style={{ background: "#0e0e1a", border: "1px solid #1c1c2e", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #c9a84c, #e8c97a)" }} />

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #14141e" }}>
            {["login", "register"].map(m => (
              <button key={m} className="tab" onClick={() => { setMode(m); setError(""); setShowPassword(false); }} style={{
                color: mode === m ? "#c9a84c" : "#555",
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
                  <input className="plain-input" required placeholder="John Smith" value={name} onChange={e => setName(e.target.value)} />
                </div>
              )}

              <div>
                <label className="dm" style={{ display: "block", fontSize: "0.69rem", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Email</label>
                <input className="plain-input" required type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <div>
                <label className="dm" style={{ display: "block", fontSize: "0.69rem", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Password</label>
                <div className="input-wrap">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    minLength={6}
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(v => !v)} title={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? (
                      // Eye-off icon
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      // Eye icon
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {mode === "register" && (
                  <div className="dm" style={{ color: "#444", fontSize: "0.72rem", marginTop: 6 }}>Minimum 6 characters</div>
                )}
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

            <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <a href="/" className="dm" style={{ color: "#c9a84c", fontSize: "0.78rem", textDecoration: "none" }}>← Back to website</a>
              {mode === "login" && (
                <span className="dm" style={{ color: "#555", fontSize: "0.78rem", cursor: "pointer" }}
                  onClick={() => { setMode("register"); setError(""); }}>
                  No account? <span style={{ color: "#c9a84c" }}>Register</span>
                </span>
              )}
              {mode === "register" && (
                <span className="dm" style={{ color: "#555", fontSize: "0.78rem", cursor: "pointer" }}
                  onClick={() => { setMode("login"); setError(""); }}>
                  Have an account? <span style={{ color: "#c9a84c" }}>Sign in</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}