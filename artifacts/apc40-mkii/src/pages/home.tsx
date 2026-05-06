import { useState } from "react";
import apcPhoto from "@assets/APC40mkIII_ortho_web_lg_1778105759979.webp";

type ZoneType = "pad" | "knob" | "button" | "button-red" | "button-orange" | "button-green" | "fader" | "slider";

interface Zone {
  id: string;
  label: string;
  type: ZoneType;
  /** % of image width */
  x: number;
  /** % of image height */
  y: number;
  w: number;
  h: number;
}

const ZONE_COLORS: Record<ZoneType, { bg: string; border: string }> = {
  pad: { bg: "rgba(255,200,0,0.15)", border: "rgba(255,200,0,0.7)" },
  knob: { bg: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.7)" },
  button: { bg: "rgba(148,163,184,0.15)", border: "rgba(148,163,184,0.7)" },
  "button-red": { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.7)" },
  "button-orange": { bg: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.7)" },
  "button-green": { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.7)" },
  fader: { bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.7)" },
  slider: { bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.7)" },
};

// ── Zone map ─────────────────────────────────────────────────────────────────
// All positions are % of image width/height.
// Image dimensions (natural): 1016 × 621 px  →  aspect 1.637
// Controller body: approx x 1.5–98.5%, y 1.5–97%
// ─────────────────────────────────────────────────────────────────────────────

const buildZones = (): Zone[] => {
  const z: Zone[] = [];

  // Assignable Knobs – 8 large knobs across the top
  // Row spans x: 1.5%–62%, y: 1.5%–17%
  for (let i = 0; i < 8; i++) {
    z.push({
      id: `ak-${i + 1}`,
      label: `Assignable Knob ${i + 1}`,
      type: "knob",
      x: 1.8 + i * 7.78,
      y: 1.5,
      w: 7.0,
      h: 15.5,
    });
  }

  // Clip Launch Pads – 8 columns × 5 rows
  // Grid spans x: 6%–62.5%, y: 17%–57%
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 8; col++) {
      z.push({
        id: `pad-r${row + 1}-c${col + 1}`,
        label: `Clip Launch  — Track ${col + 1}, Scene ${row + 1}`,
        type: "pad",
        x: 6.1 + col * 7.08,
        y: 17.5 + row * 7.9,
        w: 6.5,
        h: 7.2,
      });
    }
  }

  // Scene Launch – 5 buttons to the right of each row
  for (let i = 0; i < 5; i++) {
    z.push({
      id: `scene-${i + 1}`,
      label: `Scene Launch ${i + 1}`,
      type: "button",
      x: 63.1,
      y: 17.5 + i * 7.9,
      w: 3.5,
      h: 7.2,
    });
  }

  // Stop All Clips
  z.push({ id: "stop-all", label: "Stop All Clips", type: "button-red", x: 63.1, y: 57, w: 3.5, h: 5.5 });

  // Clip Stop – 8 buttons below pad grid
  for (let i = 0; i < 8; i++) {
    z.push({
      id: `clip-stop-${i + 1}`,
      label: `Clip Stop — Track ${i + 1}`,
      type: "button",
      x: 6.1 + i * 7.08,
      y: 57.5,
      w: 6.5,
      h: 5.0,
    });
  }

  // Track Selectors – row of numbered buttons (1–8 + Master)
  for (let i = 0; i < 8; i++) {
    z.push({
      id: `track-sel-${i + 1}`,
      label: `Track Selector ${i + 1}  (Shift+press = Quantize: ${["None","8 Bars","4 Bars","2 Bars","1 Bar","1/4","1/8","1/16"][i]})`,
      type: "button",
      x: 6.1 + i * 7.08,
      y: 63.2,
      w: 6.5,
      h: 4.5,
    });
  }
  z.push({ id: "track-sel-master", label: "Master Track Selector", type: "button", x: 63.1, y: 63.2, w: 3.5, h: 4.5 });

  // Track Activators (numbered, top sub-row)
  for (let i = 0; i < 8; i++) {
    z.push({
      id: `activator-${i + 1}`,
      label: `Track Activator ${i + 1}  (Mute/Unmute)`,
      type: "button-green",
      x: 6.1 + i * 7.08,
      y: 67.8,
      w: 6.5,
      h: 3.8,
    });
  }

  // Crossfade Assign (A|B)
  for (let i = 0; i < 8; i++) {
    z.push({
      id: `crossfade-${i + 1}`,
      label: `Crossfade Assign ${i + 1}  (A | B | Off)`,
      type: "button",
      x: 6.1 + i * 7.08,
      y: 71.8,
      w: 6.5,
      h: 3.8,
    });
  }

  // Solo
  for (let i = 0; i < 8; i++) {
    z.push({
      id: `solo-${i + 1}`,
      label: `Solo — Track ${i + 1}`,
      type: "button",
      x: 6.1 + i * 7.08,
      y: 75.8,
      w: 6.5,
      h: 3.8,
    });
  }

  // Record-Arm (round buttons)
  for (let i = 0; i < 8; i++) {
    z.push({
      id: `recarm-${i + 1}`,
      label: `Record Arm — Track ${i + 1}`,
      type: "button-red",
      x: 6.1 + i * 7.08,
      y: 79.8,
      w: 6.5,
      h: 4.2,
    });
  }

  // Track Volume Faders – 8 faders + Master
  for (let i = 0; i < 8; i++) {
    z.push({
      id: `fader-${i + 1}`,
      label: `Track Volume Fader ${i + 1}`,
      type: "fader",
      x: 5.2 + i * 7.08,
      y: 82.5,
      w: 7.5,
      h: 15.5,
    });
  }
  z.push({ id: "fader-master", label: "Master Volume Fader", type: "fader", x: 62.5, y: 67, w: 4.5, h: 31 });

  // Cue Level knob
  z.push({ id: "cue-level", label: "Cue Level Knob", type: "knob", x: 62.5, y: 62, w: 4.5, h: 9 });

  // Crossfader A/B
  z.push({ id: "crossfader", label: "Crossfader (A / B)", type: "slider", x: 71.5, y: 88.5, w: 20, h: 7.5 });

  // ── RIGHT PANEL ────────────────────────────────────────────────────────────
  // PAN / PLAY / RECORD / SESSION
  z.push({ id: "pan", label: "PAN Mode (Assignable Knobs → Panning)", type: "button-orange", x: 68.0, y: 14.5, w: 4.5, h: 5.5 });
  z.push({ id: "play", label: "Play / Pause", type: "button", x: 73.5, y: 14.5, w: 5.5, h: 5.5 });
  z.push({ id: "record", label: "Record", type: "button-red", x: 80.0, y: 14.5, w: 5.5, h: 5.5 });
  z.push({ id: "session", label: "Session Record", type: "button-red", x: 86.5, y: 14.5, w: 5.5, h: 5.5 });

  // SENDS / METRO / TAP / TEMPO
  z.push({ id: "sends", label: "SENDS Mode (Assignable Knobs → Send Levels)", type: "button-orange", x: 68.0, y: 21.0, w: 4.5, h: 5.5 });
  z.push({ id: "metro", label: "Metronome", type: "button", x: 73.5, y: 21.0, w: 5.5, h: 5.5 });
  z.push({ id: "tap", label: "Tap Tempo", type: "button", x: 80.0, y: 21.0, w: 5.5, h: 5.5 });
  z.push({ id: "tempo-knob", label: "Tempo Knob", type: "knob", x: 87.5, y: 19.5, w: 7.5, h: 11 });

  // USER / NUDGE- / NUDGE+
  z.push({ id: "user", label: "USER Mode (Assignable Knobs → MIDI-mappable)", type: "button-orange", x: 68.0, y: 27.5, w: 4.5, h: 5.5 });
  z.push({ id: "nudge-minus", label: "Nudge −", type: "button", x: 73.5, y: 27.5, w: 5.5, h: 5.5 });
  z.push({ id: "nudge-plus", label: "Nudge +", type: "button", x: 80.0, y: 27.5, w: 5.5, h: 5.5 });

  // Device Control Knobs – row 1 (1–4)
  for (let i = 0; i < 4; i++) {
    z.push({
      id: `dc-knob-${i + 1}`,
      label: `Device Control Knob ${i + 1}`,
      type: "knob",
      x: 68.5 + i * 7.3,
      y: 34.0,
      w: 6.5,
      h: 12.5,
    });
  }
  // Device Control Knobs – row 2 (5–8)
  for (let i = 0; i < 4; i++) {
    z.push({
      id: `dc-knob-${i + 5}`,
      label: `Device Control Knob ${i + 5}`,
      type: "knob",
      x: 68.5 + i * 7.3,
      y: 47.5,
      w: 6.5,
      h: 12.5,
    });
  }

  // Device ← / → and Bank ← / →
  z.push({ id: "dev-left", label: "Device Select ←", type: "button", x: 68.0, y: 61.0, w: 6.0, h: 4.5 });
  z.push({ id: "dev-right", label: "Device Select →", type: "button", x: 75.0, y: 61.0, w: 6.0, h: 4.5 });
  z.push({ id: "bank-left", label: "Bank Select ←", type: "button", x: 81.5, y: 61.0, w: 5.5, h: 4.5 });
  z.push({ id: "bank-right", label: "Bank Select →", type: "button", x: 87.5, y: 61.0, w: 5.5, h: 4.5 });

  // DEV ON/OFF  DEV LOCK  CLIP/DEV  DETAIL
  z.push({ id: "dev-on", label: "Device On/Off", type: "button", x: 68.0, y: 66.5, w: 6.0, h: 4.5 });
  z.push({ id: "dev-lock", label: "Device Lock", type: "button", x: 75.0, y: 66.5, w: 6.0, h: 4.5 });
  z.push({ id: "clip-dev-view", label: "Clip / Device View", type: "button", x: 81.5, y: 66.5, w: 5.5, h: 4.5 });
  z.push({ id: "detail-view", label: "Detail View", type: "button", x: 87.5, y: 66.5, w: 5.5, h: 4.5 });

  // SHIFT  BANK
  z.push({ id: "shift", label: "Shift (hold for secondary functions)", type: "button", x: 79.5, y: 73.0, w: 5.5, h: 4.5 });
  z.push({ id: "bank-btn", label: "Bank (hold + Bank Select = shift by 8 tracks / 5 scenes)", type: "button", x: 85.5, y: 73.0, w: 5.5, h: 4.5 });

  // Bank Select cursor buttons (↑ ↓ ← →)
  z.push({ id: "bsel-up", label: "Bank Select ↑", type: "button", x: 70.5, y: 73.5, w: 4.5, h: 4.5 });
  z.push({ id: "bsel-left", label: "Bank Select ←", type: "button", x: 66.0, y: 78.0, w: 4.5, h: 4.5 });
  z.push({ id: "bsel-down", label: "Bank Select ↓", type: "button", x: 70.5, y: 78.0, w: 4.5, h: 4.5 });
  z.push({ id: "bsel-right", label: "Bank Select →", type: "button", x: 75.0, y: 78.0, w: 4.5, h: 4.5 });

  return z;
};

const ZONES = buildZones();

function Tooltip({ label, x, y }: { label: string; x: number; y: number }) {
  const isRight = x > 55;
  const isBottom = y > 70;
  return (
    <div
      style={{
        position: "absolute",
        ...(isRight ? { right: "105%" } : { left: "105%" }),
        ...(isBottom ? { bottom: 0 } : { top: 0 }),
        background: "rgba(15,15,18,0.96)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 5,
        padding: "5px 8px",
        whiteSpace: "nowrap",
        fontSize: 11,
        fontFamily: "monospace",
        color: "#e2e8f0",
        pointerEvents: "none",
        zIndex: 100,
        boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
        maxWidth: 260,
        whiteSpace: "pre-wrap" as const,
        lineHeight: 1.4,
      }}
    >
      {label}
    </div>
  );
}

export default function Home() {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#0d0d0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      <div style={{ position: "relative", display: "inline-block", lineHeight: 0 }}>
        <img
          src={apcPhoto}
          alt="APC40 MKII"
          style={{ display: "block", maxWidth: "min(98vw, 1200px)", maxHeight: "calc(100vh - 32px)", objectFit: "contain", userSelect: "none" }}
          draggable={false}
        />

        {ZONES.map((zone) => {
          const colors = ZONE_COLORS[zone.type];
          const isActive = activeZone === zone.id;
          return (
            <div
              key={zone.id}
              onMouseEnter={() => setActiveZone(zone.id)}
              onMouseLeave={() => setActiveZone(null)}
              style={{
                position: "absolute",
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.w}%`,
                height: `${zone.h}%`,
                background: isActive ? colors.bg.replace("0.15", "0.35") : "transparent",
                border: `1px solid ${isActive ? colors.border : "transparent"}`,
                borderRadius: 3,
                cursor: "crosshair",
                boxSizing: "border-box",
                transition: "background 0.08s, border-color 0.08s",
              }}
            >
              {isActive && <Tooltip label={zone.label} x={zone.x} y={zone.y} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
