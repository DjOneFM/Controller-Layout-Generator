import PadGrid from "./PadGrid";
import FaderSection from "./FaderSection";
import DeviceControl from "./DeviceControl";
import { TrackControls } from "./TrackControls";

export default function Controller() {
  return (
    <div
      style={{ width: 1380, height: 860, display: "flex", flexDirection: "row", gap: 20, padding: 20, boxSizing: "border-box" }}
      className="bg-[#1c1c20] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.06)] border border-[#2a2a32]"
    >
      {/* Left Section */}
      <div style={{ width: 856, display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
        <PadGrid />
        <TrackControls />
        <FaderSection />
      </div>

      {/* Divider */}
      <div style={{ width: 1, background: "#2a2a32", flexShrink: 0, margin: "4px 0" }} />

      {/* Right Section */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <DeviceControl />
      </div>
    </div>
  );
}
