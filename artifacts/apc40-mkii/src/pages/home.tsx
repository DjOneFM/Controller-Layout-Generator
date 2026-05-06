import { useState, useRef, useCallback, useEffect } from "react";
import apcPhoto from "@assets/APC40mkIII_ortho_web_lg_1778105759979.webp";

type ZoneType = "pad" | "knob" | "button" | "button-red" | "button-orange" | "button-green" | "fader" | "slider";

export interface Zone {
  id: string;
  label: string;
  type: ZoneType;
  x: number; // % of image width
  y: number; // % of image height
  w: number;
  h: number;
}

const ZONE_COLORS: Record<ZoneType, { bg: string; border: string }> = {
  pad:             { bg: "rgba(255,200,0,0.22)",   border: "#ffc800" },
  knob:            { bg: "rgba(249,115,22,0.22)",  border: "#f97316" },
  button:          { bg: "rgba(148,163,184,0.22)", border: "#94a3b8" },
  "button-red":    { bg: "rgba(239,68,68,0.22)",   border: "#ef4444" },
  "button-orange": { bg: "rgba(249,115,22,0.22)",  border: "#f97316" },
  "button-green":  { bg: "rgba(34,197,94,0.22)",   border: "#22c55e" },
  fader:           { bg: "rgba(99,102,241,0.22)",  border: "#6366f1" },
  slider:          { bg: "rgba(99,102,241,0.22)",  border: "#6366f1" },
};

const STORAGE_KEY = "apc40-zones-v1";

const COL0 = 5.0;
const COL_STEP = 7.1;
const PAD_W = 6.6;
const PAD_ROW0 = 18.0;
const PAD_ROW_STEP = 7.6;
const PAD_ROW_H = 7.0;
const SCENE_X = 62.5;
const SCENE_W = 3.0;
const CLIP_Y = 55.5;
const SEL_Y = 62.0;
const BTN_H = 4.0;
const ACTV_Y = 67.5; const XFAD_Y = 71.5; const SOLO_Y = 75.5; const RARM_Y = 79.5;
const FADER_W = 3.2;
const DC_X0 = 67.0; const DC_STEP = 7.5; const DC_W = 6.8;

function colX(col: number) { return COL0 + col * COL_STEP; }
function faderX(i: number) { return colX(i) + PAD_W / 2 - FADER_W / 2; }

const DEFAULT_ZONES: Zone[] = [
  ...Array.from({ length: 8 }, (_, i) => ({ id: `ak-${i+1}`,    label: `Assignable Knob ${i+1}`,  type: "knob" as ZoneType,          x: colX(i),        y: 7.5,            w: PAD_W,   h: 9.5  })),
  ...Array.from({ length: 40 }, (_, n) => { const r = Math.floor(n/8), c = n%8; return { id: `pad-r${r+1}-c${c+1}`, label: `Clip Launch T${c+1} S${r+1}`, type: "pad" as ZoneType, x: colX(c), y: PAD_ROW0+r*PAD_ROW_STEP, w: PAD_W, h: PAD_ROW_H }; }),
  ...Array.from({ length: 5 }, (_, i) => ({ id: `scene-${i+1}`, label: `Scene Launch ${i+1}`,      type: "button" as ZoneType,        x: SCENE_X,        y: PAD_ROW0+i*PAD_ROW_STEP, w: SCENE_W, h: PAD_ROW_H })),
  { id: "stop-all",       label: "Stop All Clips",         type: "button-red",    x: SCENE_X, y: CLIP_Y, w: SCENE_W, h: 5.5 },
  ...Array.from({ length: 8 }, (_, i) => ({ id: `clip-stop-${i+1}`, label: `Clip Stop T${i+1}`, type: "button" as ZoneType, x: colX(i), y: CLIP_Y, w: PAD_W, h: 5.5 })),
  ...Array.from({ length: 8 }, (_, i) => ({ id: `track-sel-${i+1}`, label: `Track Selector ${i+1}`, type: "button" as ZoneType, x: colX(i), y: SEL_Y, w: PAD_W, h: 5.0 })),
  { id: "track-sel-master", label: "Master Track Selector", type: "button",       x: SCENE_X, y: SEL_Y, w: SCENE_W, h: 5.0 },
  ...Array.from({ length: 8 }, (_, i) => ({ id: `activator-${i+1}`, label: `Track Activator ${i+1}`, type: "button-green" as ZoneType, x: colX(i), y: ACTV_Y, w: PAD_W, h: BTN_H })),
  ...Array.from({ length: 8 }, (_, i) => ({ id: `crossfade-${i+1}`, label: `Crossfade Assign ${i+1}`, type: "button" as ZoneType,       x: colX(i), y: XFAD_Y, w: PAD_W, h: BTN_H })),
  ...Array.from({ length: 8 }, (_, i) => ({ id: `solo-${i+1}`,      label: `Solo T${i+1}`,            type: "button" as ZoneType,       x: colX(i), y: SOLO_Y, w: PAD_W, h: BTN_H })),
  ...Array.from({ length: 8 }, (_, i) => ({ id: `recarm-${i+1}`,    label: `Record Arm T${i+1}`,      type: "button-red" as ZoneType,   x: colX(i), y: RARM_Y, w: PAD_W, h: BTN_H })),
  ...Array.from({ length: 8 }, (_, i) => ({ id: `fader-${i+1}`,     label: `Volume Fader ${i+1}`,     type: "fader" as ZoneType,         x: faderX(i),    y: CLIP_Y, w: FADER_W, h: 97 - CLIP_Y })),
  { id: "fader-master", label: "Master Volume Fader", type: "fader",   x: 64.2, y: 62.0, w: FADER_W, h: 35.5 },
  { id: "cue-level",    label: "Cue Level Knob",      type: "knob",    x: 62.0, y: 57.0, w: 4.5,     h: 9.0 },
  { id: "crossfader",   label: "Crossfader A/B",      type: "slider",  x: 72.5, y: 87.5, w: 19.5,    h: 7.5 },
  { id: "pan",    label: "PAN Mode",    type: "button-orange", x: 66.5, y: 17.0, w: 5.0, h: 5.5 },
  { id: "play",   label: "Play/Pause",  type: "button",        x: 72.5, y: 17.0, w: 6.0, h: 5.5 },
  { id: "record", label: "Record",      type: "button-red",    x: 79.5, y: 17.0, w: 6.5, h: 5.5 },
  { id: "session",label: "Session Rec", type: "button-red",    x: 86.5, y: 17.0, w: 7.0, h: 5.5 },
  { id: "sends",  label: "SENDS Mode",  type: "button-orange", x: 66.5, y: 23.0, w: 5.0, h: 5.5 },
  { id: "metro",  label: "Metronome",   type: "button",        x: 72.5, y: 23.0, w: 6.0, h: 5.5 },
  { id: "tap",    label: "Tap Tempo",   type: "button",        x: 79.5, y: 23.0, w: 6.5, h: 5.5 },
  { id: "tempo",  label: "Tempo Knob",  type: "knob",          x: 86.0, y: 21.0, w: 9.0, h: 12.0 },
  { id: "user",        label: "USER Mode", type: "button-orange", x: 66.5, y: 29.0, w: 5.0, h: 5.5 },
  { id: "nudge-minus", label: "Nudge −",  type: "button",        x: 72.5, y: 29.0, w: 6.0, h: 5.5 },
  { id: "nudge-plus",  label: "Nudge +",  type: "button",        x: 79.5, y: 29.0, w: 6.5, h: 5.5 },
  ...Array.from({ length: 4 }, (_, i) => ({ id: `dc-knob-${i+1}`, label: `Device Knob ${i+1}`, type: "knob" as ZoneType, x: DC_X0+i*DC_STEP, y: 36.0, w: DC_W, h: 11.5 })),
  ...Array.from({ length: 4 }, (_, i) => ({ id: `dc-knob-${i+5}`, label: `Device Knob ${i+5}`, type: "knob" as ZoneType, x: DC_X0+i*DC_STEP, y: 48.5, w: DC_W, h: 12.0 })),
  { id: "dev-left",      label: "Device ←",       type: "button", x: DC_X0,           y: 61.5, w: 6.5, h: 4.5 },
  { id: "dev-right",     label: "Device →",       type: "button", x: DC_X0+DC_STEP,   y: 61.5, w: 6.5, h: 4.5 },
  { id: "bank-left",     label: "Bank ←",         type: "button", x: DC_X0+2*DC_STEP, y: 61.5, w: 6.5, h: 4.5 },
  { id: "bank-right",    label: "Bank →",         type: "button", x: DC_X0+3*DC_STEP, y: 61.5, w: 6.5, h: 4.5 },
  { id: "dev-on",        label: "Dev On/Off",     type: "button", x: DC_X0,           y: 66.5, w: 6.5, h: 4.5 },
  { id: "dev-lock",      label: "Dev Lock",       type: "button", x: DC_X0+DC_STEP,   y: 66.5, w: 6.5, h: 4.5 },
  { id: "clip-dev-view", label: "Clip/Dev View",  type: "button", x: DC_X0+2*DC_STEP, y: 66.5, w: 6.5, h: 4.5 },
  { id: "detail-view",   label: "Detail View",    type: "button", x: DC_X0+3*DC_STEP, y: 66.5, w: 6.5, h: 4.5 },
  { id: "shift",         label: "Shift",          type: "button", x: 79.5, y: 72.0, w: 6.5, h: 5.0 },
  { id: "bank-btn",      label: "Bank",           type: "button", x: 86.5, y: 72.0, w: 6.5, h: 5.0 },
  { id: "bsel-up",       label: "Bank Select ↑",  type: "button", x: 70.5, y: 73.5, w: 5.0, h: 4.5 },
  { id: "bsel-left",     label: "Bank Select ←",  type: "button", x: 65.5, y: 78.5, w: 4.5, h: 4.5 },
  { id: "bsel-down",     label: "Bank Select ↓",  type: "button", x: 70.5, y: 78.5, w: 5.0, h: 4.5 },
  { id: "bsel-right",    label: "Bank Select →",  type: "button", x: 75.5, y: 78.5, w: 5.0, h: 4.5 },
];

function loadZones(): Zone[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_ZONES;
}

// ── Calibration zone drag/resize ──────────────────────────────────────────────

type Handle = "move" | "n" | "s" | "e" | "w" | "nw" | "ne" | "sw" | "se";

interface DragState {
  zoneId: string;
  handle: Handle;
  startMouseX: number;
  startMouseY: number;
  startZone: Zone;
  imgW: number;
  imgH: number;
}

function ZoneEditor({
  zone,
  onUpdate,
  selected,
  onSelect,
}: {
  zone: Zone;
  onUpdate: (z: Zone) => void;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const dragRef = useRef<DragState | null>(null);
  const colors = ZONE_COLORS[zone.type];

  const startDrag = useCallback((e: React.MouseEvent, handle: Handle) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect(zone.id);
    const img = (e.currentTarget.closest("[data-imgcontainer]") as HTMLElement);
    if (!img) return;
    const rect = img.getBoundingClientRect();
    dragRef.current = {
      zoneId: zone.id,
      handle,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startZone: { ...zone },
      imgW: rect.width,
      imgH: rect.height,
    };
    const onMove = (mv: MouseEvent) => {
      if (!dragRef.current) return;
      const { handle, startMouseX, startMouseY, startZone, imgW, imgH } = dragRef.current;
      const dx = ((mv.clientX - startMouseX) / imgW) * 100;
      const dy = ((mv.clientY - startMouseY) / imgH) * 100;
      let { x, y, w, h } = startZone;
      if (handle === "move")       { x += dx; y += dy; }
      if (handle === "e" || handle === "ne" || handle === "se") { w = Math.max(1, startZone.w + dx); }
      if (handle === "w" || handle === "nw" || handle === "sw") { x += dx; w = Math.max(1, startZone.w - dx); }
      if (handle === "s" || handle === "se" || handle === "sw") { h = Math.max(0.5, startZone.h + dy); }
      if (handle === "n" || handle === "ne" || handle === "nw") { y += dy; h = Math.max(0.5, startZone.h - dy); }
      onUpdate({ ...zone, x: Math.max(0, x), y: Math.max(0, y), w, h });
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [zone, onUpdate, onSelect]);

  const HS = 9; // handle size px
  const hStyle = (cursor: string, top?: string | number, left?: string | number, bottom?: string | number, right?: string | number, transform?: string): React.CSSProperties => ({
    position: "absolute", width: HS, height: HS, background: "#fff",
    border: "1.5px solid #000", borderRadius: 2, cursor,
    ...(top !== undefined ? { top } : {}), ...(left !== undefined ? { left } : {}),
    ...(bottom !== undefined ? { bottom } : {}), ...(right !== undefined ? { right } : {}),
    transform: transform ?? "translate(-50%,-50%)",
    zIndex: 20,
  });

  return (
    <div
      onMouseDown={(e) => startDrag(e, "move")}
      style={{
        position: "absolute",
        left: `${zone.x}%`, top: `${zone.y}%`,
        width: `${zone.w}%`, height: `${zone.h}%`,
        background: selected ? colors.bg.replace("0.22", "0.45") : colors.bg,
        border: `2px solid ${colors.border}`,
        borderRadius: 3,
        cursor: "move",
        boxSizing: "border-box",
        userSelect: "none",
        zIndex: selected ? 15 : 10,
        outline: selected ? `2px solid white` : "none",
        outlineOffset: 1,
      }}
    >
      <span style={{
        position: "absolute", top: 1, left: 2, right: 2,
        fontSize: 7, fontFamily: "monospace", color: "#fff",
        textShadow: "0 0 3px #000", whiteSpace: "nowrap", overflow: "hidden",
        textOverflow: "ellipsis", pointerEvents: "none", lineHeight: 1.2,
      }}>
        {zone.label}
      </span>
      {selected && <>
        <div style={hStyle("nw-resize", -HS/2, -HS/2, undefined, undefined, "none")}         onMouseDown={(e) => startDrag(e, "nw")} />
        <div style={hStyle("n-resize",  -HS/2, undefined, undefined, undefined, "translateX(-50%)")} onMouseDown={(e) => startDrag(e, "n")} />
        <div style={hStyle("ne-resize", -HS/2, undefined, undefined, -HS/2, "none")}         onMouseDown={(e) => startDrag(e, "ne")} />
        <div style={hStyle("e-resize",  "50%", undefined, undefined, -HS/2, "translateY(-50%)")} onMouseDown={(e) => startDrag(e, "e")} />
        <div style={hStyle("se-resize", undefined, undefined, -HS/2, -HS/2, "none")}         onMouseDown={(e) => startDrag(e, "se")} />
        <div style={hStyle("s-resize",  undefined, "50%", -HS/2, undefined, "translateX(-50%)")} onMouseDown={(e) => startDrag(e, "s")} />
        <div style={hStyle("sw-resize", undefined, -HS/2, -HS/2, undefined, "none")}         onMouseDown={(e) => startDrag(e, "sw")} />
        <div style={hStyle("w-resize",  "50%", -HS/2, undefined, undefined, "translateY(-50%)")} onMouseDown={(e) => startDrag(e, "w")} />
      </>}
    </div>
  );
}

function Tooltip({ label, x, y }: { label: string; x: number; y: number }) {
  return (
    <div style={{
      position: "absolute",
      ...(x > 55 ? { right: "105%" } : { left: "105%" }),
      ...(y > 70 ? { bottom: 0 } : { top: 0 }),
      background: "rgba(12,12,16,0.97)", border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: 5, padding: "5px 9px", whiteSpace: "nowrap",
      fontSize: 11, fontFamily: "monospace", color: "#e2e8f0",
      pointerEvents: "none", zIndex: 100, boxShadow: "0 4px 14px rgba(0,0,0,0.7)",
    }}>
      {label}
    </div>
  );
}

export default function Home() {
  const [zones, setZones] = useState<Zone[]>(loadZones);
  const [calibrating, setCalibrating] = useState(false);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [copied, setCopied] = useState(false);

  const updateZone = useCallback((updated: Zone) => {
    setZones((prev) => prev.map((z) => (z.id === updated.id ? updated : z)));
  }, []);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(zones));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const reset = () => {
    setZones(DEFAULT_ZONES);
    localStorage.removeItem(STORAGE_KEY);
  };

  const jsonText = JSON.stringify(zones, null, 2);

  const exportJson = () => setShowExport(true);

  const copyJson = () => {
    navigator.clipboard.writeText(jsonText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const exitCalibrate = () => {
    save();
    setCalibrating(false);
    setSelectedId(null);
  };

  // Persist whenever zones change in calibration mode
  useEffect(() => {
    if (calibrating) localStorage.setItem(STORAGE_KEY, JSON.stringify(zones));
  }, [zones, calibrating]);

  return (
    <div style={{
      minHeight: "100vh", width: "100%", background: "#0d0d0f",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 16, boxSizing: "border-box", gap: 10,
    }}>
      {/* Toolbar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
        background: "#1a1a20", border: "1px solid #2a2a32", borderRadius: 8, padding: "6px 12px",
      }}>
        {!calibrating ? (
          <>
            <span style={{ fontSize: 12, fontFamily: "monospace", color: "#8a8a96" }}>
              APC40 mkII — hover any control to identify it
            </span>
            <button
              onClick={() => setCalibrating(true)}
              style={{ padding: "4px 12px", borderRadius: 5, border: "1px solid #f97316", background: "transparent", color: "#f97316", fontFamily: "monospace", fontSize: 11, cursor: "pointer" }}
            >
              Calibrate Zones
            </button>
            <button
              onClick={exportJson}
              style={{ padding: "4px 12px", borderRadius: 5, border: "1px solid #38bdf8", background: "transparent", color: "#38bdf8", fontFamily: "monospace", fontSize: 11, cursor: "pointer" }}
            >
              Export JSON
            </button>
          </>
        ) : (
          <>
            <span style={{ fontSize: 12, fontFamily: "monospace", color: "#fcd34d" }}>
              Calibration Mode — drag zones, resize with corner handles
            </span>
            <button onClick={save}  style={{ padding: "4px 12px", borderRadius: 5, border: "1px solid #22c55e", background: saved ? "#22c55e" : "transparent", color: saved ? "#000" : "#22c55e", fontFamily: "monospace", fontSize: 11, cursor: "pointer" }}>
              {saved ? "Saved ✓" : "Save"}
            </button>
            <button onClick={reset} style={{ padding: "4px 12px", borderRadius: 5, border: "1px solid #ef4444", background: "transparent", color: "#ef4444", fontFamily: "monospace", fontSize: 11, cursor: "pointer" }}>
              Reset
            </button>
            <button onClick={exitCalibrate} style={{ padding: "4px 12px", borderRadius: 5, border: "1px solid #94a3b8", background: "transparent", color: "#94a3b8", fontFamily: "monospace", fontSize: 11, cursor: "pointer" }}>
              Done
            </button>
          </>
        )}
      </div>

      {/* Image + zones */}
      <div data-imgcontainer="" style={{ position: "relative", display: "inline-block", lineHeight: 0, flexShrink: 0 }}>
        <img
          src={apcPhoto}
          alt="APC40 MKII"
          style={{ display: "block", maxWidth: "min(98vw, 1200px)", maxHeight: "calc(100vh - 80px)", objectFit: "contain", userSelect: "none" }}
          draggable={false}
          onClick={() => calibrating && setSelectedId(null)}
        />

        {calibrating ? (
          zones.map((zone) => (
            <ZoneEditor
              key={zone.id}
              zone={zone}
              onUpdate={updateZone}
              selected={selectedId === zone.id}
              onSelect={setSelectedId}
            />
          ))
        ) : (
          zones.map((zone) => {
            const colors = ZONE_COLORS[zone.type];
            const isActive = activeZone === zone.id;
            return (
              <div
                key={zone.id}
                onMouseEnter={() => setActiveZone(zone.id)}
                onMouseLeave={() => setActiveZone(null)}
                style={{
                  position: "absolute",
                  left: `${zone.x}%`, top: `${zone.y}%`,
                  width: `${zone.w}%`, height: `${zone.h}%`,
                  background: isActive ? colors.bg.replace("0.22", "0.5") : "transparent",
                  border: `1.5px solid ${isActive ? colors.border : "transparent"}`,
                  borderRadius: 3, cursor: "crosshair",
                  boxSizing: "border-box", transition: "background 0.08s, border-color 0.08s",
                }}
              >
                {isActive && <Tooltip label={zone.label} x={zone.x} y={zone.y} />}
              </div>
            );
          })
        )}
      </div>

      {calibrating && selectedId && (
        <div style={{ fontSize: 11, fontFamily: "monospace", color: "#94a3b8", flexShrink: 0 }}>
          Selected: <strong style={{ color: "#e2e8f0" }}>{zones.find(z => z.id === selectedId)?.label}</strong>
          {" — "}drag to move · corner handles to resize
        </div>
      )}

      {/* Export modal */}
      {showExport && (
        <div
          onClick={() => setShowExport(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 200, padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#16161e", border: "1px solid #2a2a38", borderRadius: 10,
              width: "min(660px, 100%)", maxHeight: "80vh",
              display: "flex", flexDirection: "column", gap: 0,
              boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            }}
          >
            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #2a2a38" }}>
              <span style={{ fontFamily: "monospace", fontSize: 13, color: "#e2e8f0" }}>
                apc40-mkii-zones.json
                <span style={{ marginLeft: 10, color: "#64748b", fontSize: 11 }}>
                  {zones.length} zones
                </span>
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={copyJson}
                  style={{
                    padding: "4px 14px", borderRadius: 5, cursor: "pointer", fontFamily: "monospace", fontSize: 11,
                    border: `1px solid ${copied ? "#22c55e" : "#38bdf8"}`,
                    background: copied ? "#22c55e" : "transparent",
                    color: copied ? "#000" : "#38bdf8",
                    transition: "all 0.15s",
                  }}
                >
                  {copied ? "Copied ✓" : "Copy to clipboard"}
                </button>
                <button
                  onClick={() => setShowExport(false)}
                  style={{ padding: "4px 10px", borderRadius: 5, cursor: "pointer", fontFamily: "monospace", fontSize: 11, border: "1px solid #3a3a48", background: "transparent", color: "#94a3b8" }}
                >
                  ✕
                </button>
              </div>
            </div>
            {/* JSON content */}
            <pre style={{
              margin: 0, padding: 16, overflowY: "auto", flex: 1,
              fontFamily: "monospace", fontSize: 11, color: "#94a3b8",
              lineHeight: 1.6, whiteSpace: "pre", background: "transparent",
            }}>
              {jsonText}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
