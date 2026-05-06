import Fader from "./Fader";
import Knob from "./Knob";

const PAD_W = 70;
const PAD_GAP = 5;
const FADER_HEIGHT = 168;
const FADER_WIDTH = 28;

const TRACK_POSITIONS = [60, 72, 65, 78, 55, 70, 68, 74];

export default function FaderSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Volume Faders row */}
      <div style={{ display: "flex", gap: PAD_GAP, alignItems: "flex-start" }}>
        {/* Spacer for "Clip Stop" label column */}
        <div style={{ width: 20 }} />

        {/* 8 track faders */}
        <div style={{ display: "flex", gap: PAD_GAP }}>
          {TRACK_POSITIONS.map((val, i) => (
            <div key={`fader-${i}`} style={{ width: PAD_W, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <Fader value={val} height={FADER_HEIGHT} width={FADER_WIDTH} />
            </div>
          ))}
        </div>

        {/* Master fader */}
        <div style={{ marginLeft: PAD_GAP, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <Fader value={85} height={FADER_HEIGHT} width={FADER_WIDTH} />
          <span style={{ fontSize: 7, fontFamily: "monospace", color: "#5a5a66", textTransform: "uppercase", letterSpacing: "0.1em" }}>Master</span>
        </div>

        {/* Cue Level knob */}
        <div style={{ marginLeft: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, justifyContent: "flex-end", height: FADER_HEIGHT + 18 }}>
          <Knob value={45} size="sm" ledColor="orange" />
          <span style={{ fontSize: 7, fontFamily: "monospace", color: "#5a5a66", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center", lineHeight: 1.2 }}>
            Cue<br/>Level
          </span>
        </div>
      </div>

      {/* Crossfader row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 20 }}>
        <span style={{ fontSize: 9, fontFamily: "monospace", color: "#8a8a96", fontWeight: "bold" }}>A</span>
        <Fader value={50} horizontal height={280} width={32} />
        <span style={{ fontSize: 9, fontFamily: "monospace", color: "#8a8a96", fontWeight: "bold" }}>B</span>
      </div>
    </div>
  );
}
