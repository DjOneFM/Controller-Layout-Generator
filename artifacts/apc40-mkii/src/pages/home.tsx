import { useState } from "react";
import apcPhoto from "@assets/APC40mkIII_ortho_web_lg_1778105759979.webp";

type ZoneType = "pad" | "knob" | "button" | "button-red" | "button-orange" | "button-green" | "fader" | "slider";

interface Zone {
  id: string;
  label: string;
  type: ZoneType;
  x: number; // % of image width
  y: number; // % of image height
  w: number;
  h: number;
}

const ZONE_COLORS: Record<ZoneType, { bg: string; border: string }> = {
  pad:             { bg: "rgba(255,200,0,0.18)",   border: "rgba(255,200,0,0.9)" },
  knob:            { bg: "rgba(249,115,22,0.18)",  border: "rgba(249,115,22,0.9)" },
  button:          { bg: "rgba(148,163,184,0.18)", border: "rgba(148,163,184,0.9)" },
  "button-red":    { bg: "rgba(239,68,68,0.18)",   border: "rgba(239,68,68,0.9)" },
  "button-orange": { bg: "rgba(249,115,22,0.18)",  border: "rgba(249,115,22,0.9)" },
  "button-green":  { bg: "rgba(34,197,94,0.18)",   border: "rgba(34,197,94,0.9)" },
  fader:           { bg: "rgba(99,102,241,0.18)",  border: "rgba(99,102,241,0.9)" },
  slider:          { bg: "rgba(99,102,241,0.18)",  border: "rgba(99,102,241,0.9)" },
};

// ── Zone map (all values are % of rendered image width/height) ───────────────
// Calibrated from a 5%-grid overlay screenshot of the device photo.
//
// Left-section column grid (8 tracks):
//   col x = COL0 + col * COL_STEP   (pad/track/fader columns share same x grid)
//   COL0 = 5.0, COL_STEP = 7.1, PAD_W = 6.6
// ─────────────────────────────────────────────────────────────────────────────
const COL0 = 5.0;
const COL_STEP = 7.1;
const PAD_W = 6.6;

function colX(col: number) { return COL0 + col * COL_STEP; }

const buildZones = (): Zone[] => {
  const z: Zone[] = [];

  // ── Assignable Knobs (8, top row above pads) ──────────────────────────────
  // Grid reading: y≈8–17%, x same grid as columns
  for (let i = 0; i < 8; i++) {
    z.push({
      id: `ak-${i + 1}`,
      label: `Assignable Knob ${i + 1}`,
      type: "knob",
      x: colX(i),
      y: 7.5,
      w: PAD_W,
      h: 9.5,
    });
  }

  // ── Clip Launch Pads (8×5) ───────────────────────────────────────────────
  // Grid reading: row 1 y≈18%, row pitch ≈7.6%, h≈7.0%
  const PAD_ROW0 = 18.0;
  const PAD_ROW_H = 7.0;
  const PAD_ROW_STEP = 7.6;

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 8; col++) {
      z.push({
        id: `pad-r${row + 1}-c${col + 1}`,
        label: `Clip Launch — Track ${col + 1}, Scene ${row + 1}`,
        type: "pad",
        x: colX(col),
        y: PAD_ROW0 + row * PAD_ROW_STEP,
        w: PAD_W,
        h: PAD_ROW_H,
      });
    }
  }

  // ── Scene Launch (5 buttons right of pads) ───────────────────────────────
  const SCENE_X = 62.5;
  const SCENE_W = 3.0;
  for (let i = 0; i < 5; i++) {
    z.push({
      id: `scene-${i + 1}`,
      label: `Scene Launch ${i + 1}`,
      type: "button",
      x: SCENE_X,
      y: PAD_ROW0 + i * PAD_ROW_STEP,
      w: SCENE_W,
      h: PAD_ROW_H,
    });
  }

  // ── Stop All Clips ────────────────────────────────────────────────────────
  const CLIP_STOP_Y = 55.5;
  z.push({ id: "stop-all", label: "Stop All Clips", type: "button-red", x: SCENE_X, y: CLIP_STOP_Y, w: SCENE_W, h: 5.5 });

  // ── Clip Stop (8 buttons) ─────────────────────────────────────────────────
  for (let i = 0; i < 8; i++) {
    z.push({ id: `clip-stop-${i + 1}`, label: `Clip Stop — Track ${i + 1}`, type: "button", x: colX(i), y: CLIP_STOP_Y, w: PAD_W, h: 5.5 });
  }

  // ── Track Selectors (1–8 + Master) ───────────────────────────────────────
  const SEL_Y = 62.0;
  for (let i = 0; i < 8; i++) {
    z.push({
      id: `track-sel-${i + 1}`,
      label: `Track Selector ${i + 1}  (Shift+press → Quantize: ${["None","8 Bars","4 Bars","2 Bars","1 Bar","1/4","1/8","1/16"][i]})`,
      type: "button",
      x: colX(i), y: SEL_Y, w: PAD_W, h: 5.0,
    });
  }
  z.push({ id: "track-sel-master", label: "Master Track Selector", type: "button", x: SCENE_X, y: SEL_Y, w: SCENE_W, h: 5.0 });

  // ── Track Buttons (4 sub-rows per track) ─────────────────────────────────
  const BTN_H = 4.0;
  const ACTV_Y = 67.5;  // Activator (mute/unmute)
  const XFAD_Y = 71.5;  // Crossfade Assign A|B
  const SOLO_Y = 75.5;  // Solo
  const RARM_Y = 79.5;  // Record-Arm

  for (let i = 0; i < 8; i++) {
    z.push({ id: `activator-${i + 1}`, label: `Track Activator ${i + 1} (Mute/Unmute)`, type: "button-green", x: colX(i), y: ACTV_Y, w: PAD_W, h: BTN_H });
    z.push({ id: `crossfade-${i + 1}`, label: `Crossfade Assign ${i + 1} (A | B | Off)`, type: "button",       x: colX(i), y: XFAD_Y, w: PAD_W, h: BTN_H });
    z.push({ id: `solo-${i + 1}`,      label: `Solo — Track ${i + 1}`,                   type: "button",       x: colX(i), y: SOLO_Y, w: PAD_W, h: BTN_H });
    z.push({ id: `recarm-${i + 1}`,    label: `Record Arm — Track ${i + 1}`,              type: "button-red",   x: colX(i), y: RARM_Y, w: PAD_W, h: BTN_H });
  }

  // ── Track Volume Faders — slim single rectangle per fader ────────────────
  // Fader track center x aligns with column center; track slot spans y=55.5–97%
  const FADER_Y = CLIP_STOP_Y;
  const FADER_H = 97 - FADER_Y;
  const FADER_W = 3.2;

  for (let i = 0; i < 8; i++) {
    const centerX = colX(i) + PAD_W / 2;
    z.push({
      id: `fader-${i + 1}`,
      label: `Track Volume Fader ${i + 1}`,
      type: "fader",
      x: centerX - FADER_W / 2,
      y: FADER_Y,
      w: FADER_W,
      h: FADER_H,
    });
  }

  // ── Master Fader (slim) ───────────────────────────────────────────────────
  z.push({ id: "fader-master", label: "Master Volume Fader", type: "fader", x: 64.2, y: 62.0, w: FADER_W, h: 35.5 });

  // ── Cue Level Knob ────────────────────────────────────────────────────────
  z.push({ id: "cue-level", label: "Cue Level Knob", type: "knob", x: 62.0, y: 57.0, w: 4.5, h: 9.0 });

  // ── Crossfader A/B ────────────────────────────────────────────────────────
  z.push({ id: "crossfader", label: "Crossfader (A / B)", type: "slider", x: 72.5, y: 87.5, w: 19.5, h: 7.5 });

  // ── RIGHT PANEL ───────────────────────────────────────────────────────────

  // Row 1 — PAN / PLAY / RECORD / SESSION  (y ≈ 17–23%)
  z.push({ id: "pan",     label: "PAN Mode — Assignable Knobs control track panning",        type: "button-orange", x: 66.5, y: 17.0, w: 5.0, h: 5.5 });
  z.push({ id: "play",    label: "Play / Pause",                                              type: "button",        x: 72.5, y: 17.0, w: 6.0, h: 5.5 });
  z.push({ id: "record",  label: "Record",                                                    type: "button-red",    x: 79.5, y: 17.0, w: 6.5, h: 5.5 });
  z.push({ id: "session", label: "Session Record",                                            type: "button-red",    x: 86.5, y: 17.0, w: 7.0, h: 5.5 });

  // Row 2 — SENDS / METRO / TAP / TEMPO  (y ≈ 23–29%)
  z.push({ id: "sends", label: "SENDS Mode — Assignable Knobs control send levels", type: "button-orange", x: 66.5, y: 23.0, w: 5.0, h: 5.5 });
  z.push({ id: "metro", label: "Metronome",                                         type: "button",        x: 72.5, y: 23.0, w: 6.0, h: 5.5 });
  z.push({ id: "tap",   label: "Tap Tempo",                                         type: "button",        x: 79.5, y: 23.0, w: 6.5, h: 5.5 });
  z.push({ id: "tempo", label: "Tempo Knob",                                        type: "knob",          x: 86.0, y: 21.0, w: 9.0, h: 12.0 });

  // Row 3 — USER / NUDGE- / NUDGE+  (y ≈ 29–35%)
  z.push({ id: "user",        label: "USER Mode — Assignable Knobs are MIDI-mappable", type: "button-orange", x: 66.5, y: 29.0, w: 5.0, h: 5.5 });
  z.push({ id: "nudge-minus", label: "Nudge −",                                        type: "button",        x: 72.5, y: 29.0, w: 6.0, h: 5.5 });
  z.push({ id: "nudge-plus",  label: "Nudge +",                                        type: "button",        x: 79.5, y: 29.0, w: 6.5, h: 5.5 });

  // Device Control Knobs — 2 rows of 4  (x grid: 67, 74, 81, 88)
  const DC_X0 = 67.0;
  const DC_STEP = 7.5;
  const DC_W = 6.8;
  for (let i = 0; i < 4; i++) {
    z.push({ id: `dc-knob-${i + 1}`, label: `Device Control Knob ${i + 1}`, type: "knob", x: DC_X0 + i * DC_STEP, y: 36.0, w: DC_W, h: 11.5 });
    z.push({ id: `dc-knob-${i + 5}`, label: `Device Control Knob ${i + 5}`, type: "knob", x: DC_X0 + i * DC_STEP, y: 48.5, w: DC_W, h: 12.0 });
  }

  // DEV ←/→  BANK ←/→  (y ≈ 61–66%)
  z.push({ id: "dev-left",   label: "Device Select ←", type: "button", x: DC_X0,             y: 61.5, w: 6.5, h: 4.5 });
  z.push({ id: "dev-right",  label: "Device Select →", type: "button", x: DC_X0 + DC_STEP,   y: 61.5, w: 6.5, h: 4.5 });
  z.push({ id: "bank-left",  label: "Bank ←",          type: "button", x: DC_X0 + 2*DC_STEP, y: 61.5, w: 6.5, h: 4.5 });
  z.push({ id: "bank-right", label: "Bank →",          type: "button", x: DC_X0 + 3*DC_STEP, y: 61.5, w: 6.5, h: 4.5 });

  // DEV ON/OFF  DEV LOCK  CLIP/DEV VIEW  DETAIL VIEW  (y ≈ 66–71%)
  z.push({ id: "dev-on",        label: "Device On/Off",     type: "button", x: DC_X0,             y: 66.5, w: 6.5, h: 4.5 });
  z.push({ id: "dev-lock",      label: "Device Lock",       type: "button", x: DC_X0 + DC_STEP,   y: 66.5, w: 6.5, h: 4.5 });
  z.push({ id: "clip-dev-view", label: "Clip/Device View",  type: "button", x: DC_X0 + 2*DC_STEP, y: 66.5, w: 6.5, h: 4.5 });
  z.push({ id: "detail-view",   label: "Detail View",       type: "button", x: DC_X0 + 3*DC_STEP, y: 66.5, w: 6.5, h: 4.5 });

  // SHIFT  BANK  (y ≈ 72–77%)
  z.push({ id: "shift",    label: "Shift — hold for secondary functions",                          type: "button", x: 79.5, y: 72.0, w: 6.5, h: 5.0 });
  z.push({ id: "bank-btn", label: "Bank — hold + Bank Select to shift matrix by 8 tracks/5 scenes", type: "button", x: 86.5, y: 72.0, w: 6.5, h: 5.0 });

  // Bank Select cursor (↑ ↓ ← →)  (y ≈ 73–83%)
  z.push({ id: "bsel-up",    label: "Bank Select ↑", type: "button", x: 70.5, y: 73.5, w: 5.0, h: 4.5 });
  z.push({ id: "bsel-left",  label: "Bank Select ←", type: "button", x: 65.5, y: 78.5, w: 4.5, h: 4.5 });
  z.push({ id: "bsel-down",  label: "Bank Select ↓", type: "button", x: 70.5, y: 78.5, w: 5.0, h: 4.5 });
  z.push({ id: "bsel-right", label: "Bank Select →", type: "button", x: 75.5, y: 78.5, w: 5.0, h: 4.5 });

  return z;
};

const ZONES = buildZones();

function Tooltip({ label, x, y }: { label: string; x: number; y: number }) {
  const isRight = x > 55;
  const isBottom = y > 70;
  return (
    <div style={{
      position: "absolute",
      ...(isRight ? { right: "105%" } : { left: "105%" }),
      ...(isBottom ? { bottom: 0 } : { top: 0 }),
      background: "rgba(12,12,16,0.97)",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: 5,
      padding: "5px 9px",
      whiteSpace: "pre-wrap" as const,
      fontSize: 11,
      fontFamily: "monospace",
      color: "#e2e8f0",
      pointerEvents: "none",
      zIndex: 100,
      boxShadow: "0 4px 14px rgba(0,0,0,0.7)",
      maxWidth: 280,
      lineHeight: 1.5,
    }}>
      {label}
    </div>
  );
}

export default function Home() {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      background: "#0d0d0f",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16, boxSizing: "border-box",
    }}>
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
                left: `${zone.x}%`, top: `${zone.y}%`,
                width: `${zone.w}%`, height: `${zone.h}%`,
                background: isActive ? colors.bg.replace("0.18", "0.45") : "transparent",
                border: `1.5px solid ${isActive ? colors.border : "transparent"}`,
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
