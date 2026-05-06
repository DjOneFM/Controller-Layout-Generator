import { cn } from "@/lib/utils";
import Knob from "./Knob";

const PAD_W = 70;
const PAD_H = 52;
const PAD_GAP = 5;
const SCENE_W = 38;

const padColors = [
  { bg: "#e53e2a", glow: "rgba(229,62,42,0.6)" },
  { bg: "#e8830a", glow: "rgba(232,131,10,0.6)" },
  { bg: "#c4a800", glow: "rgba(196,168,0,0.6)" },
  { bg: "#22a85c", glow: "rgba(34,168,92,0.6)" },
  { bg: "#1a9fcc", glow: "rgba(26,159,204,0.6)" },
  { bg: "#5a5aee", glow: "rgba(90,90,238,0.6)" },
  { bg: "#c44eb0", glow: "rgba(196,78,176,0.6)" },
  { bg: "#e8622a", glow: "rgba(232,98,42,0.6)" },
];

const OFF_PAD = { bg: "#252528", glow: "" };

function seededColor(index: number) {
  const seed = (index * 7 + 13) % 17;
  if (seed < 10) return padColors[seed % padColors.length];
  return OFF_PAD;
}

const gridW = 8 * PAD_W + 7 * PAD_GAP;
const gridH = 5 * PAD_H + 4 * PAD_GAP;

export default function PadGrid() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {/* Assignable knobs row — 8 above the 8 columns */}
      <div style={{ display: "flex", gap: PAD_GAP, width: gridW }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`ak-${i}`}
            style={{ width: PAD_W, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}
          >
            <Knob value={30 + (i * 9) % 70} size="md" ledColor="orange" />
            <span style={{ fontSize: 8, fontFamily: "monospace", color: "#5a5a66", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {["PAN", "SEND", "USER", "KNOB 4", "KNOB 5", "KNOB 6", "KNOB 7", "KNOB 8"][i]}
            </span>
          </div>
        ))}
      </div>

      {/* Pad grid + scene launches */}
      <div style={{ display: "flex", gap: PAD_GAP, alignItems: "flex-start" }}>
        {/* 8×5 pad grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(8, ${PAD_W}px)`,
            gridTemplateRows: `repeat(5, ${PAD_H}px)`,
            gap: PAD_GAP,
            width: gridW,
            height: gridH,
          }}
        >
          {Array.from({ length: 40 }).map((_, i) => {
            const c = seededColor(i);
            const isLit = c !== OFF_PAD;
            return (
              <div
                key={`pad-${i}`}
                style={{
                  width: PAD_W,
                  height: PAD_H,
                  background: c.bg,
                  borderRadius: 3,
                  border: "1px solid rgba(0,0,0,0.5)",
                  boxShadow: isLit ? `0 0 10px ${c.glow}, inset 0 1px 1px rgba(255,255,255,0.15)` : "inset 0 1px 1px rgba(255,255,255,0.04), 0 1px 2px rgba(0,0,0,0.4)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {isLit && (
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Scene launch buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: PAD_GAP, width: SCENE_W }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`scene-${i}`}
              style={{
                width: SCENE_W,
                height: PAD_H,
                background: "#2a2a30",
                borderRadius: 3,
                border: "1px solid rgba(0,0,0,0.5)",
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(34,197,94,0.25)", boxShadow: "0 0 4px rgba(34,197,94,0.2)" }} />
            </div>
          ))}
        </div>

        {/* SCENE LAUNCH label */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", paddingTop: 4 }}>
          <span style={{ fontSize: 7, fontFamily: "monospace", color: "#5a5a66", textTransform: "uppercase", letterSpacing: "0.08em", writingMode: "vertical-lr", transform: "rotate(180deg)", lineHeight: 1.2 }}>
            Scene Launch
          </span>
        </div>
      </div>

      {/* Clip Stop row */}
      <div style={{ display: "flex", gap: PAD_GAP, alignItems: "center" }}>
        <div style={{ display: "flex", gap: PAD_GAP }}>
          {/* CLIP STOP label on left */}
          <div style={{ width: 20, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <span style={{ fontSize: 6, fontFamily: "monospace", color: "#5a5a66", textTransform: "uppercase", letterSpacing: "0.06em", writingMode: "vertical-lr", transform: "rotate(180deg)" }}>
              Clip Stop
            </span>
          </div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`stop-${i}`}
              style={{
                width: PAD_W,
                height: 26,
                background: "#333338",
                borderRadius: 3,
                border: "1px solid rgba(0,0,0,0.5)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 1px 2px rgba(0,0,0,0.4)",
              }}
            />
          ))}
        </div>
        {/* Stop All Clips button */}
        <div style={{ marginLeft: PAD_GAP, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div
            style={{
              width: SCENE_W,
              height: 26,
              background: "#3d1a1a",
              border: "1px solid #6a2020",
              borderRadius: 3,
              boxShadow: "inset 0 1px 0 rgba(255,100,100,0.1)",
            }}
          />
          <span style={{ fontSize: 6, fontFamily: "monospace", color: "#7a4040", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center" }}>
            Stop<br/>All<br/>Clips
          </span>
        </div>
      </div>
    </div>
  );
}
