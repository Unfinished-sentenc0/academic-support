import { useState, useEffect, useRef } from "react";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import { collection, query, where, onSnapshot, addDoc, orderBy, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const STATUS_STEPS = ["Pending", "Confirmed", "In Progress", "Review", "Delivered"];
const STATUS_COLORS = { Pending: "#888", Confirmed: "#4a9eff", "In Progress": "#f0a500", Review: "#a855f7", Delivered: "#25d366" };

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const q = query(collection(db, "orders"), where("studentEmail", "==", user.email), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!selectedOrder) return;
    const q = query(collection(db, "orders", selectedOrder.id, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsub();
  }, [selectedOrder]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    await addDoc(collection(db, "orders", selectedOrder.id, "messages"), {
      text: newMsg.trim(),
      sender: "student",
      senderEmail: user.email,
      createdAt: serverTimestamp(),
    });
    setNewMsg("");
  };

  const handleLogout = async () => { await signOut(auth); navigate("/login"); };

  const statusIndex = (status) => STATUS_STEPS.indexOf(status);

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "#f0ede6", fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .cormorant { font-family: 'Cormorant Garamond', serif !important; }
        .dm { font-family: 'DM Sans', sans-serif !important; }
        .order-card { background: #0e0e1a; border: 1px solid #1c1c2e; padding: 20px 24px; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden; }
        .order-card:hover, .order-card.active { border-color: rgba(201,168,76,0.4); }
        .order-card::before { content: ''; position: absolute; left: 0; top: 0; width: 3px; height: 0; background: #c9a84c; transition: height 0.3s; }
        .order-card:hover::before, .order-card.active::before { height: 100%; }
        .msg-bubble { max-width: 75%; padding: 10px 14px; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; line-height: 1.5; border-radius: 0; }
        .msg-student { background: linear-gradient(135deg, #c9a84c, #e8c97a); color: #07070f; align-self: flex-end; }
        .msg-admin { background: #1a1a2e; color: #ccc; border: 1px solid #2a2a3e; align-self: flex-start; }
        input[type="text"] { background: #0e0e1a; border: 1px solid #1c1c2e; color: #f0ede6; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; padding: 12px 16px; outline: none; transition: border-color 0.3s; flex: 1; border-radius: 0; }
        input[type="text"]:focus { border-color: #c9a84c; }
        input[type="text"]::placeholder { color: #444; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: #07070f; } ::-webkit-scrollbar-thumb { background: #c9a84c; }
        @media (max-width: 768px) {
          .dash-layout { grid-template-columns: 1fr !important; }
          .chat-panel { display: ${selectedOrder ? "flex" : "none"} !important; }
          .orders-panel { display: ${selectedOrder ? "none" : "block"} !important; }
        }
      `}</style>

      {/* Top Nav */}
      <nav style={{ background: "rgba(7,7,15,0.97)", borderBottom: "1px solid #14141e", padding: "0 6%", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div className="cormorant" style={{ fontSize: "1.3rem", fontWeight: 700 }}>Academic<span style={{ color: "#c9a84c" }}>Pro</span> <span className="dm" style={{ fontSize: "0.72rem", color: "#555", letterSpacing: "0.15em", textTransform: "uppercase" }}>My Orders</span></div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div className="dm" style={{ color: "#555", fontSize: "0.8rem" }}>{user?.email}</div>
          <button onClick={handleLogout} className="dm" style={{ background: "none", border: "1px solid #1c1c2e", color: "#888", padding: "8px 16px", cursor: "pointer", fontSize: "0.78rem", transition: "all 0.2s" }}
            onMouseEnter={e => { e.target.style.borderColor = "#c9a84c"; e.target.style.color = "#c9a84c"; }}
            onMouseLeave={e => { e.target.style.borderColor = "#1c1c2e"; e.target.style.color = "#888"; }}
          >Sign Out</button>
        </div>
      </nav>

      <div className="dash-layout" style={{ display: "grid", gridTemplateColumns: "360px 1fr", minHeight: "calc(100vh - 64px)" }}>

        {/* LEFT — Orders list */}
        <div className="orders-panel" style={{ borderRight: "1px solid #14141e", overflowY: "auto", maxHeight: "calc(100vh - 64px)" }}>
          <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #14141e" }}>
            <div className="dm" style={{ color: "#555", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>Your Orders</div>
            <div className="cormorant" style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: 4 }}>{orders.length} {orders.length === 1 ? "Order" : "Orders"}</div>
          </div>

          {loading ? (
            <div className="dm" style={{ padding: 24, color: "#555", fontSize: "0.85rem" }}>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📋</div>
              <div className="cormorant" style={{ fontSize: "1.2rem", marginBottom: 8 }}>No orders yet</div>
              <div className="dm" style={{ color: "#555", fontSize: "0.82rem", marginBottom: 20 }}>Place your first order to get started</div>
              <a href="/" className="dm" style={{ color: "#c9a84c", fontSize: "0.78rem", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>← Go to website</a>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {orders.map(order => (
                <div key={order.id} className={`order-card${selectedOrder?.id === order.id ? " active" : ""}`} onClick={() => setSelectedOrder(order)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div className="cormorant" style={{ fontSize: "1.05rem", fontWeight: 700, flex: 1, marginRight: 8 }}>{order.service}</div>
                    <div className="dm" style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.08em", color: STATUS_COLORS[order.status] || "#888", background: "rgba(255,255,255,0.04)", padding: "3px 8px", flexShrink: 0, textTransform: "uppercase" }}>{order.status || "Pending"}</div>
                  </div>
                  <div className="dm" style={{ color: "#555", fontSize: "0.78rem", marginBottom: 10 }}>
                    {order.createdAt?.toDate?.()?.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) || "Just now"}
                  </div>
                  {/* mini progress bar */}
                  <div style={{ height: 3, background: "#1a1a2e", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${((statusIndex(order.status || "Pending") + 1) / STATUS_STEPS.length) * 100}%`, background: STATUS_COLORS[order.status || "Pending"], transition: "width 0.5s ease", borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Order detail + chat */}
        <div className="chat-panel" style={{ display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 64px)" }}>
          {!selectedOrder ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: "3rem" }}>💬</div>
              <div className="cormorant" style={{ fontSize: "1.4rem", color: "#555" }}>Select an order to view details</div>
            </div>
          ) : (
            <>
              {/* Order header */}
              <div style={{ padding: "20px 28px", borderBottom: "1px solid #14141e", background: "#0a0a12" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div className="dm" style={{ color: "#555", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>Order Details</div>
                    <div className="cormorant" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{selectedOrder.service}</div>
                  </div>
                  <div className="dm" style={{ fontSize: "0.72rem", fontWeight: 600, color: STATUS_COLORS[selectedOrder.status || "Pending"], background: "rgba(255,255,255,0.04)", border: `1px solid ${STATUS_COLORS[selectedOrder.status || "Pending"]}40`, padding: "6px 14px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {selectedOrder.status || "Pending"}
                  </div>
                </div>

                {/* Status timeline */}
                <div style={{ display: "flex", gap: 0, marginTop: 20, position: "relative" }}>
                  <div style={{ position: "absolute", top: 10, left: 10, right: 10, height: 2, background: "#1a1a2e", zIndex: 0 }} />
                  <div style={{ position: "absolute", top: 10, left: 10, height: 2, width: `${(statusIndex(selectedOrder.status || "Pending") / (STATUS_STEPS.length - 1)) * (100 - (20 / STATUS_STEPS.length))}%`, background: "#c9a84c", zIndex: 1, transition: "width 0.5s ease" }} />
                  {STATUS_STEPS.map((step, i) => {
                    const done = i <= statusIndex(selectedOrder.status || "Pending");
                    return (
                      <div key={step} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 2 }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: done ? "#c9a84c" : "#1a1a2e", border: `2px solid ${done ? "#c9a84c" : "#2a2a3e"}`, transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {done && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#07070f" }} />}
                        </div>
                        <div className="dm" style={{ fontSize: "0.6rem", color: done ? "#c9a84c" : "#444", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>{step}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Order info */}
                <div style={{ display: "flex", gap: 24, marginTop: 16, flexWrap: "wrap" }}>
                  {[
                    { label: "Plan", val: selectedOrder.plan || "—" },
                    { label: "Deadline", val: selectedOrder.deadline ? new Date(selectedOrder.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—" },
                    { label: "Submitted", val: selectedOrder.createdAt?.toDate?.()?.toLocaleDateString("en-GB") || "—" },
                  ].map(f => (
                    <div key={f.label}>
                      <div className="dm" style={{ color: "#555", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 2 }}>{f.label}</div>
                      <div className="dm" style={{ color: "#ccc", fontSize: "0.85rem" }}>{f.val}</div>
                    </div>
                  ))}
                </div>

                {/* Back button on mobile */}
                <button onClick={() => setSelectedOrder(null)} className="dm" style={{ display: "none", marginTop: 12, background: "none", border: "none", color: "#c9a84c", fontSize: "0.78rem", cursor: "pointer", padding: 0 }} id="back-btn">← Back to orders</button>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px", display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="dm" style={{ color: "#333", fontSize: "0.72rem", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Chat with your writer</div>
                {messages.length === 0 && (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div className="dm" style={{ color: "#333", fontSize: "0.82rem" }}>No messages yet — ask your writer anything!</div>
                  </div>
                )}
                {messages.map(msg => (
                  <div key={msg.id} style={{ display: "flex", justifyContent: msg.sender === "student" ? "flex-end" : "flex-start" }}>
                    <div className="msg-bubble" style={{ background: msg.sender === "student" ? "linear-gradient(135deg, #c9a84c, #e8c97a)" : "#1a1a2e", color: msg.sender === "student" ? "#07070f" : "#ccc", border: msg.sender === "admin" ? "1px solid #2a2a3e" : "none" }}>
                      {msg.sender === "admin" && <div style={{ fontSize: "0.65rem", color: "#c9a84c", marginBottom: 4, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>Writer</div>}
                      {msg.text}
                      <div style={{ fontSize: "0.65rem", opacity: 0.5, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>
                        {msg.createdAt?.toDate?.()?.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) || ""}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <form onSubmit={sendMessage} style={{ padding: "16px 28px", borderTop: "1px solid #14141e", display: "flex", gap: 8 }}>
                <input type="text" placeholder="Ask your writer something..." value={newMsg} onChange={e => setNewMsg(e.target.value)} />
                <button type="submit" style={{ background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#07070f", border: "none", padding: "12px 20px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.82rem", transition: "opacity 0.2s", flexShrink: 0 }}>Send</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
