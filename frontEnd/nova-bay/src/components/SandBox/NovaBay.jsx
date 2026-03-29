import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  BarChart2,
  MessageSquare,
  Plus,
  Trash2,
  Zap,
  CheckCircle,
  Leaf,
  ChevronDown,
  ChevronRight,
  Waves,
  Wind,
  Droplets,
  Sun,
} from "lucide-react";

const T = {
  bg: "#0a0f0a",
  bgSoft: "#0d1a0d",
  panel: "rgba(13, 26, 13, 0.88)",
  panelStrong: "rgba(13, 26, 13, 0.96)",
  accent: "#5ecfb1",
  accentSoft: "rgba(94, 207, 177, 0.14)",
  border: "rgba(94, 207, 177, 0.24)",
  borderSoft: "rgba(94, 207, 177, 0.12)",
  text: "#f5f7f0",
  textMuted: "rgba(220, 231, 224, 0.76)",
  textFaint: "rgba(196, 212, 202, 0.56)",
  danger: "#e37c62",
};

const STYLES = [
  { id: "coastal-modern", name: "Coastal Modern", desc: "Clean lines, elevated platforms, expansive glazing", resilience: 88, eco: 82, materials: ["Fiber cement cladding", "Stainless steel hardware", "Tempered impact glass", "Concrete pile foundation"] },
  { id: "elevated-cottage", name: "Elevated Cottage", desc: "Classic Florida vernacular raised on stilts", resilience: 92, eco: 76, materials: ["Pressure-treated pine", "Metal standing seam roof", "Impact-rated windows", "Concrete block piers"] },
  { id: "bioclimatic", name: "Bioclimatic", desc: "Passive design tuned to Tampa Bay's hot-humid climate", resilience: 79, eco: 94, materials: ["Reclaimed cypress", "Living roof substrate", "Rammed earth walls", "Recycled glass insulation"] },
  { id: "storm-fortress", name: "Storm Fortress", desc: "Maximum resilience with engineered concrete shell", resilience: 97, eco: 64, materials: ["Insulated concrete form", "Impact-rated hurricane glass", "Galvanized steel frame", "Deep concrete caisson"] },
  { id: "floating-pavilion", name: "Floating Pavilion", desc: "Amphibious design adapts to water level rise", resilience: 85, eco: 89, materials: ["Marine-grade aluminum", "EPS foam pontoon", "Composite decking", "Flexible utility connections"] },
];

const ROOM_TYPES = [
  { id: "living", label: "Living Room", color: "#5ecfb1", w: 180, h: 130 },
  { id: "kitchen", label: "Kitchen", color: "#72d7be", w: 120, h: 100 },
  { id: "bedroom", label: "Bedroom", color: "#4ec0a4", w: 130, h: 110 },
  { id: "bath", label: "Bathroom", color: "#8adbc7", w: 80, h: 70 },
  { id: "study", label: "Study", color: "#67c9af", w: 100, h: 80 },
  { id: "garage", label: "Garage", color: "#7ab7a6", w: 130, h: 90 },
  { id: "deck", label: "Deck/Lanai", color: "#91dfcd", w: 160, h: 70 },
  { id: "utility", label: "Utility", color: "#6cbca7", w: 70, h: 60 },
];

const FEATURES = [
  { id: "elevated", label: "Elevated Foundation (+4ft BFE)", score: 22 },
  { id: "floodvents", label: "Engineered Flood Vents", score: 12 },
  { id: "seawall", label: "Living Shoreline / Seawall", score: 14 },
  { id: "impact", label: "Impact-Rated Windows & Doors", score: 16 },
  { id: "mangrove", label: "Mangrove Buffer Zone", score: 18 },
  { id: "permeable", label: "Permeable Paving", score: 8 },
  { id: "solar", label: "Rooftop Solar Array", score: 6 },
  { id: "rainwater", label: "Rainwater Harvesting", score: 10 },
];

const MATERIALS = [
  { id: "reclaimed", label: "Reclaimed Timber", ecoBoost: 12, floodBonus: 0 },
  { id: "fsc", label: "FSC Certified Wood", ecoBoost: 8, floodBonus: 0 },
  { id: "recycledstl", label: "Recycled Steel", ecoBoost: 7, floodBonus: 5 },
  { id: "rcc", label: "Reinforced Concrete", ecoBoost: 2, floodBonus: 15 },
  { id: "hemp", label: "Hempcrete Insulation", ecoBoost: 14, floodBonus: 0 },
  { id: "coolroof", label: "Cool Roof Membrane", ecoBoost: 9, floodBonus: 3 },
  { id: "ipe", label: "Sustainably Sourced Ipe", ecoBoost: 6, floodBonus: 8 },
  { id: "solar", label: "BIPV Solar Cladding", ecoBoost: 11, floodBonus: 4 },
];

const uid = () => Math.random().toString(36).slice(2, 8);
const snap = (v, g = 10) => Math.round(v / g) * g;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

async function callClaude(system, userMsg) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system,
      messages: [{ role: "user", content: userMsg }],
    }),
  });
  const data = await res.json();
  return data.content?.map((c) => c.text || "").join("") || "";
}

function ScoreRing({ value, size = 86, stroke = 6, color, label }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)", display: "block" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 10, color: T.textFaint }}>/100</div>
          </div>
        </div>
      </div>
      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: "0.18em", color: T.textFaint, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

function SideSection({ label, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: `1px solid ${T.borderSoft}` }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          background: "transparent",
          border: "none",
          fontFamily: "'Outfit',sans-serif",
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: T.accent,
          cursor: "pointer",
        }}
      >
        {label}
        {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
      </button>
      {open && <div style={{ paddingBottom: 8 }}>{children}</div>}
    </div>
  );
}

function BlueprintCanvas({ rooms, setRooms, selectedId, setSelectedId }) {
  const ref = useRef(null);
  const drag = useRef(null);
  const resize = useRef(null);

  const onMouseUp = useCallback(() => {
    drag.current = null;
    resize.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("blur", onMouseUp);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("blur", onMouseUp);
    };
  }, [onMouseUp]);

  const onRoomMouseDown = useCallback((e, id, mode) => {
    e.stopPropagation();
    if (!ref.current) return;
    setSelectedId(id);
    const rect = ref.current.getBoundingClientRect();
    const room = rooms.find((r) => r.id === id);
    if (!room) return;
    if (mode === "resize") {
      resize.current = { id, ox: e.clientX, oy: e.clientY, ow: room.w, oh: room.h };
    } else {
      drag.current = { id, ox: e.clientX - rect.left - room.x, oy: e.clientY - rect.top - room.y };
    }
  }, [rooms, setSelectedId]);

  const onMouseMove = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dragState = drag.current;
    if (dragState) {
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      setRooms((prev) => prev.map((r) =>
        r.id === dragState.id
          ? { ...r, x: clamp(snap(mx - dragState.ox), 0, rect.width - r.w), y: clamp(snap(my - dragState.oy), 0, rect.height - r.h) }
          : r
      ));
    }
    const resizeState = resize.current;
    if (resizeState) {
      const dx = e.clientX - resizeState.ox;
      const dy = e.clientY - resizeState.oy;
      setRooms((prev) => prev.map((r) =>
        r.id === resizeState.id
          ? { ...r, w: clamp(snap(resizeState.ow + dx), 50, 500), h: clamp(snap(resizeState.oh + dy), 40, 400) }
          : r
      ));
    }
  }, [setRooms]);
  const area = useMemo(() => rooms.reduce((s, r) => s + Math.round(r.w * r.h / 929), 0), [rooms]);

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onClick={() => setSelectedId(null)}
      style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        backgroundImage: [
          "linear-gradient(rgba(255,255,255,0.42) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(255,255,255,0.42) 1px, transparent 1px)",
          "radial-gradient(circle at 18% 82%, rgba(255, 255, 255, 0.12) 0%, transparent 55%)",
          "radial-gradient(circle at 78% 18%, rgba(236, 239, 243, 0.1) 0%, transparent 52%)",
          "linear-gradient(160deg, rgba(198,203,209,0.98), rgba(216,221,227,0.98))",
        ].join(","),
        backgroundSize: "40px 40px, 40px 40px, 100% 100%, 100% 100%, 100% 100%",
        backgroundColor: T.bg,
      }}
    >
      <svg style={{ position: "absolute", top: 14, right: 14, opacity: 0.38 }} width={40} height={40}>
        <line x1={20} y1={3} x2={20} y2={37} stroke={T.accent} strokeWidth={1} />
        <line x1={3} y1={20} x2={37} y2={20} stroke={T.accent} strokeWidth={1} />
        <polygon points="20,3 17,12 20,10 23,12" fill={T.accent} />
        <text x={20} y={31} textAnchor="middle" fill={T.textMuted} fontSize={9} fontFamily="Outfit, sans-serif">N</text>
      </svg>

      <div style={{ position: "absolute", bottom: 12, right: 16, fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: "0.2em", color: "rgba(194, 216, 206, 0.3)", userSelect: "none", textTransform: "uppercase" }}>
        NovaBay · Tampa Bay · {area} sqft
      </div>

      {rooms.map((room) => {
        const sel = room.id === selectedId;
        return (
          <div
            key={room.id}
            onMouseDown={(e) => onRoomMouseDown(e, room.id, "drag")}
            style={{
              position: "absolute",
              left: room.x,
              top: room.y,
              width: room.w,
              height: room.h,
              border: `${sel ? 2 : 1}px solid ${sel ? T.accent : "rgba(94,207,177,0.55)"}`,
              background: sel ? "rgba(94,207,177,0.16)" : "rgba(10, 24, 18, 0.72)",
              cursor: "grab",
              userSelect: "none",
              boxShadow: sel ? "0 0 0 1px rgba(94,207,177,0.35), inset 0 0 28px rgba(94,207,177,0.18)" : "none",
            }}
          >
            <div style={{ position: "absolute", top: 7, left: 9, right: 20, fontFamily: "'Outfit',sans-serif", fontSize: 14, letterSpacing: "0.13em", textTransform: "uppercase", color: T.text, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
              {room.label}
            </div>
            <div style={{ position: "absolute", bottom: 5, left: 9, fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: "0.08em", color: T.textFaint }}>
              {room.w}×{room.h}
            </div>
            <div
              onMouseDown={(e) => {
                e.stopPropagation();
                setSelectedId(room.id);
                onRoomMouseDown(e, room.id, "resize");
              }}
              style={{ position: "absolute", right: 0, bottom: 0, width: 14, height: 14, cursor: "se-resize" }}
            >
              <svg width={8} height={8} style={{ position: "absolute", right: 2, bottom: 2 }}>
                <path d="M0 8 L8 0 M4 8 L8 4" stroke={T.accent} strokeWidth={1} opacity={0.8} />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChatBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", marginBottom: 12 }}>
      {!isUser && <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: "0.18em", color: T.accent, marginBottom: 4, textTransform: "uppercase" }}>NovaBay AI</div>}
      <div style={{ maxWidth: "88%", padding: "10px 13px", background: isUser ? "rgba(94,207,177,0.18)" : "rgba(94,207,177,0.08)", border: `1px solid ${T.border}`, borderRadius: isUser ? "10px 10px 2px 10px" : "10px 10px 10px 2px", fontSize: 13, lineHeight: 1.65, color: T.text }}>{msg.text}</div>
    </div>
  );
}

export default function NovaBay() {
  const [activeTab, setActiveTab] = useState("blueprint");
  const [activeStyle, setActiveStyle] = useState(STYLES[0]);
  const [rooms, setRooms] = useState([
    { id: uid(), type: "living", label: "Living Room", color: "#5ecfb1", x: 60, y: 55, w: 180, h: 130 },
    { id: uid(), type: "kitchen", label: "Kitchen", color: "#72d7be", x: 260, y: 55, w: 120, h: 100 },
    { id: uid(), type: "bedroom", label: "Master Bedroom", color: "#4ec0a4", x: 60, y: 205, w: 140, h: 115 },
    { id: uid(), type: "deck", label: "Deck/Lanai", color: "#91dfcd", x: 260, y: 165, w: 160, h: 75 },
  ]);
  const [selectedId, setSelectedId] = useState(null);
  const [features, setFeatures] = useState(new Set(["elevated", "impact", "seawall"]));
  const [materials, setMaterials] = useState(new Set(["fsc", "coolroof"]));
  const [chat, setChat] = useState([{ role: "ai", text: "Welcome to NovaBay. Describe your project and we will tune it for Tampa Bay flood resilience." }]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const ecoScore = useMemo(() => {
    let b = activeStyle.eco;
    materials.forEach((mid) => { const m = MATERIALS.find((x) => x.id === mid); if (m) b += m.ecoBoost * 0.4; });
    if (features.has("mangrove")) b += 6;
    if (features.has("solar")) b += 4;
    if (features.has("rainwater")) b += 3;
    if (features.has("permeable")) b += 2;
    return clamp(Math.round(b), 0, 100);
  }, [activeStyle, materials, features]);

  const resScore = useMemo(() => {
    let b = activeStyle.resilience;
    features.forEach((fid) => { const f = FEATURES.find((x) => x.id === fid); if (f) b += f.score * 0.35; });
    materials.forEach((mid) => { const m = MATERIALS.find((x) => x.id === mid); if (m) b += m.floodBonus * 0.15; });
    return clamp(Math.round(b), 0, 100);
  }, [activeStyle, features, materials]);

  const totalArea = useMemo(() => rooms.reduce((s, r) => s + Math.round((r.w * r.h) / 929), 0), [rooms]);
  const overallScore = Math.round((ecoScore + resScore) / 2);
  const sustainScore = clamp(Math.round(activeStyle.eco * 0.6 + features.size * 5), 0, 100);
  const scoreColor = (v) => (v > 75 ? T.accent : v > 50 ? "#bfe8db" : T.danger);

  function addRoom(typeId) {
    const rt = ROOM_TYPES.find((x) => x.id === typeId);
    if (!rt) return;
    setRooms((prev) => [...prev, {
      id: uid(), type: rt.id, label: rt.label, color: rt.color,
      x: clamp(snap(40 + Math.random() * 180), 0, 500),
      y: clamp(snap(40 + Math.random() * 160), 0, 350),
      w: rt.w, h: rt.h,
    }]);
  }

  function deleteRoom(id) {
    setRooms((p) => p.filter((r) => r.id !== id));
    setSelectedId(null);
  }

  function toggle(set, setFn, id) {
    setFn((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }

  async function runAnalysis() {
    setIsAnalyzing(true);
    setActiveTab("analysis");
    const featList = [...features].map((f) => FEATURES.find((x) => x.id === f)?.label).filter(Boolean).join(", ");
    const matList = [...materials].map((m) => MATERIALS.find((x) => x.id === m)?.label).filter(Boolean).join(", ");
    const roomList = rooms.map((r) => r.label).join(", ");
    const sys = "You are NovaBay, a coastal architecture AI specialized in Tampa Bay, Florida. Provide practical analysis for flood resilience and environmental impact. Plain text, max 280 words.";
    const prompt = `Analyze this coastal home:\nStyle: ${activeStyle.name} — ${activeStyle.desc}\nRooms: ${roomList}, Area: ~${totalArea} sqft\nResilience features: ${featList || "none"}, Materials: ${matList || "standard"}\nEco Index: ${ecoScore}/100, Resilience: ${resScore}/100\nProvide: (1) Key strengths for Tampa Bay, (2) Top 2 vulnerabilities, (3) Ecosystem impact, (4) One FEMA/code recommendation.`;
    try {
      const text = await callClaude(sys, prompt);
      setAiAnalysis(text);
    } catch {
      setAiAnalysis(`Analysis complete. ${activeStyle.name} has a strong baseline for Tampa Bay. Review FEMA FIRM maps and verify Florida Building Code Section 1612 compliance.`);
    }
    setIsAnalyzing(false);
  }

  async function sendChat() {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChat((prev) => [...prev, { role: "user", text: msg }]);
    setChatLoading(true);
    const ctx = `Design: ${activeStyle.name}, ${totalArea} sqft, rooms: ${rooms.map((r) => r.label).join(", ")}, eco: ${ecoScore}/100, resilience: ${resScore}/100.`;
    try {
      const text = await callClaude(
        "You are NovaBay, a friendly coastal architecture AI for Tampa Bay. Keep replies under 160 words and practical.",
        `${ctx}\n\nQuestion: ${msg}`
      );
      setChat((prev) => [...prev, { role: "ai", text }]);
    } catch {
      setChat((prev) => [...prev, { role: "ai", text: "Ask me about flood-resilient materials, code constraints, or eco upgrades for this plan." }]);
    }
    setChatLoading(false);
  }

  const selectedRoom = rooms.find((r) => r.id === selectedId);

  return (
    <div className="novabay-shell" style={{ display: "grid", gridTemplateRows: "70px 1fr", gridTemplateColumns: "310px 1fr 330px", height: "100vh", width: "100vw", background: T.bg, fontFamily: "'Outfit',system-ui,sans-serif", color: T.text, overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
        *,:before,:after{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px}
        ::-webkit-scrollbar-track{background:transparent}
        input::placeholder{color:${T.textFaint}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.5)}}
        @keyframes b0{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @media (max-width: 1180px){
          .novabay-shell{grid-template-columns: 280px 1fr 300px !important;}
        }
        @media (max-width: 980px){
          .novabay-shell{grid-template-rows: 70px auto auto auto !important; grid-template-columns: 1fr !important; height:auto !important; min-height:100vh; overflow:auto !important;}
          .novabay-left,.novabay-right{max-height:420px;}
          .novabay-main{min-height:560px;}
        }
      `}</style>

      <header style={{ gridColumn: "1/-1", background: "linear-gradient(180deg, rgba(5,15,12,0.94) 0%, rgba(5,15,12,0.7) 100%)", borderBottom: `1px solid ${T.borderSoft}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 14, zIndex: 100, backdropFilter: "blur(10px)" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: T.text }}>
          <svg width={26} height={26} viewBox="0 0 26 26">
            <circle cx={13} cy={13} r={11.5} fill="none" stroke={T.accent} strokeWidth={1} />
            <path d="M3 17 Q7 9 13 13 Q19 17 23 9" fill="none" stroke={T.accent} strokeWidth={1.5} />
            <circle cx={13} cy={13} r={2.6} fill={T.accent} />
          </svg>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 24, letterSpacing: ".14em", lineHeight: 1 }}>NOVA<span style={{ color: T.accent }}>BAY</span></div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: ".24em", color: T.textFaint, textTransform: "uppercase" }}>TAMPA BAY · COASTAL ARCHITECTURE</div>
          </div>
        </Link>

        <Link to="/" style={{ textDecoration: "none", color: T.accent, fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", padding: "8px 10px", border: `1px solid ${T.border}` }}>← Home</Link>

        <div style={{ width: 1, height: 34, background: T.borderSoft }} />

        {[
          { id: "blueprint", icon: <Layers size={13} />, label: "Blueprint" },
          { id: "analysis", icon: <BarChart2 size={13} />, label: "Analysis" },
          { id: "chat", icon: <MessageSquare size={13} />, label: "AI Advisor" },
        ].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: ".17em", textTransform: "uppercase", background: "transparent", border: "none", cursor: "pointer", color: activeTab === t.id ? T.accent : T.textMuted, borderBottom: activeTab === t.id ? `2px solid ${T.accent}` : "2px solid transparent", transition: "all .15s" }}>{t.icon} {t.label}</button>
        ))}

        <div style={{ flex: 1 }} />

        {[{ label: "ECO INDEX", val: ecoScore }, { label: "RESILIENCE", val: resScore }].map((s, i) => (
          <span key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 8px" }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: ".18em", color: T.textFaint }}>{s.label}</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: scoreColor(s.val), lineHeight: 1.1 }}>{s.val}<span style={{ fontSize: 12, color: T.textMuted }}>/100</span></span>
          </span>
        ))}

        <div style={{ width: 1, height: 34, background: T.borderSoft }} />

        <button onClick={runAnalysis} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 20px", fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", background: T.accent, border: "none", color: T.bg, borderRadius: 2, cursor: "pointer", boxShadow: "0 6px 28px rgba(94, 207, 177, 0.25)" }}><Zap size={13} style={{ color: T.bg }} /> Run Analysis</button>
      </header>

      <aside className="novabay-left" style={{ background: T.panel, borderRight: `1px solid ${T.borderSoft}`, overflowY: "auto", boxShadow: "inset -1px 0 0 rgba(94,207,177,0.08)" }}>
        <SideSection label="Architectural Style">
          {STYLES.map((s) => (
            <button key={s.id} onClick={() => setActiveStyle(s)} style={{ width: "100%", textAlign: "left", padding: "14px 16px", background: activeStyle.id === s.id ? T.accentSoft : "transparent", border: "none", borderLeft: `2px solid ${activeStyle.id === s.id ? T.accent : "transparent"}`, color: activeStyle.id === s.id ? T.text : T.textMuted, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all .15s" }}>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 600, marginBottom: 4, letterSpacing: "0.03em" }}>{s.name}</div>
                <div style={{ fontSize: 12, color: T.textFaint, lineHeight: 1.45 }}>{s.desc}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-end", flexShrink: 0 }}>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: T.accent }}>♻ {s.eco}</span>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: T.accent }}>⛨ {s.resilience}</span>
              </div>
            </button>
          ))}
        </SideSection>

        <SideSection label="Add Room">
          <div style={{ padding: "8px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {ROOM_TYPES.map((rt) => (
              <button key={rt.id} onClick={() => addRoom(rt.id)} style={{ padding: "10px 8px", fontSize: 13, fontFamily: "'Outfit',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", background: "transparent", border: `1px solid ${T.border}`, color: T.textMuted, cursor: "pointer", borderRadius: 2, display: "flex", alignItems: "center", gap: 4, transition: "background .15s", whiteSpace: "nowrap", overflow: "hidden" }} onMouseEnter={(e) => (e.currentTarget.style.background = T.accentSoft)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <Plus size={12} style={{ color: T.accent }} />{rt.label}
              </button>
            ))}
          </div>
        </SideSection>

        {selectedRoom && (
          <SideSection label="Selected Room" defaultOpen>
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, marginBottom: 10, color: T.accent }}>{selectedRoom.label}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                {[["Width", `${selectedRoom.w}px`], ["Height", `${selectedRoom.h}px`], ["Area", `~${Math.round((selectedRoom.w * selectedRoom.h) / 929)} sqft`], ["Position", `${selectedRoom.x},${selectedRoom.y}`]].map(([l, v]) => (
                  <div key={l} style={{ background: "rgba(255,255,255,.03)", border: `1px solid ${T.borderSoft}`, padding: "8px 9px", borderRadius: 2 }}>
                    <div style={{ fontSize: 11, color: T.textFaint, marginBottom: 2, letterSpacing: "0.1em", textTransform: "uppercase" }}>{l}</div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: T.text }}>{v}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => deleteRoom(selectedRoom.id)} style={{ width: "100%", padding: "10px", fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", background: "rgba(227,124,98,.08)", border: `1px solid rgba(227,124,98,.45)`, color: T.danger, borderRadius: 2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <Trash2 size={12} /> Delete Room
              </button>
            </div>
          </SideSection>
        )}
      </aside>

      <main className="novabay-main" style={{ overflow: "hidden", display: "flex", flexDirection: "column", background: T.bgSoft }}>
        {activeTab === "blueprint" && <BlueprintCanvas rooms={rooms} setRooms={setRooms} selectedId={selectedId} setSelectedId={setSelectedId} />}

        {activeTab === "analysis" && (
          <div style={{ flex: 1, overflowY: "auto", padding: 24, background: `radial-gradient(circle at 30% 70%,rgba(94,207,177,0.12) 0%,transparent 60%),${T.bgSoft}` }}>
            {isAnalyzing ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 14 }}>
                <svg width={44} height={44} style={{ animation: "spin 1.2s linear infinite" }}>
                  <circle cx={22} cy={22} r={18} fill="none" stroke={T.border} strokeWidth={1.5} />
                  <path d="M22 4 A18 18 0 0 1 40 22" fill="none" stroke={T.accent} strokeWidth={2} strokeLinecap="round" />
                </svg>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: ".22em", color: T.textMuted }}>ANALYZING COASTAL DESIGN…</div>
              </div>
            ) : (
              <div style={{ maxWidth: 920, margin: "0 auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
                  {[
                    { label: "Eco Index", val: ecoScore, color: T.accent, sub: "Environmental Impact" },
                    { label: "Resilience", val: resScore, color: T.accent, sub: "Flood & Storm" },
                    { label: "Overall", val: overallScore, color: T.accent, sub: "Combined Score" },
                    { label: "Floor Area", val: totalArea, color: T.accent, sub: activeStyle.name, suffix: " sqft" },
                  ].map((c) => (
                    <div key={c.label} style={{ background: "rgba(12, 25, 16, 0.82)", border: `1px solid ${T.borderSoft}`, borderRadius: 2, padding: "16px 18px" }}>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: ".18em", color: T.textFaint, marginBottom: 5, textTransform: "uppercase" }}>{c.label}</div>
                      <div style={{ fontSize: 28, fontWeight: 700, color: c.color, lineHeight: 1 }}>{c.val}{c.suffix || ""}{!c.suffix && <span style={{ fontSize: 14, color: T.textFaint }}>/100</span>}</div>
                      <div style={{ fontSize: 12, color: T.textFaint, marginTop: 4 }}>{c.sub}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 20, justifyContent: "center", background: "rgba(11, 24, 15, 0.84)", border: `1px solid ${T.borderSoft}`, borderRadius: 2, padding: "24px 32px", marginBottom: 20 }}>
                  <ScoreRing value={ecoScore} size={86} stroke={6} color={T.accent} label="Eco Index" />
                  <ScoreRing value={resScore} size={86} stroke={6} color={T.accent} label="Resilience" />
                  <ScoreRing value={overallScore} size={106} stroke={7} color={T.accent} label="Overall" />
                  <ScoreRing value={sustainScore} size={86} stroke={6} color={T.accent} label="Sustainability" />
                </div>

                {aiAnalysis ? (
                  <div style={{ background: "rgba(13, 28, 17, 0.9)", border: `1px solid ${T.border}`, borderRadius: 2, padding: "20px 24px", marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, animation: "pulse 2s ease-in-out infinite" }} />
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: ".2em", color: T.accent, textTransform: "uppercase" }}>NOVABAY AI ANALYSIS — TAMPA BAY</div>
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.78, color: T.text, whiteSpace: "pre-wrap" }}>{aiAnalysis}</p>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 0", color: T.textFaint, fontSize: 13 }}>Click <span style={{ color: T.accent }}>&quot;Run Analysis&quot;</span> to generate your Tampa Bay coastal report.</div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { title: "Active Resilience Features", items: [...features].map((fid) => { const f = FEATURES.find((x) => x.id === fid); return f ? { label: f.label, score: `+${f.score}` } : null; }).filter(Boolean), emptyMsg: "No features selected" },
                    { title: "Selected Materials", items: [...materials].map((mid) => { const m = MATERIALS.find((x) => x.id === mid); return m ? { label: m.label, score: `+${m.ecoBoost}` } : null; }).filter(Boolean), emptyMsg: "No materials selected" },
                  ].map((box) => (
                    <div key={box.title} style={{ background: "rgba(12, 25, 16, 0.85)", border: `1px solid ${T.borderSoft}`, borderRadius: 2, padding: 16 }}>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: ".18em", color: T.accent, marginBottom: 10, textTransform: "uppercase" }}>{box.title}</div>
                      {box.items.length > 0 ? box.items.map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, fontSize: 13, borderBottom: `1px solid ${T.borderSoft}`, paddingBottom: 7 }}>
                          <CheckCircle size={12} style={{ color: T.accent, flexShrink: 0 }} />
                          <span style={{ flex: 1, color: T.text }}>{item.label}</span>
                          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: T.accent }}>{item.score}</span>
                        </div>
                      )) : <div style={{ fontSize: 12, color: T.textFaint }}>{box.emptyMsg}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "chat" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>
              {chat.map((m, i) => <ChatBubble key={i} msg={m} />)}
              {chatLoading && <div style={{ display: "flex", gap: 4, padding: "8px 0" }}>{[0, 1, 2].map((i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, animation: `b0 1.2s ease-in-out ${i * .2}s infinite` }} />)}</div>}
              <div ref={chatEndRef} />
            </div>
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${T.border}`, background: T.panel, display: "flex", gap: 8 }}>
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat()} placeholder="Ask about flood resilience, Tampa Bay materials, eco strategies…" style={{ flex: 1, padding: "9px 12px", fontSize: 12, background: "rgba(255,255,255,.05)", border: `1px solid ${T.border}`, borderRadius: 2, color: T.text, outline: "none" }} />
              <button onClick={sendChat} disabled={chatLoading} style={{ padding: "10px 16px", fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", background: T.accent, border: "none", color: T.bg, borderRadius: 2, cursor: "pointer" }}>SEND</button>
            </div>
          </div>
        )}
      </main>

      <aside className="novabay-right" style={{ background: T.panel, borderLeft: `1px solid ${T.borderSoft}`, overflowY: "auto", boxShadow: "inset 1px 0 0 rgba(94,207,177,0.08)" }}>
        <SideSection label="Flood Resilience Features">
          {FEATURES.map((f) => {
            const on = features.has(f.id);
            return (
              <button key={f.id} onClick={() => toggle(features, setFeatures, f.id)} style={{ width: "100%", textAlign: "left", padding: "11px 16px", background: on ? T.accentSoft : "transparent", border: "none", borderLeft: `2px solid ${on ? T.accent : "transparent"}`, color: on ? T.text : T.textMuted, cursor: "pointer", display: "flex", alignItems: "center", gap: 9, transition: "all .15s", borderBottom: `1px solid ${T.borderSoft}` }}>
                <div style={{ width: 18, height: 18, borderRadius: 2, flexShrink: 0, background: on ? "rgba(94,207,177,.22)" : "rgba(255,255,255,.03)", border: `1px solid ${on ? T.accent : T.borderSoft}`, display: "grid", placeItems: "center", fontSize: 11, color: T.accent }}>{on && "✓"}</div>
                <span style={{ flex: 1, fontSize: 14, lineHeight: 1.3 }}>{f.label}</span>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: T.accent, flexShrink: 0 }}>+{f.score}</span>
              </button>
            );
          })}
        </SideSection>

        <SideSection label="Eco Materials">
          {MATERIALS.map((m) => {
            const on = materials.has(m.id);
            return (
              <button key={m.id} onClick={() => toggle(materials, setMaterials, m.id)} style={{ width: "100%", textAlign: "left", padding: "11px 16px", background: on ? T.accentSoft : "transparent", border: "none", borderLeft: `2px solid ${on ? T.accent : "transparent"}`, color: on ? T.text : T.textMuted, cursor: "pointer", display: "flex", alignItems: "center", gap: 9, transition: "all .15s", borderBottom: `1px solid ${T.borderSoft}` }}>
                <div style={{ width: 18, height: 18, borderRadius: 2, flexShrink: 0, background: on ? "rgba(94,207,177,.22)" : "rgba(255,255,255,.03)", border: `1px solid ${on ? T.accent : T.borderSoft}`, display: "grid", placeItems: "center", fontSize: 11, color: T.accent }}>{on && "✓"}</div>
                <span style={{ flex: 1, fontSize: 14, lineHeight: 1.3 }}>{m.label}</span>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0, gap: 1 }}>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: T.accent }}>eco+{m.ecoBoost}</span>
                  {m.floodBonus > 0 && <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: T.accent }}>res+{m.floodBonus}</span>}
                </div>
              </button>
            );
          })}
        </SideSection>

        <SideSection label={`${activeStyle.name} — Spec Materials`} defaultOpen={false}>
          <div style={{ padding: "10px 14px" }}>
            {activeStyle.materials.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: `1px solid ${T.borderSoft}`, fontSize: 13, color: T.textMuted }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.accent, flexShrink: 0 }} />
                {m}
              </div>
            ))}
          </div>
        </SideSection>

        <SideSection label="Tampa Bay Context" defaultOpen>
          <div style={{ padding: "10px 14px" }}>
            {[
              { icon: <Waves size={12} />, label: "FEMA Flood Zone", val: "AE / VE" },
              { icon: <Wind size={12} />, label: "Hurricane Risk", val: "Category 4+" },
              { icon: <Droplets size={12} />, label: "Sea Level Rise", val: "1.8 ft by 2070" },
              { icon: <Sun size={12} />, label: "Solar Potential", val: "5.4 hrs/day" },
              { icon: <Leaf size={12} />, label: "Ecosystem", val: "Mangrove/Seagrass" },
              { icon: <Waves size={12} />, label: "Storm Surge Risk", val: "High (Zone A)" },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 0", borderBottom: `1px solid ${T.borderSoft}` }}>
                <span style={{ color: T.accent, flexShrink: 0 }}>{row.icon}</span>
                <span style={{ fontSize: 13, color: T.textFaint, flex: 1 }}>{row.label}</span>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: T.accent, textAlign: "right" }}>{row.val}</span>
              </div>
            ))}
          </div>
        </SideSection>
      </aside>
    </div>
  );
}
