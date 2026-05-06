import { cn } from "@/lib/utils";

interface FaderProps {
  value: number; // 0-100
  type?: "vertical" | "horizontal";
  color?: "black" | "grey";
  className?: string;
}

export default function Fader({ value, type = "vertical", color = "black", className }: FaderProps) {
  const isVertical = type === "vertical";
  
  return (
    <div className={cn(
      "relative flex items-center justify-center",
      isVertical ? "w-8 h-40" : "w-40 h-8",
      className
    )}>
      {/* Track */}
      <div className={cn(
        "bg-[#111113] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.05)]",
        isVertical ? "w-1.5 h-full" : "h-1.5 w-full"
      )} />
      
      {/* Cap */}
      <div 
        className={cn(
          "absolute shadow-[0_4px_6px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-black",
          color === "black" ? "bg-[#1e1e22]" : "bg-[#3a3a40]",
          isVertical ? "w-5 h-8 rounded-sm" : "h-5 w-8 rounded-sm"
        )}
        style={{
          [isVertical ? "bottom" : "left"]: `${value}%`,
          transform: isVertical ? "translateY(50%)" : "translateX(-50%)"
        }}
      >
        <div className={cn(
          "absolute bg-white/50",
          isVertical ? "top-1/2 -translate-y-1/2 left-1 right-1 h-0.5" : "left-1/2 -translate-x-1/2 top-1 bottom-1 w-0.5"
        )} />
      </div>
    </div>
  );
}
