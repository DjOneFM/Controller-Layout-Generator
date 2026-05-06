import PadGrid from "./PadGrid";
import FaderSection from "./FaderSection";
import DeviceControl from "./DeviceControl";
import { TrackControls } from "./TrackControls";

export default function Controller() {
  return (
    <div className="relative w-full max-w-[1200px] aspect-[4/3] sm:aspect-[16/10] bg-[#1a1a1e] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05),inset_0_-2px_4px_rgba(0,0,0,0.5)] border border-[#2a2a30] p-6 flex flex-col md:flex-row gap-6 z-10 overflow-hidden transform-gpu">
      {/* Texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />

      {/* Left Section: Main Grid Area */}
      <div className="flex-1 flex flex-col gap-6 relative z-10">
        <PadGrid />
        <TrackControls />
        <FaderSection />
      </div>

      {/* Right Section: Device Control */}
      <div className="w-[300px] flex-shrink-0 relative z-10 border-l border-[#2a2a30]/50 pl-6 flex flex-col justify-between">
        <DeviceControl />
        
        {/* Logo Area */}
        <div className="flex flex-col items-end gap-1 pb-4">
          <div className="text-xl font-bold tracking-tighter text-[#e0e0e0] flex items-baseline gap-1">
            APC<span className="text-sm font-medium text-[#8a8a93]">40</span> <span className="text-primary text-xs ml-1 font-black">mkII</span>
          </div>
          <div className="text-[8px] tracking-[0.2em] text-[#5a5a63] font-bold">AKAI PROFESSIONAL</div>
        </div>
      </div>
    </div>
  );
}
