import { cn } from "@/lib/utils";

interface ButtonProps {
  label?: string;
  subLabel?: string;
  type?: "square" | "rect" | "tall" | "round";
  color?: "grey" | "red" | "orange";
  indicator?: "none" | "dot" | "line";
  indicatorColor?: "red" | "green" | "orange";
  active?: boolean;
  className?: string;
}

export function Button({
  label,
  subLabel,
  type = "square",
  color = "grey",
  indicator = "none",
  indicatorColor = "red",
  active = false,
  className
}: ButtonProps) {
  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div 
        className={cn(
          "relative border border-black/80 flex items-center justify-center group active:scale-95 transition-transform",
          type === "square" && "w-8 h-8 rounded-sm",
          type === "rect" && "w-10 h-6 rounded-sm",
          type === "tall" && "w-8 h-10 rounded-sm",
          type === "round" && "w-8 h-8 rounded-full",
          color === "grey" && "bg-[#2a2a30] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.5)]",
          color === "red" && "bg-[#8b2a2a] shadow-[inset_0_1px_1px_rgba(255,100,100,0.2),0_1px_2px_rgba(0,0,0,0.5)]",
          color === "orange" && "bg-[#8b5a2a] shadow-[inset_0_1px_1px_rgba(255,180,100,0.2),0_1px_2px_rgba(0,0,0,0.5)]",
          active && color === "grey" && "bg-[#3a3a40]",
          active && color === "red" && "bg-[#da3a3a] shadow-[0_0_10px_rgba(239,68,68,0.5)]",
          active && color === "orange" && "bg-[#da8a3a] shadow-[0_0_10px_rgba(249,115,22,0.5)]"
        )}
      >
        <div className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-colors rounded-inherit" />
        
        {/* Indicator */}
        {indicator === "dot" && (
          <div className={cn(
            "w-1.5 h-1.5 rounded-full absolute top-1.5",
            indicatorColor === "red" && (active ? "bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.8)]" : "bg-red-500/20"),
            indicatorColor === "green" && (active ? "bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.8)]" : "bg-green-500/20"),
            indicatorColor === "orange" && (active ? "bg-orange-500 shadow-[0_0_4px_rgba(249,115,22,0.8)]" : "bg-orange-500/20"),
          )} />
        )}
        
        {label && !subLabel && (
          <span className="text-[7px] font-bold text-white/70 uppercase tracking-tighter pointer-events-none text-center leading-[1]">
            {label}
          </span>
        )}
      </div>
      
      {/* External Label */}
      {(subLabel || (label && indicator !== "none")) && (
        <div className="text-[7px] font-mono text-[#6a6a73] uppercase tracking-tight text-center leading-[1]">
          {subLabel || label}
        </div>
      )}
    </div>
  );
}
