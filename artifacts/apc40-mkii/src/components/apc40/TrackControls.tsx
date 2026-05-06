const PAD_W = 70;
const PAD_GAP = 5;
const COL_W = PAD_W;

const TRACK_LABELS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const QUANT_LABELS = ["NONE", "8 BARS", "4 BARS", "2 BARS", "1 BAR", "1/4", "1/8", "1/16"];

function SmallBtn({
  label,
  color = "#2e2e35",
  textColor = "#8a8a96",
  indicator,
  indicatorColor = "#22c55e",
  width = COL_W,
  height = 22,
}: {
  label?: string;
  color?: string;
  textColor?: string;
  indicator?: "dot";
  indicatorColor?: string;
  width?: number;
  height?: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        background: color,
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.5)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 2px rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        gap: 3,
      }}
    >
      {indicator === "dot" && (
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: indicatorColor, boxShadow: `0 0 4px ${indicatorColor}`, flexShrink: 0 }} />
      )}
      {label && (
        <span style={{ fontSize: 8, fontFamily: "monospace", color: textColor, textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1 }}>
          {label}
        </span>
      )}
    </div>
  );
}

function RecArmBtn({ width = COL_W }: { width?: number }) {
  return (
    <div
      style={{
        width,
        height: 22,
        background: "#2e2e35",
        borderRadius: "50%",
        border: "1px solid rgba(0,0,0,0.5)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#3d1515", border: "1px solid #6a2020", boxShadow: "0 0 3px rgba(200,40,40,0.2)" }} />
    </div>
  );
}

export function TrackControls() {
  const gridW = 8 * PAD_W + 7 * PAD_GAP;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Track Selector row: 8 numbered + Master */}
      <div style={{ display: "flex", gap: PAD_GAP, alignItems: "center" }}>
        {/* Spacer for "Clip Stop" label column */}
        <div style={{ width: 20 }} />
        <div style={{ display: "flex", gap: PAD_GAP }}>
          {TRACK_LABELS.map((label, i) => (
            <div key={`sel-${i}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span style={{ fontSize: 7, fontFamily: "monospace", color: "#4a4a54", letterSpacing: "0.1em" }}>{QUANT_LABELS[i]}</span>
              <SmallBtn label={label} />
            </div>
          ))}
        </div>
        {/* Master track selector */}
        <div style={{ marginLeft: PAD_GAP, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <span style={{ fontSize: 7, fontFamily: "monospace", color: "#4a4a54" }}>&nbsp;</span>
          <SmallBtn label="MST" width={38} />
        </div>
      </div>

      {/* Track Buttons: Activator, A|B, Solo, Rec-Arm */}
      <div style={{ display: "flex", gap: PAD_GAP, alignItems: "flex-start" }}>
        <div style={{ width: 20 }} />
        <div style={{ display: "flex", gap: PAD_GAP }}>
          {TRACK_LABELS.map((label, i) => (
            <div key={`tb-${i}`} style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center", width: COL_W }}>
              <SmallBtn label={label} indicator="dot" indicatorColor="#22c55e" />
              <SmallBtn label="A|B" />
              <SmallBtn label="S" indicator="dot" indicatorColor="#f97316" />
              <RecArmBtn />
            </div>
          ))}
        </div>
        {/* Cue Level label placeholder in master column */}
        <div style={{ width: 38, marginLeft: PAD_GAP }} />
      </div>
    </div>
  );
}
