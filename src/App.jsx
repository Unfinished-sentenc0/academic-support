import { useState, useEffect, useRef } from "react";

function useInView(threshold = 0.1) {
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

function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      ...style
    }}>
      {children}
    </div>
  );
}

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
  const [menuOpen, setMenuOpen] = useState(false);
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

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://formspree.io/f/xaqpvkrk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          service: form.service,
          deadline: form.deadline,
          details: form.details,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        setForm({ name: "", email: "", service: "", deadline: "", details: "" });
      }
    } catch (err) {
      console.error("Form error:", err);
    }
  };

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#07070f", color: "#f0ede6", overflowX: "hidden", minHeight: "100vh" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #07070f; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #07070f; } ::-webkit-scrollbar-thumb { background: #c9a84c; }
        .cormorant { font-family: 'Cormorant Garamond', serif !important; }
        .dm { font-family: 'DM Sans', sans-serif !important; }
        .gold { color: #c9a84c; }
        .btn-gold { font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.82rem; letter-spacing: 0.1em; text-transform: uppercase; background: linear-gradient(135deg, #c9a84c, #e8c97a); color: #07070f; border: none; padding: 15px 32px; cursor: pointer; transition: all 0.3s; display: inline-block; text-decoration: none; }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(201,168,76,0.35); }
        .btn-ghost { font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.82rem; letter-spacing: 0.1em; text-transform: uppercase; background: transparent; color: #c9a84c; border: 1px solid #c9a84c; padding: 14px 31px; cursor: pointer; transition: all 0.3s; display: inline-block; }
        .btn-ghost:hover { background: #c9a84c; color: #07070f; }
        .nav-link { font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; color: #888; cursor: pointer; transition: color 0.2s; }
        .nav-link:hover { color: #c9a84c; }
        .svc-card { background: #0e0e1a; border: 1px solid #1c1c2e; padding: 32px 28px; transition: all 0.4s; position: relative; overflow: hidden; }
        .svc-card::before { content: ''; position: absolute; left: 0; top: 0; width: 3px; height: 0; background: linear-gradient(180deg, #c9a84c, transparent); transition: height 0.4s; }
        .svc-card:hover::before { height: 100%; }
        .svc-card:hover { border-color: rgba(201,168,76,0.3); transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .faq-btn { width: 100%; background: none; border: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 20px 0; color: #f0ede6; font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; text-align: left; gap: 12px; }
        input, textarea, select { width: 100%; background: #0e0e1a; border: 1px solid #1c1c2e; color: #f0ede6; font-family: 'DM Sans', sans-serif; font-size: 0.93rem; padding: 13px 16px; outline: none; transition: border-color 0.3s; appearance: none; -webkit-appearance: none; border-radius: 0; }
        input:focus, textarea:focus, select:focus { border-color: #c9a84c; }
        input::placeholder, textarea::placeholder { color: #444; }
        select option { background: #0e0e1a; }
        .divider { width: 48px; height: 2px; background: linear-gradient(90deg, #c9a84c, transparent); margin: 14px 0 28px; }
        .tag { font-family: 'DM Sans', sans-serif; font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a84c; font-weight: 500; }
        .wa-btn { position: fixed; bottom: 24px; right: 24px; z-index: 999; width: 56px; height: 56px; border-radius: 50%; background: #25d366; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(37,211,102,0.4); cursor: pointer; transition: transform 0.3s; text-decoration: none; font-size: 1.5rem; animation: pulse 2.5s infinite; }
        .wa-btn:hover { transform: scale(1.1); }
        @keyframes pulse { 0%,100% { box-shadow: 0 8px 32px rgba(37,211,102,0.4); } 50% { box-shadow: 0 8px 48px rgba(37,211,102,0.7); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .hero-deco { animation: float 6s ease-in-out infinite; }
        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 6px; }
        .hamburger span { display: block; width: 22px; height: 2px; background: #f0ede6; transition: all 0.3s; border-radius: 2px; }
        .mobile-menu { position: fixed; top: 68px; left: 0; right: 0; background: rgba(7,7,15,0.98); backdrop-filter: blur(20px); border-bottom: 1px solid #1a1a2e; z-index: 98; max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
        .mobile-menu.open { max-height: 500px; }
        .mob-item { padding: 16px 6%; border-bottom: 1px solid #14141e; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; letter-spacing: 0.1em; text-transform: uppercase; color: #888; cursor: pointer; display: block; }
        .mob-item:hover { color: #c9a84c; }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-right { display: none !important; }
          .hero-btns { flex-direction: column !important; }
          .hero-btns span { width: 100% !important; text-align: center !important; padding: 15px !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .how-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .order-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .form-row { grid-template-columns: 1fr !important; }
          .order-form-wrap { padding: 28px 20px !important; }
          .footer-inner { flex-direction: column !important; text-align: center !important; }
          .testimonial-box { padding: 32px 22px !important; }
          section { padding-left: 5% !important; padding-right: 5% !important; }
        }
        @media (max-width: 480px) {
          .how-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <a className="wa-btn" href={WHATSAPP_LINK} target="_blank" rel="noreferrer" title="Chat on WhatsApp">💬</a>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 6%", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(7,7,15,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid #14141e" : "1px solid transparent",
        transition: "all 0.4s"
      }}>
        <div className="cormorant" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
          Academic<span className="gold">Pro</span>
        </div>
        <div className="desktop-nav" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {[["Services","services"],["How It Works","how-it-works"],["Reviews","reviews"],["FAQ","faq"]].map(([l,id]) => (
            <span key={id} className="nav-link" onClick={() => scrollTo(id)}>{l}</span>
          ))}
          <span className="btn-gold" style={{ padding: "10px 20px", fontSize: "0.75rem", cursor: "pointer" }} onClick={() => scrollTo("order")}>Order Now</span>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
        </button>
      </nav>

      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {[["Services","services"],["How It Works","how-it-works"],["Reviews","reviews"],["FAQ","faq"]].map(([l,id]) => (
          <span key={id} className="mob-item" onClick={() => scrollTo(id)}>{l}</span>
        ))}
        <div style={{ padding: "16px 6%" }}>
          <span className="btn-gold" style={{ display: "block", textAlign: "center", cursor: "pointer", padding: "14px" }} onClick={() => scrollTo("order")}>Order Now</span>
        </div>
      </div>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 6% 72px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "8%", right: "4%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.055) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "-5%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(42,100,180,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1160, margin: "0 auto", width: "100%" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
            <div>
              <div className="tag" style={{ marginBottom: 18 }}>🇬🇧 UK &nbsp;·&nbsp; 🇺🇸 US &nbsp;·&nbsp; 🌍 Worldwide</div>
              <h1 className="cormorant" style={{ fontSize: "clamp(2.8rem, 6vw, 5.4rem)", fontWeight: 700, lineHeight: 1.05, marginBottom: 18 }}>
                Get Expert Help<br />
                <span style={{ color: "#c9a84c", fontStyle: "italic" }}>With Your Coursework</span>
              </h1>
              <p className="dm" style={{ color: "#888", fontSize: "1rem", lineHeight: 1.8, maxWidth: 460, marginBottom: 32, fontWeight: 300 }}>
                Assignments • Essays • Research • Editing — delivered on time, every time. A grades guaranteed or your money back.
              </p>
              <div className="hero-btns" style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
                <span className="btn-gold" style={{ cursor: "pointer" }} onClick={() => scrollTo("order")}>Request Help Now</span>
                <span className="btn-ghost" style={{ cursor: "pointer" }} onClick={() => scrollTo("services")}>Our Services</span>
              </div>
              <div className="dm" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {["🔒 Confidential","⚡ Fast Delivery","✅ A Grade","💰 Affordable"].map(b => (
                  <span key={b} style={{ fontSize: "0.77rem", color: "#666" }}>{b}</span>
                ))}
              </div>
            </div>
            <div className="hero-right hero-deco" style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ background: "#0e0e1a", border: "1px solid #1c1c2e", padding: "36px 32px", maxWidth: 340, width: "100%", position: "relative" }}>
                <div style={{ position: "absolute", top: -1, left: 32, width: 48, height: 3, background: "#c9a84c" }} />
                <div className="tag" style={{ marginBottom: 12 }}>Instant Quote</div>
                <h3 className="cormorant" style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 18 }}>What do you need help with?</h3>
                {["Essay Writing","Assignment Help","Online Exam","Proctored Exam","Online Class","Homework"].map(s => (
                  <div key={s} onClick={() => scrollTo("order")} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #14141e", cursor: "pointer", color: "#f0ede6", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#c9a84c"}
                    onMouseLeave={e => e.currentTarget.style.color = "#f0ede6"}
                  >
                    <span className="dm" style={{ fontSize: "0.87rem" }}>{s}</span>
                    <span style={{ color: "#c9a84c" }}>→</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "#0b0b14", borderTop: "1px solid #14141e", borderBottom: "1px solid #14141e", padding: "48px 6%" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {stats.map((s,i) => (
              <FadeIn key={s.num} delay={i*0.1}>
                <div style={{ textAlign: "center" }}>
                  <div className="cormorant" style={{ fontSize: "clamp(2.2rem,4vw,3rem)", fontWeight: 700, color: "#c9a84c", lineHeight: 1 }}>{s.num}</div>
                  <div className="dm" style={{ color: "#666", fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 8 }}>{s.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: "84px 6%" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <FadeIn>
            <div className="tag">What We Offer</div>
            <h2 className="cormorant" style={{ fontSize: "clamp(1.9rem,4vw,3.1rem)", fontWeight: 700, marginTop: 10 }}>Our Services</h2>
            <div className="divider" />
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px,1fr))", gap: 2 }}>
            {services.map((s,i) => (
              <FadeIn key={s.title} delay={i*0.07}>
                <div className="svc-card">
                  <div style={{ fontSize: "1.8rem", marginBottom: 14 }}>{s.icon}</div>
                  <h3 className="cormorant" style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                  <p className="dm" style={{ color: "#777", lineHeight: 1.75, fontSize: "0.86rem", fontWeight: 300 }}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ background: "#0b0b14", borderTop: "1px solid #14141e", padding: "84px 6%" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <FadeIn>
            <div className="tag">Simple Process</div>
            <h2 className="cormorant" style={{ fontSize: "clamp(1.9rem,4vw,3.1rem)", fontWeight: 700, marginTop: 10 }}>How It Works</h2>
            <div className="divider" />
          </FadeIn>
          <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 36 }}>
            {steps.map((s,i) => (
              <FadeIn key={s.n} delay={i*0.1}>
                <div>
                  <div className="cormorant" style={{ fontSize: "3.5rem", fontWeight: 700, color: "#1a1a2e", lineHeight: 1 }}>{s.n}</div>
                  <div style={{ width: 30, height: 2, background: "#c9a84c", margin: "10px 0 14px" }} />
                  <h3 className="cormorant" style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                  <p className="dm" style={{ color: "#777", lineHeight: 1.75, fontSize: "0.85rem", fontWeight: 300 }}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="reviews" style={{ padding: "84px 6%" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <div className="tag">Student Reviews</div>
            <h2 className="cormorant" style={{ fontSize: "clamp(1.9rem,4vw,3.1rem)", fontWeight: 700, marginTop: 10 }}>What Our Students Say</h2>
            <div className="divider" style={{ margin: "14px auto 32px" }} />
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="testimonial-box" style={{ background: "#0e0e1a", border: "1px solid #1c1c2e", padding: "44px 40px", position: "relative" }}>
              <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", width: 48, height: 3, background: "#c9a84c" }} />
              <div style={{ fontSize: "2.2rem", color: "#c9a84c", marginBottom: 16 }}>"</div>
              <p className="cormorant" style={{ fontSize: "clamp(1.05rem,2.5vw,1.25rem)", fontStyle: "italic", lineHeight: 1.75, color: "#ccc", marginBottom: 22 }}>
                {testimonials[activeTestimonial].text}
              </p>
              <div className="dm" style={{ color: "#c9a84c", fontSize: "0.8rem", letterSpacing: "0.1em" }}>{testimonials[activeTestimonial].name}</div>
              <div className="dm" style={{ color: "#555", fontSize: "0.75rem", marginTop: 4 }}>{testimonials[activeTestimonial].school}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 18 }}>
              {testimonials.map((_,i) => (
                <div key={i} onClick={() => setActiveTestimonial(i)} style={{ width: i===activeTestimonial ? 22 : 8, height: 8, borderRadius: 4, background: i===activeTestimonial ? "#c9a84c" : "#1c1c2e", cursor: "pointer", transition: "all 0.3s" }} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ background: "#0b0b14", borderTop: "1px solid #14141e", padding: "84px 6%" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <FadeIn>
            <div className="tag">Transparent Pricing</div>
            <h2 className="cormorant" style={{ fontSize: "clamp(1.9rem,4vw,3.1rem)", fontWeight: 700, marginTop: 10 }}>Affordable for Every Student</h2>
            <div className="divider" />
          </FadeIn>
          <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
            {[
              { name: "Basic", price: "$5", per: "per page", features: ["Essays & Assignments","72hr+ deadline","1 free revision","Plagiarism-free"], highlight: false },
              { name: "Standard", price: "$15", per: "per page", features: ["All Basic features","24hr deadline","3 free revisions","Priority support","Exam prep notes"], highlight: true },
              { name: "Urgent", price: "$30", per: "per page", features: ["All Standard features","Under 6hr delivery","Unlimited revisions","Dedicated writer","WhatsApp updates"], highlight: false },
            ].map((p,i) => (
              <FadeIn key={p.name} delay={i*0.1}>
                <div style={{ background: p.highlight ? "#10102a" : "#0e0e1a", border: p.highlight ? "1px solid rgba(201,168,76,0.45)" : "1px solid #1c1c2e", padding: "36px 28px", position: "relative" }}>
                  {p.highlight && <div style={{ position: "absolute", top: -1, left: 28, width: 48, height: 3, background: "#c9a84c" }} />}
                  {p.highlight && <div className="dm" style={{ position: "absolute", top: 14, right: 16, background: "#c9a84c", color: "#07070f", fontSize: "0.64rem", fontWeight: 700, letterSpacing: "0.1em", padding: "4px 8px", textTransform: "uppercase" }}>Most Popular</div>}
                  <div className="tag" style={{ marginBottom: 8 }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 4 }}>
                    <span className="cormorant" style={{ fontSize: "2.6rem", fontWeight: 700, color: "#c9a84c" }}>{p.price}</span>
                    <span className="dm" style={{ color: "#555", fontSize: "0.78rem" }}>{p.per}</span>
                  </div>
                  <div style={{ width: 30, height: 1, background: "#1c1c2e", margin: "16px 0" }} />
                  {p.features.map(f => (
                    <div key={f} className="dm" style={{ display: "flex", gap: 9, alignItems: "center", marginBottom: 10, fontSize: "0.85rem", color: "#aaa" }}>
                      <span style={{ color: "#c9a84c", flexShrink: 0 }}>✓</span>{f}
                    </div>
                  ))}
                  <span className="btn-gold" style={{ marginTop: 20, display: "block", textAlign: "center", cursor: "pointer", padding: "12px", fontSize: "0.75rem" }} onClick={() => scrollTo("order")}>Get Started</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "84px 6%" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <FadeIn>
            <div className="tag">Got Questions?</div>
            <h2 className="cormorant" style={{ fontSize: "clamp(1.9rem,4vw,3.1rem)", fontWeight: 700, marginTop: 10 }}>Frequently Asked</h2>
            <div className="divider" />
          </FadeIn>
          {faqs.map((f,i) => (
            <FadeIn key={i} delay={i*0.06}>
              <div style={{ borderBottom: "1px solid #14141e" }}>
                <button className="faq-btn" onClick={() => setFaqOpen(faqOpen===i ? null : i)}>
                  <span>{f.q}</span>
                  <span style={{ color: "#c9a84c", fontSize: "1.4rem", fontWeight: 300, flexShrink: 0, display: "inline-block", transition: "transform 0.3s", transform: faqOpen===i ? "rotate(45deg)" : "none" }}>+</span>
                </button>
                <div className="dm" style={{ maxHeight: faqOpen===i ? 200 : 0, overflow: "hidden", transition: "max-height 0.4s ease", color: "#777", lineHeight: 1.8, fontSize: "0.88rem", fontWeight: 300, paddingBottom: faqOpen===i ? 18 : 0 }}>
                  {f.a}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ORDER FORM */}
      <section id="order" style={{ background: "#0b0b14", borderTop: "1px solid #14141e", padding: "84px 6%" }}>
        <div className="order-grid" style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 64, alignItems: "start" }}>
          <FadeIn>
            <div className="tag">Start Today</div>
            <h2 className="cormorant" style={{ fontSize: "clamp(1.9rem,3.5vw,2.8rem)", fontWeight: 700, lineHeight: 1.2, marginTop: 10 }}>Place Your Order</h2>
            <div className="divider" />
            <p className="dm" style={{ color: "#777", lineHeight: 1.8, marginBottom: 32, fontWeight: 300, fontSize: "0.88rem" }}>
              Fill in the form and we'll get back to you within minutes with a confirmed price and start time.
            </p>
            {[
              { icon: "💬", label: "WhatsApp", val: "Click the chat button →" },
              { icon: "📧", label: "Email", val: EMAIL },
              { icon: "🕐", label: "Response Time", val: "Under 10 minutes" },
              { icon: "🌍", label: "We Serve", val: "UK · US · Canada · Australia" },
            ].map(c => (
              <div key={c.label} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{ fontSize: "1.1rem", marginTop: 2 }}>{c.icon}</div>
                <div>
                  <div className="tag" style={{ fontSize: "0.64rem", marginBottom: 2 }}>{c.label}</div>
                  <div className="dm" style={{ color: "#ccc", fontSize: "0.86rem", wordBreak: "break-all" }}>{c.val}</div>
                </div>
              </div>
            ))}
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="order-form-wrap" style={{ background: "#0e0e1a", border: "1px solid #1c1c2e", padding: "40px 32px", position: "relative" }}>
              <div style={{ position: "absolute", top: -1, left: 32, width: 48, height: 3, background: "#c9a84c" }} />
              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: "3rem", marginBottom: 14 }}>✅</div>
                  <h3 className="cormorant" style={{ fontSize: "1.6rem", marginBottom: 10 }}>Order Received!</h3>
                  <p className="dm" style={{ color: "#777", fontSize: "0.86rem" }}>We'll be in touch within 10 minutes.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                  <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
                    <div>
                      <label className="dm" style={{ display: "block", fontSize: "0.69rem", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Your Name</label>
                      <input required placeholder="John Smith" value={form.name} onChange={e => setForm({...form,name:e.target.value})} />
                    </div>
                    <div>
                      <label className="dm" style={{ display: "block", fontSize: "0.69rem", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Email</label>
                      <input required type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({...form,email:e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="dm" style={{ display: "block", fontSize: "0.69rem", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Service Needed</label>
                    <select required value={form.service} onChange={e => setForm({...form,service:e.target.value})}>
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
                    <label className="dm" style={{ display: "block", fontSize: "0.69rem", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Deadline</label>
                    <input required type="datetime-local" value={form.deadline} onChange={e => setForm({...form,deadline:e.target.value})} style={{ colorScheme: "dark" }} />
                  </div>
                  <div>
                    <label className="dm" style={{ display: "block", fontSize: "0.69rem", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Assignment Details</label>
                    <textarea required rows={4} placeholder="Subject, word count, topic, university, any special instructions..." value={form.details} onChange={e => setForm({...form,details:e.target.value})} style={{ resize: "vertical" }} />
                  </div>
                  <button type="submit" className="btn-gold" style={{ marginTop: 6, width: "100%", padding: "15px", fontSize: "0.82rem" }}>Submit Order & Get Quote →</button>
                  <p className="dm" style={{ color: "#444", fontSize: "0.72rem", textAlign: "center" }}>🔒 Your information is 100% confidential</p>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#05050c", borderTop: "1px solid #14141e", padding: "36px 6%" }}>
        <div className="footer-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div className="cormorant" style={{ fontSize: "1.2rem", fontWeight: 700 }}>Academic<span className="gold">Pro</span></div>
          <div className="dm" style={{ color: "#444", fontSize: "0.74rem", textAlign: "center" }}>© 2026 AcademicPro. All rights reserved · UK · US · Worldwide</div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <a href="https://x.com/Hannah_papers" target="_blank" rel="noreferrer" className="dm" style={{ color: "#444", fontSize: "0.74rem", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color="#c9a84c"} onMouseLeave={e => e.target.style.color="#444"}>Twitter / X</a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="dm" style={{ color: "#444", fontSize: "0.74rem", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color="#c9a84c"} onMouseLeave={e => e.target.style.color="#444"}>WhatsApp Us</a>
          </div>
        </div>
      </footer>

    </div>
  );
}