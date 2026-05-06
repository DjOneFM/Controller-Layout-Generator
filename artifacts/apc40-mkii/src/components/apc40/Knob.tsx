import { cn } from "@/lib/utils";

interface KnobProps {
  value: number; // 0-100
  size?: "sm" | "md" | "lg";
  ledColor?: "orange" | "green" | "none";
}

export default function Knob({ value, size = "md", ledColor = "orange" }: KnobProps) {
  const rotation = -135 + (value / 100) * 270;
  
  return (
    <div className={cn(
      "relative flex items-center justify-center rounded-full bg-[#1e1e24] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_2px_4px_rgba(0,0,0,0.8)] border border-black",
      size === "sm" && "w-10 h-10",
      size === "md" && "w-12 h-12",
      size === "lg" && "w-14 h-14"
    )}>
      {/* LED Ring */}
      {ledColor !== "none" && (
        <svg className="absolute inset-0 w-full h-full -rotate-135" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" strokeDasharray="3 4" />
          <circle 
            cx="50" cy="50" r="42" fill="none" 
            stroke={ledColor === "orange" ? "#f97316" : "#22c55e"} 
            strokeWidth="6" 
            strokeDasharray="3 4"
            strokeDashoffset={264 - (264 * (value / 100) * 0.75)}
            className="transition-all duration-300 shadow-[0_0_10px_rgba(249,115,22,0.8)]"
            style={{ strokeDasharray: "264", strokeDashoffset: 264 - (264 * (value / 100) * 0.75) }}
          />
        </svg>
      )}
      
      {/* Inner Cap */}
      <div className={cn(
        "absolute rounded-full bg-[#2a2a32] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.5)] border border-[#1a1a20]",
        size === "sm" && "w-6 h-6",
        size === "md" && "w-8 h-8",
        size === "lg" && "w-10 h-10"
      )} style={{ transform: `rotate(${rotation}deg)` }}>
        <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white/80 rounded-full shadow-[0_0_2px_rgba(255,255,255,0.8)]" />
      </div>
    </div>
  );
}
