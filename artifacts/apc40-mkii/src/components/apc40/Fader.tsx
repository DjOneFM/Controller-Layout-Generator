interface FaderProps {
  value?: number; // 0-100, position of fader cap
  height?: number;
  width?: number;
  horizontal?: boolean;
}

export default function Fader({ value = 70, height = 172, width = 28, horizontal = false }: FaderProps) {
  const trackThickness = 5;
  const capW = horizontal ? 22 : width - 4;
  const capH = horizontal ? height - 4 : 28;

  if (horizontal) {
    const totalW = height; // repurpose height as length when horizontal
    const capPos = (value / 100) * (totalW - capW);
    return (
      <div style={{ position: "relative", width: totalW, height: width, display: "flex", alignItems: "center" }}>
        {/* Track */}
        <div style={{
          position: "absolute",
          left: 0, right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          height: trackThickness,
          background: "#0e0e11",
          borderRadius: trackThickness / 2,
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.04)",
        }} />
        {/* Cap */}
        <div style={{
          position: "absolute",
          left: capPos,
          top: "50%",
          transform: "translateY(-50%)",
          width: capW,
          height: capH,
          background: "linear-gradient(180deg, #3e3e48 0%, #2a2a32 100%)",
          borderRadius: 3,
          border: "1px solid #1a1a20",
          boxShadow: "0 2px 6px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{ width: 1, height: capH - 6, background: "rgba(255,255,255,0.35)", borderRadius: 1 }} />
        </div>
      </div>
    );
  }

  const capPos = ((100 - value) / 100) * (height - capH);
  return (
    <div style={{ position: "relative", width, height, display: "flex", justifyContent: "center" }}>
      {/* Track */}
      <div style={{
        position: "absolute",
        top: 0, bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: trackThickness,
        background: "#0e0e11",
        borderRadius: trackThickness / 2,
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.8), 1px 0 0 rgba(255,255,255,0.03)",
      }} />
      {/* Cap */}
      <div style={{
        position: "absolute",
        top: capPos,
        left: "50%",
        transform: "translateX(-50%)",
        width: capW,
        height: capH,
        background: "linear-gradient(180deg, #3e3e48 0%, #2a2a32 100%)",
        borderRadius: 3,
        border: "1px solid #1a1a20",
        boxShadow: "0 3px 8px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ height: 1, width: capW - 6, background: "rgba(255,255,255,0.35)", borderRadius: 1 }} />
      </div>
    </div>
  );
}
