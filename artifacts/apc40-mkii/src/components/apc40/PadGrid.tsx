import { cn } from "@/lib/utils";
import Knob from "./Knob";

const padColors = [
  "bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]",
  "bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]",
  "bg-blue-500/80 shadow-[0_0_10px_rgba(59,130,246,0.5)]",
  "bg-pink-500/80 shadow-[0_0_10px_rgba(236,72,153,0.5)]",
  "bg-teal-500/80 shadow-[0_0_10px_rgba(20,184,166,0.5)]",
  "bg-orange-500/80 shadow-[0_0_10px_rgba(249,115,22,0.5)]",
  "bg-purple-500/80 shadow-[0_0_10px_rgba(168,85,247,0.5)]",
  "bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)]",
  "bg-[#2a2a30]", // Off
];

export default function PadGrid() {
  return (
    <div className="flex flex-col gap-4">
      {/* Top row: 8 assignable knobs */}
      <div className="flex justify-between px-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`assign-knob-${i}`} className="flex flex-col items-center gap-1">
            <Knob value={(i * 15) % 100} size="sm" ledColor="orange" />
            <span className="text-[8px] font-mono text-[#5a5a63]">KNOB {i + 1}</span>
          </div>
        ))}
      </div>

      {/* Grid area: 8x5 pads + 5 scene launches */}
      <div className="flex gap-2">
        <div className="grid grid-cols-8 grid-rows-5 gap-2 flex-1">
          {Array.from({ length: 40 }).map((_, i) => {
            const isLit = Math.random() > 0.4;
            const colorClass = isLit ? padColors[Math.floor(Math.random() * (padColors.length - 1))] : padColors[padColors.length - 1];
            return (
              <div 
                key={`pad-${i}`}
                className={cn(
                  "w-full aspect-[4/3] rounded-sm border border-black/50 transition-all duration-75 relative overflow-hidden",
                  colorClass,
                  !isLit && "shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.5)]"
                )}
              >
                {/* Pad texture */}
                <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>
        
        {/* Scene Launch Buttons */}
        <div className="flex flex-col gap-2 w-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={`scene-${i}`}
              className="w-full flex-1 bg-[#2a2a30] rounded-sm border border-black/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.5)] relative flex items-center justify-center group"
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-1 h-1 rounded-full bg-green-500/20 group-hover:bg-green-500/80 transition-colors shadow-[0_0_4px_rgba(34,197,94,0)] group-hover:shadow-[0_0_4px_rgba(34,197,94,0.5)]" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row: Clip Stop */}
      <div className="flex justify-between items-center pr-12">
        <div className="flex gap-2 flex-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`stop-${i}`} className="w-full aspect-[2/1] bg-[#3a3a40] rounded-sm border border-black/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center hover:bg-[#4a4a50] transition-colors">
            </div>
          ))}
        </div>
        <div className="absolute right-6 text-[8px] uppercase text-[#8a8a93] font-mono leading-tight text-right w-12">
          Stop<br/>All<br/>Clips
        </div>
      </div>
    </div>
  );
}
