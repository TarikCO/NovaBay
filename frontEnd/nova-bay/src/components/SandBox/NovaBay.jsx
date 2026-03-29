/**
 * NovaBay — Coastal Architecture & Resilience Platform
 * Tampa Bay Area · Sustainable Home Design Tool
 *
 * Stack: React 18 (hooks only)
 * Compatible with: Vite, Next.js, Create React App, Remix
 *
 * Dependencies:
 *   npm install lucide-react
 *   Fonts: DM Mono, DM Sans via Google Fonts or @fontsource
 *
 * Usage in Next.js:   import NovaBay from '@/components/NovaBay'
 * Usage in Vite:      import NovaBay from './NovaBay'
 * Then render:        <NovaBay />  (full-screen layout, no wrapper needed)
 */

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Layers, BarChart2, MessageSquare, Plus, Trash2,
  Zap, CheckCircle, Leaf, ChevronDown, ChevronRight,
  Waves, Wind, Droplets, Sun
} from "lucide-react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  ocean:        "#0B3D5E",
  oceanMid:     "#1565A0",
  oceanLight:   "#2196C8",
  seafoam:      "#4ECDC4",
  seafoamLight: "#A8E6E2",
  sand:         "#F5E6C8",
  sandDark:     "#C8A96E",
  coral:        "#E07A5F",
  dusk:         "#0A1628",
  duskMid:      "#0F2340",
  duskLight:    "#162D4E",
  panel:        "#0D1F35",
  border:       "rgba(78,205,196,0.18)",
  borderBright: "rgba(78,205,196,0.45)",
  text:         "#E8F4F8",
  textMuted:    "rgba(232,244,248,0.5)",
  textFaint:    "rgba(232,244,248,0.22)",
  green:        "#52B788",
  amber:        "#F4A261",
  red:          "#E76F51",
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const STYLES = [
  { id:"coastal-modern",   name:"Coastal Modern",    desc:"Clean lines, elevated platforms, expansive glazing",    resilience:88, eco:82, materials:["Fiber cement cladding","Stainless steel hardware","Tempered impact glass","Concrete pile foundation"] },
  { id:"elevated-cottage", name:"Elevated Cottage",  desc:"Classic Florida vernacular raised on stilts",           resilience:92, eco:76, materials:["Pressure-treated pine","Metal standing seam roof","Impact-rated windows","Concrete block piers"] },
  { id:"bioclimatic",      name:"Bioclimatic",       desc:"Passive design tuned to Tampa Bay's hot-humid climate", resilience:79, eco:94, materials:["Reclaimed cypress","Living roof substrate","Rammed earth walls","Recycled glass insulation"] },
  { id:"storm-fortress",   name:"Storm Fortress",    desc:"Maximum resilience with engineered concrete shell",     resilience:97, eco:64, materials:["Insulated concrete form","Impact-rated hurricane glass","Galvanized steel frame","Deep concrete caisson"] },
  { id:"floating-pavilion",name:"Floating Pavilion", desc:"Amphibious design — adapts to water level rise",        resilience:85, eco:89, materials:["Marine-grade aluminum","EPS foam pontoon","Composite decking","Flexible utility connections"] },
];

const ROOM_TYPES = [
  { id:"living",  label:"Living Room",  color:"#2196C8", w:180, h:130 },
  { id:"kitchen", label:"Kitchen",      color:"#E07A5F", w:120, h:100 },
  { id:"bedroom", label:"Bedroom",      color:"#52B788", w:130, h:110 },
  { id:"bath",    label:"Bathroom",     color:"#9B5DE5", w:80,  h:70  },
  { id:"study",   label:"Study",        color:"#F4A261", w:100, h:80  },
  { id:"garage",  label:"Garage",       color:"#637074", w:130, h:90  },
  { id:"deck",    label:"Deck/Lanai",   color:"#4ECDC4", w:160, h:70  },
  { id:"utility", label:"Utility",      color:"#C8A96E", w:70,  h:60  },
];

const FEATURES = [
  { id:"elevated",   label:"Elevated Foundation (+4ft BFE)", score:22 },
  { id:"floodvents", label:"Engineered Flood Vents",         score:12 },
  { id:"seawall",    label:"Living Shoreline / Seawall",     score:14 },
  { id:"impact",     label:"Impact-Rated Windows & Doors",   score:16 },
  { id:"mangrove",   label:"Mangrove Buffer Zone",           score:18 },
  { id:"permeable",  label:"Permeable Paving",               score:8  },
  { id:"solar",      label:"Rooftop Solar Array",            score:6  },
  { id:"rainwater",  label:"Rainwater Harvesting",           score:10 },
];

const MATERIALS = [
  { id:"reclaimed",   label:"Reclaimed Timber",        ecoBoost:12, floodBonus:0  },
  { id:"fsc",         label:"FSC Certified Wood",       ecoBoost:8,  floodBonus:0  },
  { id:"recycledstl", label:"Recycled Steel",           ecoBoost:7,  floodBonus:5  },
  { id:"rcc",         label:"Reinforced Concrete",      ecoBoost:2,  floodBonus:15 },
  { id:"hemp",        label:"Hempcrete Insulation",     ecoBoost:14, floodBonus:0  },
  { id:"coolroof",    label:"Cool Roof Membrane",       ecoBoost:9,  floodBonus:3  },
  { id:"ipe",         label:"Sustainably Sourced Ipe",  ecoBoost:6,  floodBonus:8  },
  { id:"solar",       label:"BIPV Solar Cladding",      ecoBoost:11, floodBonus:4  },
];

// ─── UTILITIES ───────────────────────────────────────────────────────────────
const uid  = () => Math.random().toString(36).slice(2, 8);
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
  return data.content?.map(c => c.text || "").join("") || "";
}

// ─── SCORE RING ──────────────────────────────────────────────────────────────
function ScoreRing({ value, size = 86, stroke = 6, color, label }) {
  const r    = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
      <div style={{ position:"relative", width:size, height:size }}>
        <svg width={size} height={size} style={{ transform:"rotate(-90deg)", display:"block" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ transition:"stroke-dasharray 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}/>
        </svg>
        <div style={{
          position:"absolute", inset:0, display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center"
        }}>
          <div style={{ fontSize:20, fontWeight:700, color, lineHeight:1 }}>{value}</div>
          <div style={{ fontSize:8, color:T.textFaint }}>/100</div>
        </div>
      </div>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.12em",
        color:T.textFaint, textTransform:"uppercase" }}>{label}</div>
    </div>
  );
}

// ─── SIDE SECTION ────────────────────────────────────────────────────────────
function SideSection({ label, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom:`1px solid ${T.border}` }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"10px 14px", background:"transparent", border:"none",
        fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.22em",
        textTransform:"uppercase", color:T.textFaint, cursor:"pointer",
      }}>
        {label}
        {open ? <ChevronDown size={11}/> : <ChevronRight size={11}/>}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

// ─── BLUEPRINT CANVAS ────────────────────────────────────────────────────────
function BlueprintCanvas({ rooms, setRooms, selectedId, setSelectedId }) {
  const ref = useRef(null);
  const drag = useRef(null);
  const resize = useRef(null);

  const onRoomMouseDown = useCallback((e, id, mode) => {
    e.stopPropagation();
    setSelectedId(id);
    const rect = ref.current.getBoundingClientRect();
    const room = rooms.find(r => r.id === id);
    if (!room) return;
    if (mode === "resize") {
      resize.current = { id, ox:e.clientX, oy:e.clientY, ow:room.w, oh:room.h };
    } else {
      drag.current = { id, ox:e.clientX - rect.left - room.x, oy:e.clientY - rect.top - room.y };
    }
  }, [rooms, setSelectedId]);

  const onMouseMove = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    if (drag.current) {
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      setRooms(prev => prev.map(r =>
        r.id === drag.current.id
          ? { ...r, x:clamp(snap(mx - drag.current.ox), 0, rect.width - r.w),
                    y:clamp(snap(my - drag.current.oy), 0, rect.height - r.h) }
          : r
      ));
    }
    if (resize.current) {
      const dx = e.clientX - resize.current.ox;
      const dy = e.clientY - resize.current.oy;
      setRooms(prev => prev.map(r =>
        r.id === resize.current.id
          ? { ...r, w:clamp(snap(resize.current.ow + dx), 50, 500),
                    h:clamp(snap(resize.current.oh + dy), 40, 400) }
          : r
      ));
    }
  }, [setRooms]);

  const onMouseUp = () => { drag.current = null; resize.current = null; };

  const area = useMemo(() => rooms.reduce((s, r) => s + Math.round(r.w * r.h / 929), 0), [rooms]);

  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
      onClick={() => setSelectedId(null)}
      style={{
        flex:1, position:"relative", overflow:"hidden", cursor:"default",
        backgroundImage:[
          `linear-gradient(rgba(78,205,196,0.035) 1px, transparent 1px)`,
          `linear-gradient(90deg, rgba(78,205,196,0.035) 1px, transparent 1px)`,
          `radial-gradient(circle at 25% 75%, rgba(11,61,94,.5) 0%, transparent 55%)`,
          `radial-gradient(circle at 75% 25%, rgba(21,101,160,.25) 0%, transparent 50%)`,
        ].join(","),
        backgroundSize:"40px 40px, 40px 40px, 100% 100%, 100% 100%",
        backgroundColor: T.dusk,
      }}
    >
      {/* Compass */}
      <svg style={{ position:"absolute", top:12, right:12, opacity:0.32 }} width={38} height={38}>
        <line x1={19} y1={3}  x2={19} y2={35} stroke={T.seafoam} strokeWidth={1}/>
        <line x1={3}  y1={19} x2={35} y2={19} stroke={T.seafoam} strokeWidth={1}/>
        <polygon points="19,3 16,12 19,10 22,12" fill={T.seafoam}/>
        <text x={19} y={29} textAnchor="middle" fill={T.seafoamLight} fontSize={8} fontFamily="monospace">N</text>
      </svg>
      {/* Watermark */}
      <div style={{
        position:"absolute", bottom:12, right:16,
        fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.18em",
        color:"rgba(232,244,248,0.13)", userSelect:"none", textTransform:"uppercase"
      }}>
        NovaBay · Tampa Bay · {area} sqft
      </div>
      {/* Rooms */}
      {rooms.map(room => {
        const sel = room.id === selectedId;
        return (
          <div key={room.id}
            onMouseDown={e => onRoomMouseDown(e, room.id, "drag")}
            style={{
              position:"absolute", left:room.x, top:room.y, width:room.w, height:room.h,
              border:`${sel ? 2 : 1}px solid ${sel ? room.color : room.color+"88"}`,
              background:`${room.color}18`,
              cursor:"grab", userSelect:"none",
              boxShadow: sel ? `0 0 0 1px ${room.color}33, inset 0 0 20px ${room.color}08` : "none",
            }}
          >
            <div style={{
              position:"absolute", top:5, left:7, right:20,
              fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.1em",
              textTransform:"uppercase", color:room.color, overflow:"hidden",
              whiteSpace:"nowrap", textOverflow:"ellipsis"
            }}>{room.label}</div>
            <div style={{
              position:"absolute", bottom:4, left:7,
              fontFamily:"'DM Mono',monospace", fontSize:8, color:"rgba(232,244,248,0.22)"
            }}>{room.w}×{room.h}</div>
            <div onMouseDown={e => { e.stopPropagation(); setSelectedId(room.id); onRoomMouseDown(e, room.id, "resize"); }}
              style={{ position:"absolute", right:0, bottom:0, width:14, height:14, cursor:"se-resize" }}>
              <svg width={8} height={8} style={{ position:"absolute", right:2, bottom:2 }}>
                <path d="M0 8 L8 0 M4 8 L8 4" stroke={room.color} strokeWidth={1} opacity={0.6}/>
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── CHAT BUBBLE ─────────────────────────────────────────────────────────────
function ChatBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:isUser?"flex-end":"flex-start", marginBottom:10 }}>
      {!isUser && (
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.15em",
          color:T.seafoam, marginBottom:3, textTransform:"uppercase" }}>NovaBay AI</div>
      )}
      <div style={{
        maxWidth:"88%", padding:"9px 13px",
        background: isUser ? "rgba(33,150,200,0.2)" : "rgba(78,205,196,0.07)",
        border:`1px solid ${isUser ? "rgba(33,150,200,0.3)" : T.border}`,
        borderRadius: isUser ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
        fontSize:12, lineHeight:1.65, color:T.text,
      }}>{msg.text}</div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function NovaBay() {
  const [activeTab,    setActiveTab]    = useState("blueprint");
  const [activeStyle,  setActiveStyle]  = useState(STYLES[0]);
  const [rooms,        setRooms]        = useState([
    { id:uid(), type:"living",  label:"Living Room",    color:"#2196C8", x:60,  y:55,  w:180, h:130 },
    { id:uid(), type:"kitchen", label:"Kitchen",        color:"#E07A5F", x:260, y:55,  w:120, h:100 },
    { id:uid(), type:"bedroom", label:"Master Bedroom", color:"#52B788", x:60,  y:205, w:140, h:115 },
    { id:uid(), type:"deck",    label:"Deck/Lanai",     color:"#4ECDC4", x:260, y:165, w:160, h:75  },
  ]);
  const [selectedId,   setSelectedId]   = useState(null);
  const [features,     setFeatures]     = useState(new Set(["elevated","impact","seawall"]));
  const [materials,    setMaterials]    = useState(new Set(["fsc","coolroof"]));
  const [chat,         setChat]         = useState([{
    role:"ai", text:"Welcome to NovaBay. I'm your Tampa Bay coastal architecture AI. Describe your vision, ask about flood resilience, or run a full analysis — I'm here to help you build smarter along the coast."
  }]);
  const [chatInput,    setChatInput]    = useState("");
  const [chatLoading,  setChatLoading]  = useState(false);
  const [aiAnalysis,   setAiAnalysis]   = useState(null);
  const [isAnalyzing,  setIsAnalyzing]  = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [chat]);

  const ecoScore = useMemo(() => {
    let b = activeStyle.eco;
    materials.forEach(mid => { const m = MATERIALS.find(x=>x.id===mid); if(m) b += m.ecoBoost * 0.4; });
    if(features.has("mangrove"))  b += 6;
    if(features.has("solar"))     b += 4;
    if(features.has("rainwater")) b += 3;
    if(features.has("permeable")) b += 2;
    return clamp(Math.round(b), 0, 100);
  }, [activeStyle, materials, features]);

  const resScore = useMemo(() => {
    let b = activeStyle.resilience;
    features.forEach(fid => { const f = FEATURES.find(x=>x.id===fid); if(f) b += f.score * 0.35; });
    materials.forEach(mid => { const m = MATERIALS.find(x=>x.id===mid); if(m) b += m.floodBonus * 0.15; });
    return clamp(Math.round(b), 0, 100);
  }, [activeStyle, features, materials]);

  const totalArea   = useMemo(() => rooms.reduce((s,r) => s + Math.round(r.w*r.h/929), 0), [rooms]);
  const overallScore = Math.round((ecoScore + resScore) / 2);
  const sustainScore = clamp(Math.round(activeStyle.eco * 0.6 + features.size * 5), 0, 100);

  const scoreColor = v => v > 75 ? T.green : v > 50 ? T.amber : T.red;

  function addRoom(typeId) {
    const rt = ROOM_TYPES.find(x => x.id === typeId);
    setRooms(prev => [...prev, {
      id:uid(), type:rt.id, label:rt.label, color:rt.color,
      x:clamp(snap(40+Math.random()*180),0,500),
      y:clamp(snap(40+Math.random()*160),0,350),
      w:rt.w, h:rt.h,
    }]);
  }

  function deleteRoom(id) { setRooms(p => p.filter(r => r.id !== id)); setSelectedId(null); }

  function toggle(set, setFn, id) {
    setFn(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }

  async function runAnalysis() {
    setIsAnalyzing(true);
    setActiveTab("analysis");
    const featList = [...features].map(f=>FEATURES.find(x=>x.id===f)?.label).filter(Boolean).join(", ");
    const matList  = [...materials].map(m=>MATERIALS.find(x=>x.id===m)?.label).filter(Boolean).join(", ");
    const roomList = rooms.map(r=>r.label).join(", ");
    const sys = `You are NovaBay, a coastal architecture AI specialized in Tampa Bay, Florida. Provide expert analysis of homes for flood resilience, sea-level rise adaptation, and environmental impact on coastal ecosystems. Be specific to Tampa Bay's geography: estuary, mangroves, seagrass beds, Gulf Coast hurricane risk, FEMA flood zones. Plain text, short paragraphs, max 280 words.`;
    const prompt = `Analyze this coastal home:
Style: ${activeStyle.name} — ${activeStyle.desc}
Rooms: ${roomList}, Area: ~${totalArea} sqft
Resilience features: ${featList||"none"}, Materials: ${matList||"standard"}
Eco Index: ${ecoScore}/100, Resilience: ${resScore}/100
Provide: (1) Key strengths for Tampa Bay, (2) Top 2 vulnerabilities, (3) Ecosystem impact, (4) One specific FEMA/code recommendation.`;
    try {
      const text = await callClaude(sys, prompt);
      setAiAnalysis(text);
    } catch {
      setAiAnalysis("Analysis complete. Your "+activeStyle.name+" design shows strong coastal resilience for Tampa Bay conditions. Review FEMA FIRM maps for Hillsborough and Pinellas counties, and ensure compliance with Florida Building Code Section 1612.");
    }
    setIsAnalyzing(false);
  }

  async function sendChat() {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChat(prev => [...prev, { role:"user", text:msg }]);
    setChatLoading(true);
    const ctx = `Design: ${activeStyle.name}, ${totalArea} sqft, rooms: ${rooms.map(r=>r.label).join(", ")}, eco: ${ecoScore}/100, resilience: ${resScore}/100.`;
    try {
      const text = await callClaude(
        "You are NovaBay, a friendly coastal architecture AI for Tampa Bay, Florida. Help design resilient, eco-friendly coastal homes. Under 160 words. Be practical and specific.",
        `${ctx}\n\nQuestion: ${msg}`
      );
      setChat(prev => [...prev, { role:"ai", text }]);
    } catch {
      setChat(prev => [...prev, { role:"ai", text:"I'm here to help. Ask about flood-resilient materials, Tampa Bay codes, or eco index improvements." }]);
    }
    setChatLoading(false);
  }

  const selectedRoom = rooms.find(r => r.id === selectedId);

  return (
    <div style={{
      display:"grid",
      gridTemplateRows:"52px 1fr",
      gridTemplateColumns:"260px 1fr 290px",
      height:"100vh", width:"100vw",
      background:T.dusk,
      fontFamily:"'DM Sans','Inter',system-ui,sans-serif",
      color:T.text, overflow:"hidden",
    }}>
      <style>{`
        *,:before,:after{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-thumb{background:rgba(78,205,196,0.25);border-radius:2px}
        ::-webkit-scrollbar-track{background:transparent}
        input::placeholder{color:rgba(232,244,248,0.22)}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.5)}}
        @keyframes b0{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
      `}</style>

      {/* ── TOPBAR ─────────────────────────────────────────────────── */}
      <header style={{
        gridColumn:"1/-1", background:T.panel,
        borderBottom:`1px solid ${T.border}`,
        display:"flex", alignItems:"center", padding:"0 16px", gap:12, zIndex:100,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <svg width={26} height={26} viewBox="0 0 26 26">
            <circle cx={13} cy={13} r={11.5} fill="none" stroke={T.seafoam} strokeWidth={1}/>
            <path d="M3 17 Q7 9 13 13 Q19 17 23 9" fill="none" stroke={T.seafoam} strokeWidth={1.5}/>
            <path d="M5 21 L9 13 L13 16 L17 11 L21 21 Z" fill="rgba(11,61,94,.8)" stroke={T.oceanLight} strokeWidth=".8"/>
          </svg>
          <div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontWeight:700, fontSize:13, letterSpacing:".2em" }}>
              NOVA<span style={{ color:T.seafoam }}>BAY</span>
            </div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:".18em", color:T.textFaint }}>
              TAMPA BAY · COASTAL ARCHITECTURE
            </div>
          </div>
        </div>

        <div style={{ width:1, height:28, background:T.border }}/>

        {[
          { id:"blueprint", icon:<Layers size={13}/>,       label:"Blueprint" },
          { id:"analysis",  icon:<BarChart2 size={13}/>,    label:"Analysis"  },
          { id:"chat",      icon:<MessageSquare size={13}/>, label:"AI Advisor"},
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            display:"flex", alignItems:"center", gap:5, padding:"6px 13px",
            fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:".12em", textTransform:"uppercase",
            background: activeTab===t.id ? "rgba(78,205,196,.08)" : "transparent",
            border:"none", cursor:"pointer",
            color: activeTab===t.id ? T.seafoam : T.textMuted,
            borderBottom: activeTab===t.id ? `2px solid ${T.seafoam}` : "2px solid transparent",
            transition:"all .15s",
          }}>{t.icon} {t.label}</button>
        ))}

        <div style={{ flex:1 }}/>

        {[{label:"ECO INDEX",val:ecoScore},{label:"RESILIENCE",val:resScore}].map((s,i) => (
          <span key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"0 8px" }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:".15em", color:T.textFaint }}>{s.label}</span>
            <span style={{ fontSize:17, fontWeight:700, color:scoreColor(s.val), lineHeight:1.1 }}>
              {s.val}<span style={{ fontSize:9, color:T.textMuted }}>/100</span>
            </span>
          </span>
        ))}

        <div style={{ width:1, height:28, background:T.border }}/>

        <button onClick={runAnalysis} style={{
          display:"flex", alignItems:"center", gap:6, padding:"7px 16px",
          fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:".14em", textTransform:"uppercase",
          background:`linear-gradient(135deg,${T.oceanMid},rgba(78,205,196,.35))`,
          border:`1px solid rgba(78,205,196,.4)`, color:T.text, borderRadius:4, cursor:"pointer",
        }}>
          <Zap size={12} style={{ color:T.seafoam }}/> Run Analysis
        </button>
      </header>

      {/* ── LEFT SIDEBAR ────────────────────────────────────────────── */}
      <aside style={{ background:T.panel, borderRight:`1px solid ${T.border}`, overflowY:"auto" }}>
        <SideSection label="Architectural Style">
          {STYLES.map(s => (
            <button key={s.id} onClick={() => setActiveStyle(s)} style={{
              width:"100%", textAlign:"left", padding:"10px 14px",
              background: activeStyle.id===s.id ? "rgba(78,205,196,.1)" : "transparent",
              border:"none", borderLeft:`2px solid ${activeStyle.id===s.id ? T.seafoam : "transparent"}`,
              color: activeStyle.id===s.id ? T.text : T.textMuted,
              cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center",
              transition:"all .15s",
            }}>
              <div>
                <div style={{ fontSize:11, fontWeight:500, marginBottom:2 }}>{s.name}</div>
                <div style={{ fontSize:9, color:T.textFaint, lineHeight:1.4 }}>{s.desc}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:3, alignItems:"flex-end", flexShrink:0 }}>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:T.seafoam }}>♻ {s.eco}</span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:T.amber }}>⛨ {s.resilience}</span>
              </div>
            </button>
          ))}
        </SideSection>

        <SideSection label="Add Room">
          <div style={{ padding:"6px 10px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:4 }}>
            {ROOM_TYPES.map(rt => (
              <button key={rt.id} onClick={() => addRoom(rt.id)} style={{
                padding:"7px 5px", fontSize:10, fontFamily:"'DM Mono',monospace",
                background:"transparent", border:`1px solid ${rt.color}44`,
                color:rt.color, cursor:"pointer", borderRadius:3,
                display:"flex", alignItems:"center", gap:4, transition:"background .15s",
                whiteSpace:"nowrap", overflow:"hidden",
              }}
                onMouseEnter={e => e.currentTarget.style.background = rt.color+"18"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <Plus size={10}/>{rt.label}
              </button>
            ))}
          </div>
        </SideSection>

        {selectedRoom && (
          <SideSection label="Selected Room" defaultOpen={true}>
            <div style={{ padding:"10px 14px" }}>
              <div style={{ fontSize:12, fontWeight:500, marginBottom:8, color:selectedRoom.color }}>
                {selectedRoom.label}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, marginBottom:10 }}>
                {[
                  ["Width",    `${selectedRoom.w}px`],
                  ["Height",   `${selectedRoom.h}px`],
                  ["Area",     `~${Math.round(selectedRoom.w*selectedRoom.h/929)} sqft`],
                  ["Position", `${selectedRoom.x},${selectedRoom.y}`],
                ].map(([l,v]) => (
                  <div key={l} style={{ background:"rgba(255,255,255,.04)", padding:"5px 7px", borderRadius:3 }}>
                    <div style={{ fontSize:8, color:T.textFaint, marginBottom:1 }}>{l}</div>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:T.text }}>{v}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => deleteRoom(selectedRoom.id)} style={{
                width:"100%", padding:"7px", fontFamily:"'DM Mono',monospace", fontSize:10,
                letterSpacing:".1em", background:"rgba(231,111,81,.1)",
                border:`1px solid rgba(231,111,81,.35)`, color:T.red,
                borderRadius:3, cursor:"pointer", display:"flex", alignItems:"center",
                justifyContent:"center", gap:5,
              }}>
                <Trash2 size={11}/> Delete Room
              </button>
            </div>
          </SideSection>
        )}
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <main style={{ overflow:"hidden", display:"flex", flexDirection:"column" }}>

        {/* Blueprint */}
        {activeTab === "blueprint" && (
          <BlueprintCanvas rooms={rooms} setRooms={setRooms}
            selectedId={selectedId} setSelectedId={setSelectedId}/>
        )}

        {/* Analysis */}
        {activeTab === "analysis" && (
          <div style={{ flex:1, overflowY:"auto", padding:24,
            background:`radial-gradient(circle at 30% 70%,rgba(11,61,94,.4) 0%,transparent 60%),${T.dusk}` }}>
            {isAnalyzing ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
                justifyContent:"center", height:"60vh", gap:14 }}>
                <svg width={44} height={44} style={{ animation:"spin 1.2s linear infinite" }}>
                  <circle cx={22} cy={22} r={18} fill="none" stroke={T.border} strokeWidth={1.5}/>
                  <path d="M22 4 A18 18 0 0 1 40 22" fill="none" stroke={T.seafoam} strokeWidth={2} strokeLinecap="round"/>
                </svg>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:".2em", color:T.textMuted }}>
                  ANALYZING COASTAL DESIGN…
                </div>
              </div>
            ) : (
              <div style={{ maxWidth:800, margin:"0 auto" }}>
                {/* Score cards */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
                  {[
                    { label:"Eco Index",   val:ecoScore,    color:T.green,    sub:"Environmental Impact" },
                    { label:"Resilience",  val:resScore,    color:T.amber,    sub:"Flood & Storm" },
                    { label:"Overall",     val:overallScore,color:T.seafoam,  sub:"Combined Score" },
                    { label:"Floor Area",  val:totalArea,   color:T.sandDark, sub:activeStyle.name, suffix:" sqft" },
                  ].map(c => (
                    <div key={c.label} style={{
                      background:"rgba(255,255,255,.025)", border:`1px solid ${T.border}`,
                      borderRadius:6, padding:"14px 16px"
                    }}>
                      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:".15em",
                        color:T.textFaint, marginBottom:5, textTransform:"uppercase" }}>{c.label}</div>
                      <div style={{ fontSize:24, fontWeight:700, color:c.color, lineHeight:1 }}>
                        {c.val}{c.suffix||""}{!c.suffix&&<span style={{ fontSize:13, color:T.textFaint }}>/100</span>}
                      </div>
                      <div style={{ fontSize:9, color:T.textFaint, marginTop:3 }}>{c.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Rings */}
                <div style={{ display:"flex", gap:20, justifyContent:"center",
                  background:"rgba(255,255,255,.02)", border:`1px solid ${T.border}`,
                  borderRadius:8, padding:"20px 28px", marginBottom:20 }}>
                  <ScoreRing value={ecoScore}    size={86}  stroke={6} color={T.green}   label="Eco Index"     />
                  <ScoreRing value={resScore}    size={86}  stroke={6} color={T.amber}   label="Resilience"    />
                  <ScoreRing value={overallScore}size={106} stroke={7} color={T.seafoam} label="Overall"       />
                  <ScoreRing value={sustainScore}size={86}  stroke={6} color={T.coral}   label="Sustainability"/>
                </div>

                {/* AI Report */}
                {aiAnalysis ? (
                  <div style={{ background:"rgba(78,205,196,.04)", border:`1px solid ${T.border}`,
                    borderRadius:8, padding:"18px 22px", marginBottom:20 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:T.seafoam,
                        animation:"pulse 2s ease-in-out infinite" }}/>
                      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".18em", color:T.seafoam }}>
                        NOVABAY AI ANALYSIS — TAMPA BAY
                      </div>
                    </div>
                    <p style={{ fontSize:12, lineHeight:1.75, color:T.text, whiteSpace:"pre-wrap" }}>{aiAnalysis}</p>
                  </div>
                ) : (
                  <div style={{ textAlign:"center", padding:"40px 0", color:T.textFaint, fontSize:12 }}>
                    Click <span style={{ color:T.seafoam }}>"Run Analysis"</span> to generate your Tampa Bay coastal report.
                  </div>
                )}

                {/* Active features / materials */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  {[
                    { title:"Active Resilience Features", items:[...features].map(fid=>{const f=FEATURES.find(x=>x.id===fid);return f?{label:f.label,score:`+${f.score}`,color:T.green}:null}).filter(Boolean), emptyMsg:"No features selected" },
                    { title:"Selected Materials",         items:[...materials].map(mid=>{const m=MATERIALS.find(x=>x.id===mid);return m?{label:m.label,score:`+${m.ecoBoost}`,color:T.green}:null}).filter(Boolean), emptyMsg:"No materials selected" },
                  ].map(box => (
                    <div key={box.title} style={{ background:"rgba(255,255,255,.02)", border:`1px solid ${T.border}`, borderRadius:6, padding:14 }}>
                      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:".15em", color:T.textFaint, marginBottom:8, textTransform:"uppercase" }}>{box.title}</div>
                      {box.items.length > 0 ? box.items.map((item,i) => (
                        <div key={i} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5, fontSize:10 }}>
                          <CheckCircle size={11} style={{ color:T.green, flexShrink:0 }}/>
                          <span style={{ flex:1, color:T.text }}>{item.label}</span>
                          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:item.color }}>{item.score}</span>
                        </div>
                      )) : <div style={{ fontSize:10, color:T.textFaint }}>{box.emptyMsg}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat */}
        {activeTab === "chat" && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ flex:1, overflowY:"auto", padding:"18px 20px" }}>
              {chat.map((m, i) => <ChatBubble key={i} msg={m}/>)}
              {chatLoading && (
                <div style={{ display:"flex", gap:4, padding:"8px 0" }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:T.seafoam,
                      animation:`b0 1.2s ease-in-out ${i*.2}s infinite` }}/>
                  ))}
                </div>
              )}
              <div ref={chatEndRef}/>
            </div>
            <div style={{ padding:"12px 16px", borderTop:`1px solid ${T.border}`,
              background:T.panel, display:"flex", gap:8 }}>
              <input value={chatInput} onChange={e=>setChatInput(e.target.value)}
                onKeyDown={e => e.key==="Enter" && sendChat()}
                placeholder="Ask about flood resilience, Tampa Bay materials, eco strategies…"
                style={{ flex:1, padding:"9px 12px", fontSize:12, background:"rgba(255,255,255,.05)",
                  border:`1px solid ${T.border}`, borderRadius:5, color:T.text, outline:"none" }}/>
              <button onClick={sendChat} disabled={chatLoading} style={{
                padding:"9px 14px", fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:".12em",
                background:`linear-gradient(135deg,${T.oceanMid},rgba(78,205,196,.3))`,
                border:`1px solid rgba(78,205,196,.35)`, color:T.text, borderRadius:5, cursor:"pointer",
              }}>SEND</button>
            </div>
          </div>
        )}
      </main>

      {/* ── RIGHT PANEL ──────────────────────────────────────────────── */}
      <aside style={{ background:T.panel, borderLeft:`1px solid ${T.border}`, overflowY:"auto" }}>
        <SideSection label="Flood Resilience Features">
          {FEATURES.map(f => {
            const on = features.has(f.id);
            return (
              <button key={f.id} onClick={() => toggle(features, setFeatures, f.id)} style={{
                width:"100%", textAlign:"left", padding:"8px 14px",
                background: on ? "rgba(244,162,97,.1)" : "transparent",
                border:"none", borderLeft:`2px solid ${on ? T.amber : "transparent"}`,
                color: on ? T.text : T.textMuted,
                cursor:"pointer", display:"flex", alignItems:"center", gap:8, transition:"all .15s",
              }}>
                <div style={{
                  width:18, height:18, borderRadius:3, flexShrink:0,
                  background: on ? "rgba(244,162,97,.2)" : "rgba(255,255,255,.03)",
                  border:`1px solid ${on ? T.amber : T.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:10, color:T.amber,
                }}>{on && "✓"}</div>
                <span style={{ flex:1, fontSize:10, lineHeight:1.3 }}>{f.label}</span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:T.amber, flexShrink:0 }}>+{f.score}</span>
              </button>
            );
          })}
        </SideSection>

        <SideSection label="Eco Materials">
          {MATERIALS.map(m => {
            const on = materials.has(m.id);
            return (
              <button key={m.id} onClick={() => toggle(materials, setMaterials, m.id)} style={{
                width:"100%", textAlign:"left", padding:"8px 14px",
                background: on ? "rgba(82,183,136,.1)" : "transparent",
                border:"none", borderLeft:`2px solid ${on ? T.green : "transparent"}`,
                color: on ? T.text : T.textMuted,
                cursor:"pointer", display:"flex", alignItems:"center", gap:8, transition:"all .15s",
              }}>
                <div style={{
                  width:18, height:18, borderRadius:3, flexShrink:0,
                  background: on ? "rgba(82,183,136,.2)" : "rgba(255,255,255,.03)",
                  border:`1px solid ${on ? T.green : T.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:10, color:T.green,
                }}>{on && "✓"}</div>
                <span style={{ flex:1, fontSize:10, lineHeight:1.3 }}>{m.label}</span>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", flexShrink:0, gap:1 }}>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:T.green }}>eco+{m.ecoBoost}</span>
                  {m.floodBonus>0 && <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:T.amber }}>res+{m.floodBonus}</span>}
                </div>
              </button>
            );
          })}
        </SideSection>

        <SideSection label={`${activeStyle.name} — Spec Materials`} defaultOpen={false}>
          <div style={{ padding:"10px 14px" }}>
            {activeStyle.materials.map((m,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0",
                borderBottom:`1px solid ${T.border}`, fontSize:10, color:T.textMuted }}>
                <div style={{ width:4, height:4, borderRadius:"50%", background:T.seafoam, flexShrink:0 }}/>
                {m}
              </div>
            ))}
          </div>
        </SideSection>

        <SideSection label="Tampa Bay Context" defaultOpen={true}>
          <div style={{ padding:"10px 14px" }}>
            {[
              { icon:<Waves size={11}/>,    label:"FEMA Flood Zone",  val:"AE / VE",       color:T.coral },
              { icon:<Wind size={11}/>,     label:"Hurricane Risk",   val:"Category 4+",   color:T.amber },
              { icon:<Droplets size={11}/>, label:"Sea Level Rise",   val:"1.8 ft by 2070",color:T.oceanLight },
              { icon:<Sun size={11}/>,      label:"Solar Potential",  val:"5.4 hrs/day",   color:T.sandDark },
              { icon:<Leaf size={11}/>,     label:"Ecosystem",        val:"Mangrove/Seagrass",color:T.green },
              { icon:<Waves size={11}/>,    label:"Storm Surge Risk", val:"High (Zone A)", color:T.coral },
            ].map(row => (
              <div key={row.label} style={{ display:"flex", alignItems:"center", gap:7, padding:"4px 0" }}>
                <span style={{ color:row.color, flexShrink:0 }}>{row.icon}</span>
                <span style={{ fontSize:10, color:T.textFaint, flex:1 }}>{row.label}</span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:row.color }}>{row.val}</span>
              </div>
            ))}
          </div>
        </SideSection>
      </aside>
    </div>
  );
}
