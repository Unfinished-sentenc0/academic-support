import { useState, useEffect, useRef } from "react";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import { collection, query, onSnapshot, orderBy, doc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

const ADMIN_EMAIL = "hannahessays445@gmail.com";
const STATUS_STEPS = ["Pending", "Confirmed", "In Progress", "Review", "Delivered"];
const STATUS_COLORS = { Pending: "#888", Confirmed: "#4a9eff", "In Progress": "#f0a500", Review: "#a855f7", Delivered: "#25d366" };

// EmailJS config
const EMAILJS_SERVICE = "service_vsdj7kh";
const EMAILJS_TEMPLATE = "4ntgk6e";
const EMAILJS_PUBLIC_KEY = "VAHjpD3CvLgaqqCCt";

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [emailSending, setEmailSending] = useState(false);
  const [toast, setToast] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) { navigate("/login"); return; }
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
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

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const updateStatus = async (orderId, status) => {
    try {
      // 1. Update Firestore
      await updateDoc(doc(db, "orders", orderId), { status });
      if (selectedOrder?.id === orderId) setSelectedOrder(o => ({ ...o, status }));

      // 2. Send email to student via EmailJS
      const order = orders.find(o => o.id === orderId);
      if (order?.studentEmail) {
        setEmailSending(true);
        await emailjs.send(
          EMAILJS_SERVICE,
          EMAILJS_TEMPLATE,
          {
            student_name: order.studentName || "Student",
            student_email: order.studentEmail,
            service: order.service,
            status: status,
            deadline: order.deadline || "—",
          },
          EMAILJS_PUBLIC_KEY
        );
        setEmailSending(false);
        showToast(`✅ Status updated to "${status}" — Email sent to ${order.studentEmail}`);
      }
    } catch (err) {
      console.error("Status update error:", err);
      setEmailSending(false);
      showToast("⚠️ Status updated but email failed", "error");
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    await addDoc(collection(db, "orders", selectedOrder.id, "messages"), {
      text: newMsg.trim(),
      sender: "admin",
      senderEmail: ADMIN_EMAIL,
      createdAt: serverTimestamp(),
    });
    setNewMsg("");
  };

  const handleLogout = async () => { await signOut(auth); navigate("/login"); };

  const filtered = filter === "All" ? orders : orders.filter(o => (o.status || "Pending") === filter);

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "#f0ede6", fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .cormorant { font-family: 'Cormorant Garamond', serif !important; }
        .dm { font-family: 'DM Sans', sans-serif !important; }
        .order-card { background: #0e0e1a; border: 1px solid #1c1c2e; padding: 18px 20px; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden; }
        .order-card:hover, .order-card.active { border-color: rgba(201,168,76,0.4); background: #10101e; }
        .order-card::before { content: ''; position: absolute; left: 0; top: 0; width: 3px; height: 0; background: #c9a84c; transition: height 0.3s; }
        .order-card:hover::before, .order-card.active::before { height: 100%; }
        .status-btn { font-family: 'DM Sans', sans-serif; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; padding: 7px 12px; border: 1px solid #1c1c2e; background: none; cursor: pointer; transition: all 0.2s; color: #888; }
        .filter-btn { font-family: 'DM Sans', sans-serif; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; padding: 6px 14px; border: 1px solid #1c1c2e; background: none; cursor: pointer; transition: all 0.2s; color: #555; }
        .filter-btn.active { border-color: #c9a84c; color: #c9a84c; }
        input[type="text"] { background: #0e0e1a; border: 1px solid #1c1c2e; color: #f0ede6; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; padding: 12px 16px; outline: none; transition: border-color 0.3s; flex: 1; border-radius: 0; width: 100%; box-sizing: border-box; }
        input[type="text"]:focus { border-color: #c9a84c; }
        input[type="text"]::placeholder { color: #444; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: #07070f; } ::-webkit-scrollbar-thumb { background: #c9a84c; }
        /* Toast */
        .toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 9999; font-family: 'DM Sans', sans-serif; font-size: 0.84rem; padding: 12px 24px; border-radius: 0; animation: slideUpToast 0.3s ease; white-space: nowrap; }
        .toast.success { background: #0e1a0e; border: 1px solid #25d366; color: #25d366; }
        .toast.error { background: #1a0e0e; border: 1px solid #ff6b6b; color: #ff6b6b; }
        @keyframes slideUpToast { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @media (max-width: 900px) { .admin-layout { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Toast notification */}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      {/* Nav */}
      <nav style={{ background: "rgba(7,7,15,0.97)", borderBottom: "1px solid #14141e", padding: "0 4%", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className="cormorant" style={{ fontSize: "1.3rem", fontWeight: 700 }}>Academic<span style={{ color: "#c9a84c" }}>Pro</span></div>
          <div className="dm" style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", color: "#c9a84c", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "4px 10px" }}>Admin</div>
          {emailSending && <div className="dm" style={{ color: "#888", fontSize: "0.75rem" }}>✉️ Sending email...</div>}
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div className="dm" style={{ display: "flex", gap: 16 }}>
            {[
              { label: "Total", val: orders.length },
              { label: "Active", val: orders.filter(o => !["Delivered"].includes(o.status)).length },
              { label: "Done", val: orders.filter(o => o.status === "Delivered").length },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#c9a84c", fontFamily: "'Cormorant Garamond', serif" }}>{s.val}</div>
                <div style={{ fontSize: "0.62rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <button onClick={handleLogout} className="dm" style={{ background: "none", border: "1px solid #1c1c2e", color: "#888", padding: "8px 16px", cursor: "pointer", fontSize: "0.78rem", transition: "all 0.2s" }}
            onMouseEnter={e => { e.target.style.borderColor = "#c9a84c"; e.target.style.color = "#c9a84c"; }}
            onMouseLeave={e => { e.target.style.borderColor = "#1c1c2e"; e.target.style.color = "#888"; }}
          >Sign Out</button>
        </div>
      </nav>

      <div className="admin-layout" style={{ display: "grid", gridTemplateColumns: "380px 1fr", minHeight: "calc(100vh - 64px)" }}>

        {/* LEFT — Orders list */}
        <div style={{ borderRight: "1px solid #14141e", overflowY: "auto", maxHeight: "calc(100vh - 64px)" }}>
          <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #14141e", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["All", ...STATUS_STEPS].map(f => (
              <button key={f} className={`filter-btn${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>

          {loading ? (
            <div className="dm" style={{ padding: 24, color: "#555", fontSize: "0.85rem" }}>Loading orders...</div>
          ) : filtered.length === 0 ? (
            <div className="dm" style={{ padding: 24, color: "#555", fontSize: "0.85rem", textAlign: "center" }}>No orders found</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {filtered.map(order => (
                <div key={order.id} className={`order-card${selectedOrder?.id === order.id ? " active" : ""}`} onClick={() => setSelectedOrder(order)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div className="cormorant" style={{ fontSize: "1rem", fontWeight: 700, flex: 1, marginRight: 8 }}>{order.service}</div>
                    <div className="dm" style={{ fontSize: "0.65rem", fontWeight: 600, color: STATUS_COLORS[order.status || "Pending"], textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>{order.status || "Pending"}</div>
                  </div>
                  <div className="dm" style={{ color: "#c9a84c", fontSize: "0.75rem", marginBottom: 4 }}>{order.studentEmail}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className="dm" style={{ color: "#444", fontSize: "0.72rem" }}>
                      {order.createdAt?.toDate?.()?.toLocaleDateString("en-GB") || "Just now"}
                    </div>
                    <div className="dm" style={{ color: "#555", fontSize: "0.72rem" }}>{order.plan || "—"}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Order detail + chat */}
        <div style={{ display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 64px)" }}>
          {!selectedOrder ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: "3rem" }}>📋</div>
              <div className="cormorant" style={{ fontSize: "1.4rem", color: "#333" }}>Select an order to manage it</div>
            </div>
          ) : (
            <>
              {/* Order header */}
              <div style={{ padding: "20px 28px", borderBottom: "1px solid #14141e", background: "#0a0a12" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                  <div>
                    <div className="dm" style={{ color: "#555", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>{selectedOrder.studentEmail}</div>
                    <div className="cormorant" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{selectedOrder.service}</div>
                  </div>
                  <div className="dm" style={{ fontSize: "0.72rem", color: "#555" }}>
                    Plan: <span style={{ color: "#c9a84c" }}>{selectedOrder.plan || "—"}</span>
                  </div>
                </div>

                {/* Order details */}
                <div style={{ background: "#0e0e1a", border: "1px solid #1c1c2e", padding: "14px 16px", marginBottom: 16 }}>
                  <div className="dm" style={{ color: "#666", fontSize: "0.8rem", lineHeight: 1.7 }}>
                    <strong style={{ color: "#888" }}>Details:</strong> {selectedOrder.details || "—"}<br />
                    <strong style={{ color: "#888" }}>Deadline:</strong> {selectedOrder.deadline ? new Date(selectedOrder.deadline).toLocaleString("en-GB") : "—"}
                  </div>
                </div>

                {/* Status updater */}
                <div>
                  <div className="dm" style={{ color: "#555", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
                    Update Status — student will be emailed automatically ✉️
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {STATUS_STEPS.map(s => (
                      <button key={s} className="status-btn"
                        onClick={() => updateStatus(selectedOrder.id, s)}
                        disabled={emailSending}
                        style={{
                          background: (selectedOrder.status || "Pending") === s ? STATUS_COLORS[s] : "none",
                          borderColor: STATUS_COLORS[s] + "60",
                          color: (selectedOrder.status || "Pending") === s ? "#07070f" : STATUS_COLORS[s],
                          opacity: emailSending ? 0.6 : 1,
                          cursor: emailSending ? "not-allowed" : "pointer"
                        }}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px", display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="dm" style={{ color: "#333", fontSize: "0.72rem", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Chat with student</div>
                {messages.length === 0 && (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div className="dm" style={{ color: "#333", fontSize: "0.82rem" }}>No messages yet</div>
                  </div>
                )}
                {messages.map(msg => (
                  <div key={msg.id} style={{ display: "flex", justifyContent: msg.sender === "admin" ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "75%", padding: "10px 14px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", lineHeight: 1.5, background: msg.sender === "admin" ? "linear-gradient(135deg, #c9a84c, #e8c97a)" : "#1a1a2e", color: msg.sender === "admin" ? "#07070f" : "#ccc", border: msg.sender === "student" ? "1px solid #2a2a3e" : "none" }}>
                      {msg.sender === "student" && <div style={{ fontSize: "0.65rem", color: "#c9a84c", marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Student</div>}
                      {msg.text}
                      <div style={{ fontSize: "0.65rem", opacity: 0.5, marginTop: 4 }}>
                        {msg.createdAt?.toDate?.()?.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) || ""}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <form onSubmit={sendMessage} style={{ padding: "16px 28px", borderTop: "1px solid #14141e", display: "flex", gap: 8 }}>
                <input type="text" placeholder="Reply to student..." value={newMsg} onChange={e => setNewMsg(e.target.value)} />
                <button type="submit" style={{ background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#07070f", border: "none", padding: "12px 20px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.82rem", flexShrink: 0 }}>Send</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}