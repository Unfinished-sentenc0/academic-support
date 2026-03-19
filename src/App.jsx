import { useState, useEffect, useRef } from "react";

// ── Intersection Observer hook for scroll animations
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, style = {}, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(36px)",
      transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
      ...style
    }}>
      {children}
    </div>
  );
}

// ── Data
const services = [
  { icon: "✍️", title: "Essay Writing", desc: "Argumentative, analytical, reflective — any style, any subject, crafted to your university's exact standards." },
  { icon: "📚", title: "Assignments", desc: "Coursework, case studies, reports — structured, researched, and delivered on time." },
  { icon: "💻", title: "Online Classes", desc: "Full class management. We attend, participate, and complete all tasks on your behalf." },
  { icon: "📝", title: "Homework", desc: "Math, Science, Literature, History — no subject is too difficult for our experts." },
  { icon: "🛡️", title: "Proctored Exams", desc: "We handle proctored exams with skill and complete discretion." },
  { icon: "🎯", title: "Online Exams", desc: "Timed or untimed, multiple choice or written — we deliver top results every time." },
];

const stats = [
  { num: "A+", label: "Grade Guaranteed" },
  { num: "2K+", label: "Students Helped" },
  { num: "24/7", label: "Always Available" },
  { num: "100%", label: "Confidential" },
];

const steps = [
  { n: "01", title: "Submit Details", desc: "Share your assignment info, subject, deadline and any special requirements." },
  { n: "02", title: "Get a Quote", desc: "Receive a fast, affordable price with zero hidden fees." },
  { n: "03", title: "We Get to Work", desc: "Our expert writers craft your perfect, plagiarism-free submission." },
  { n: "04", title: "You Succeed", desc: "Receive A-grade work before your deadline and submit with confidence." },
];

const testimonials = [
  { text: "I was failing three modules and didn't know what to do. They handled everything — I ended up with a 2:1. Genuinely life-changing.", name: "Jessica T.", school: "University of Manchester 🇬🇧" },
  { text: "Fast, professional, and totally discreet. Got an A on my finance exam. 10/10 would recommend to anyone.", name: "Marcus R.", school: "NYU Student 🇺🇸" },
  { text: "The essay they wrote for me was better than anything I could've produced. Top quality, delivered hours early.", name: "Amara K.", school: "University of Toronto 🇨🇦" },
];

const faqs = [
  { q: "Is my information kept confidential?", a: "Absolutely. We operate with full discretion. Your identity, order details, and personal information are never shared with anyone." },
  { q: "What if I'm not happy with the work?", a: "We offer unlimited revisions until you're 100% satisfied. Your success is our priority." },
  { q: "How fast can you deliver?", a: "We handle urgent orders as tight as a few hours. Just let us know your deadline when ordering." },
  { q: "Do you cover all subjects?", a: "Yes — from STEM to humanities, business to law. We have specialists across every academic discipline." },
  { q: "Is the work plagiarism-free?", a: "Every submission is 100% original and Turnitin-clean. We never resell or reuse work." },
];

const WHATSAPP_LINK = "https://wa.me/message/H45TAWKQS3QLM1";
const EMAIL = "hannahessays445@gmail.com";

export default function App() {
  const [faqOpen, setFaqOpen] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", service: "", deadline: "", details: "" });
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send to Gmail via Formspree — replace YOUR_ID once you set it up at formspree.io
    // For now, opens Gmail directly
    const subject = encodeURIComponent(`New Order: ${form.service}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nService: ${form.service}\nDeadline: ${form.deadline}\n\nDetails:\n${form.details}`
    );
    window.open(`mailto:${EMAIL}?subject=${subject}&body=${body}`, "_blank");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setForm({ name: "", email: "", service: "", deadline: "", details: "" });
  };


  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#07070f", color: "#f0ede6", overflowX: "hidden", minHeight: "100vh" }}>

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #07070f; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #07070f; } ::-webkit-scrollbar-thumb { background: #c9a84c; }
        .cormorant { font-family: 'Cormorant Garamond', serif !important; }
        .dm { font-family: 'DM Sans', sans-serif !important; }
        .gold { color: #c9a84c; }
        .btn-gold { font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.82rem; letter-spacing: 0.12em; text-transform: uppercase; background: linear-gradient(135deg, #c9a84c, #e8c97a); color: #07070f; border: none; padding: 15px 38px; cursor: pointer; transition: all 0.3s; display: inline-block; text-decoration: none; }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(201,168,76,0.35); }
        .btn-ghost { font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.82rem; letter-spacing: 0.12em; text-transform: uppercase; background: transparent; color: #c9a84c; border: 1px solid #c9a84c; padding: 14px 37px; cursor: pointer; transition: all 0.3s; display: inline-block; }
        .btn-ghost:hover { background: #c9a84c; color: #07070f; }
        .nav-link { font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; color: #888; cursor: pointer; transition: color 0.2s; text-decoration: none; }
        .nav-link:hover { color: #c9a84c; }
        .svc-card { background: #0e0e1a; border: 1px solid #1c1c2e; padding: 38px 30px; transition: all 0.4s; position: relative; overflow: hidden; cursor: default; }
        .svc-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(201,168,76,0.04), transparent); opacity: 0; transition: opacity 0.4s; }
        .svc-card:hover { border-color: rgba(201,168,76,0.3); transform: translateY(-5px); box-shadow: 0 24px 60px rgba(0,0,0,0.6); }
        .svc-card:hover::after { opacity: 1; }
        .svc-card::before { content: ''; position: absolute; left: 0; top: 0; width: 3px; height: 0; background: linear-gradient(180deg, #c9a84c, transparent); transition: height 0.4s; }
        .svc-card:hover::before { height: 100%; }
        .faq-btn { width: 100%; background: none; border: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 22px 0; color: #f0ede6; font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; text-align: left; }
        .step-num { font-family: 'Cormorant Garamond', serif; font-size: 5rem; font-weight: 700; color: #1a1a2e; line-height: 1; user-select: none; }
        input, textarea, select { width: 100%; background: #0e0e1a; border: 1px solid #1c1c2e; color: #f0ede6; font-family: 'DM Sans', sans-serif; font-size: 0.93rem; padding: 13px 16px; outline: none; transition: border-color 0.3s; appearance: none; }
        input:focus, textarea:focus, select:focus { border-color: #c9a84c; }
        input::placeholder, textarea::placeholder { color: #444; }
        select option { background: #0e0e1a; }
        .divider { width: 48px; height: 2px; background: linear-gradient(90deg, #c9a84c, transparent); margin: 14px 0 28px; }
        .tag { font-family: 'DM Sans', sans-serif; font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a84c; font-weight: 500; }
        /* WhatsApp float */
        .wa-btn { position: fixed; bottom: 28px; right: 28px; z-index: 999; width: 58px; height: 58px; border-radius: 50%; background: #25d366; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(37,211,102,0.4); cursor: pointer; transition: transform 0.3s; text-decoration: none; font-size: 1.6rem; animation: pulse 2.5s infinite; }
        .wa-btn:hover { transform: scale(1.1); }
        @keyframes pulse { 0%,100% { box-shadow: 0 8px 32px rgba(37,211,102,0.4); } 50% { box-shadow: 0 8px 48px rgba(37,211,102,0.7); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .hero-deco { animation: float 6s ease-in-out infinite; }
      `}</style>

      {/* ── WHATSAPP FLOAT ── */}
      <a className="wa-btn" href={WHATSAPP_LINK} target="_blank" rel="noreferrer" title="Chat on WhatsApp">💬</a>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 6%", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(7,7,15,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid #14141e" : "1px solid transparent",
        transition: "all 0.4s"
      }}>
        <div className="cormorant" style={{ fontSize: "1.4rem", fontWeight: 700, letterSpacing: "0.02em" }}>
          Academic<span className="gold">Pro</span>
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {[["Services", "services"], ["How It Works", "how-it-works"], ["Reviews", "reviews"], ["FAQ", "faq"]].map(([l, id]) => (
            <span key={id} className="nav-link" onClick={() => scrollTo(id)}>{l}</span>
          ))}
          <span className="btn-gold" style={{ padding: "10px 22px", fontSize: "0.75rem", cursor: "pointer" }} onClick={() => scrollTo("order")}>Order Now</span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "110px 6% 80px", position: "relative", overflow: "hidden" }}>
        {/* bg orbs */}
        <div style={{ position: "absolute", top: "8%", right: "4%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.055) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(42,100,180,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        {/* vertical accent line */}
        <div style={{ position: "absolute", top: 0, right: "28%", width: 1, height: "100%", background: "linear-gradient(180deg, transparent, rgba(201,168,76,0.1), transparent)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1160, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          {/* left */}
          <div>
            <div className="tag" style={{ marginBottom: 24 }}>🇬🇧 UK &nbsp;·&nbsp; 🇺🇸 US &nbsp;·&nbsp; 🌍 Worldwide</div>
            <h1 className="cormorant" style={{ fontSize: "clamp(3.2rem, 6vw, 5.8rem)", fontWeight: 700, lineHeight: 1.05, marginBottom: 24 }}>
              Get Expert Help<br />
              <span style={{ color: "#c9a84c", fontStyle: "italic" }}>With Your Coursework</span>
            </h1>
            <p className="dm" style={{ color: "#888", fontSize: "1.05rem", lineHeight: 1.8, maxWidth: 480, marginBottom: 40, fontWeight: 300 }}>
              Assignments • Essays • Research • Editing — delivered on time, every time. A grades guaranteed or your money back.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
              <span className="btn-gold" style={{ cursor: "pointer" }} onClick={() => scrollTo("order")}>Request Help Now</span>
              <span className="btn-ghost" style={{ cursor: "pointer" }} onClick={() => scrollTo("services")}>Our Services</span>
            </div>
            <div className="dm" style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
              {["🔒 Confidential", "⚡ Fast Delivery", "✅ A Grade Guaranteed", "💰 Affordable"].map(b => (
                <span key={b} style={{ fontSize: "0.8rem", color: "#666" }}>{b}</span>
              ))}
            </div>
          </div>

          {/* right — floating card */}
          <div className="hero-deco" style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ background: "#0e0e1a", border: "1px solid #1c1c2e", padding: "44px 40px", maxWidth: 380, width: "100%", position: "relative" }}>
              <div style={{ position: "absolute", top: -1, left: 40, width: 56, height: 3, background: "#c9a84c" }} />
              <div className="tag" style={{ marginBottom: 16 }}>Instant Quote</div>
              <h3 className="cormorant" style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 24 }}>What do you need help with?</h3>
              {["Essay Writing", "Assignment Help", "Online Exam", "Proctored Exam", "Online Class", "Homework"].map(s => (
                <div key={s} onClick={() => { scrollTo("order"); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #14141e", cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#c9a84c"}
                  onMouseLeave={e => e.currentTarget.style.color = "#f0ede6"}
                >
                  <span className="dm" style={{ fontSize: "0.9rem" }}>{s}</span>
                  <span style={{ color: "#c9a84c", fontSize: "0.9rem" }}>→</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: "#0b0b14", borderTop: "1px solid #14141e", borderBottom: "1px solid #14141e", padding: "56px 6%" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {stats.map((s, i) => (
            <FadeIn key={s.num} delay={i * 0.1}>
              <div style={{ textAlign: "center" }}>
                <div className="cormorant" style={{ fontSize: "3.2rem", fontWeight: 700, color: "#c9a84c", lineHeight: 1 }}>{s.num}</div>
                <div className="dm" style={{ color: "#666", fontSize: "0.76rem", letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 8 }}>{s.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ padding: "96px 6%" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <FadeIn>
            <div className="tag">What We Offer</div>
            <h2 className="cormorant" style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", fontWeight: 700, marginTop: 10 }}>Our Services</h2>
            <div className="divider" />
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 2 }}>
            {services.map((s, i) => (
              <FadeIn key={s.title} delay={i * 0.07}>
                <div className="svc-card">
                  <div style={{ fontSize: "2rem", marginBottom: 18 }}>{s.icon}</div>
                  <h3 className="cormorant" style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: 12 }}>{s.title}</h3>
                  <p className="dm" style={{ color: "#777", lineHeight: 1.75, fontSize: "0.88rem", fontWeight: 300 }}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ background: "#0b0b14", borderTop: "1px solid #14141e", padding: "96px 6%" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <FadeIn>
            <div className="tag">Simple Process</div>
            <h2 className="cormorant" style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", fontWeight: 700, marginTop: 10 }}>How It Works</h2>
            <div className="divider" />
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 48 }}>
            {steps.map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.1}>
                <div>
                  <div className="step-num">{s.n}</div>
                  <div style={{ width: 36, height: 2, background: "#c9a84c", margin: "12px 0 18px" }} />
                  <h3 className="cormorant" style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                  <p className="dm" style={{ color: "#777", lineHeight: 1.75, fontSize: "0.88rem", fontWeight: 300 }}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="reviews" style={{ padding: "96px 6%" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <div className="tag">Student Reviews</div>
            <h2 className="cormorant" style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", fontWeight: 700, marginTop: 10 }}>What Our Students Say</h2>
            <div className="divider" style={{ margin: "14px auto 40px" }} />
          </FadeIn>
          <FadeIn delay={0.1}>
            <div style={{ background: "#0e0e1a", border: "1px solid #1c1c2e", padding: "52px 48px", position: "relative", minHeight: 200 }}>
              <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", width: 56, height: 3, background: "#c9a84c" }} />
              <div style={{ fontSize: "3rem", color: "#c9a84c", lineHeight: 1, marginBottom: 24, fontFamily: "Georgia" }}>"</div>
              <p className="cormorant" style={{ fontSize: "1.35rem", fontStyle: "italic", lineHeight: 1.75, color: "#ccc", marginBottom: 28, transition: "opacity 0.5s" }}>
                {testimonials[activeTestimonial].text}
              </p>
              <div className="dm" style={{ color: "#c9a84c", fontSize: "0.82rem", letterSpacing: "0.1em" }}>{testimonials[activeTestimonial].name}</div>
              <div className="dm" style={{ color: "#555", fontSize: "0.78rem", marginTop: 4 }}>{testimonials[activeTestimonial].school}</div>
            </div>
            {/* dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 24 }}>
              {testimonials.map((_, i) => (
                <div key={i} onClick={() => setActiveTestimonial(i)} style={{ width: i === activeTestimonial ? 24 : 8, height: 8, borderRadius: 4, background: i === activeTestimonial ? "#c9a84c" : "#1c1c2e", cursor: "pointer", transition: "all 0.3s" }} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ background: "#0b0b14", borderTop: "1px solid #14141e", padding: "96px 6%" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <FadeIn>
            <div className="tag">Transparent Pricing</div>
            <h2 className="cormorant" style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", fontWeight: 700, marginTop: 10 }}>Affordable for Every Student</h2>
            <div className="divider" />
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 2 }}>
            {[
              { name: "Basic", price: "$5", per: "per page", features: ["Essays & Assignments", "72hr+ deadline", "1 free revision", "Plagiarism-free"], highlight: false },
              { name: "Standard", price: "$15", per: "per page", features: ["All Basic features", "24hr deadline", "3 free revisions", "Priority support", "Exam prep notes"], highlight: true },
              { name: "Urgent", price: "$30", per: "per page", features: ["All Standard features", "Under 6hr delivery", "Unlimited revisions", "Dedicated writer", "WhatsApp updates"], highlight: false },
            ].map((p, i) => (
              <FadeIn key={p.name} delay={i * 0.1}>
                <div style={{ background: p.highlight ? "linear-gradient(160deg, #14142a, #0e0e1a)" : "#0e0e1a", border: p.highlight ? "1px solid rgba(201,168,76,0.5)" : "1px solid #1c1c2e", padding: "44px 36px", position: "relative" }}>
                  {p.highlight && <div style={{ position: "absolute", top: -1, left: 36, width: 56, height: 3, background: "#c9a84c" }} />}
                  {p.highlight && <div className="dm" style={{ position: "absolute", top: 18, right: 24, background: "#c9a84c", color: "#07070f", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", padding: "4px 10px", textTransform: "uppercase" }}>Most Popular</div>}
                  <div className="tag" style={{ marginBottom: 12 }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
                    <span className="cormorant" style={{ fontSize: "3rem", fontWeight: 700, color: "#c9a84c" }}>{p.price}</span>
                    <span className="dm" style={{ color: "#555", fontSize: "0.82rem" }}>{p.per}</span>
                  </div>
                  <div style={{ width: 36, height: 1, background: "#1c1c2e", margin: "20px 0" }} />
                  {p.features.map(f => (
                    <div key={f} className="dm" style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, fontSize: "0.88rem", color: "#aaa" }}>
                      <span style={{ color: "#c9a84c" }}>✓</span>{f}
                    </div>
                  ))}
                  <span className="btn-gold" style={{ marginTop: 24, display: "block", textAlign: "center", cursor: "pointer", padding: "12px 20px", fontSize: "0.78rem" }} onClick={() => scrollTo("order")}>Get Started</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: "96px 6%" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <FadeIn>
            <div className="tag">Got Questions?</div>
            <h2 className="cormorant" style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", fontWeight: 700, marginTop: 10 }}>Frequently Asked</h2>
            <div className="divider" />
          </FadeIn>
          {faqs.map((f, i) => (
            <FadeIn key={i} delay={i * 0.06}>
              <div style={{ borderBottom: "1px solid #14141e" }}>
                <button className="faq-btn" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  <span>{f.q}</span>
                  <span style={{ color: "#c9a84c", fontSize: "1.4rem", fontWeight: 300, flexShrink: 0, marginLeft: 16, display: "inline-block", transition: "transform 0.3s", transform: faqOpen === i ? "rotate(45deg)" : "none" }}>+</span>
                </button>
                <div className="dm" style={{ maxHeight: faqOpen === i ? 160 : 0, overflow: "hidden", transition: "max-height 0.4s ease", color: "#777", lineHeight: 1.8, fontSize: "0.9rem", fontWeight: 300, paddingBottom: faqOpen === i ? 20 : 0 }}>
                  {f.a}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── ORDER FORM ── */}
      <section id="order" style={{ background: "#0b0b14", borderTop: "1px solid #14141e", padding: "96px 6%" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 80, alignItems: "start" }}>
          <FadeIn>
            <div className="tag">Start Today</div>
            <h2 className="cormorant" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 700, lineHeight: 1.2, marginTop: 10 }}>Place Your Order</h2>
            <div className="divider" />
            <p className="dm" style={{ color: "#777", lineHeight: 1.8, marginBottom: 40, fontWeight: 300, fontSize: "0.92rem" }}>
              Fill in the form and we'll get back to you within minutes with a confirmed price and start time.
            </p>
            {[
              { icon: "💬", label: "WhatsApp", val: "Click the chat button →" },
              { icon: "📧", label: "Email", val: EMAIL },
              { icon: "🕐", label: "Response Time", val: "Under 10 minutes" },
              { icon: "🌍", label: "We Serve", val: "UK · US · Canada · Australia" },
            ].map(c => (
              <div key={c.label} style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 22 }}>
                <div style={{ fontSize: "1.3rem" }}>{c.icon}</div>
                <div>
                  <div className="tag" style={{ fontSize: "0.68rem", marginBottom: 2 }}>{c.label}</div>
                  <div className="dm" style={{ color: "#ccc", fontSize: "0.9rem" }}>{c.val}</div>
                </div>
              </div>
            ))}
          </FadeIn>

          <FadeIn delay={0.15}>
            <div style={{ background: "#0e0e1a", border: "1px solid #1c1c2e", padding: "48px 40px", position: "relative" }}>
              <div style={{ position: "absolute", top: -1, left: 40, width: 56, height: 3, background: "#c9a84c" }} />
              {submitted ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <div style={{ fontSize: "3.5rem", marginBottom: 20 }}>✅</div>
                  <h3 className="cormorant" style={{ fontSize: "1.8rem", marginBottom: 12 }}>Order Received!</h3>
                  <p className="dm" style={{ color: "#777", fontSize: "0.9rem" }}>We'll be in touch within 10 minutes.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label className="dm" style={{ display: "block", fontSize: "0.72rem", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Your Name</label>
                      <input required placeholder="John Smith" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="dm" style={{ display: "block", fontSize: "0.72rem", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Email</label>
                      <input required type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="dm" style={{ display: "block", fontSize: "0.72rem", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Service Needed</label>
                    <select required value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                      <option value="">Select a service...</option>
                      <option>Essay Writing</option>
                      <option>Assignment Help</option>
                      <option>Online Classes</option>
                      <option>Homework</option>
                      <option>Proctored Exam</option>
                      <option>Online Exam</option>
                    </select>
                  </div>
                  <div>
                    <label className="dm" style={{ display: "block", fontSize: "0.72rem", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Deadline</label>
                    <input required type="datetime-local" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} style={{ colorScheme: "dark" }} />
                  </div>
                  <div>
                    <label className="dm" style={{ display: "block", fontSize: "0.72rem", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Assignment Details</label>
                    <textarea required rows={4} placeholder="Subject, word count, topic, university, any special instructions..." value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} style={{ resize: "vertical" }} />
                  </div>
                  <button type="submit" className="btn-gold" style={{ marginTop: 8 }}>Submit Order & Get Quote →</button>
                  <p className="dm" style={{ color: "#444", fontSize: "0.75rem", textAlign: "center" }}>🔒 Your information is 100% confidential</p>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#05050c", borderTop: "1px solid #14141e", padding: "44px 6%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        <div className="cormorant" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Academic<span className="gold">Pro</span></div>
        <div className="dm" style={{ color: "#444", fontSize: "0.78rem", textAlign: "center" }}>
          © 2026 AcademicPro. All rights reserved &nbsp;·&nbsp; UK · US · Worldwide
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", <a key="twitter" href="https://x.com/Hannah_papers" target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>Twitter / X</a>, "WhatsApp Us"].map(l => (
            <span key={l} className="dm" style={{ color: "#444", fontSize: "0.78rem", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#c9a84c"}
              onMouseLeave={e => e.target.style.color = "#444"}
            >{l}</span>
          ))}
        </div>
      </footer>

    </div>
  );
}