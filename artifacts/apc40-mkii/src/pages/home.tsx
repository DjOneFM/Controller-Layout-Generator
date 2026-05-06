import Controller from "@/components/apc40/Controller";
import refImage from "@assets/APC40mkIII_ortho_web_lg_1778104809611.webp";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 lg:p-12 relative overflow-hidden">
      {/* Background Reference (Optional, slightly visible or tucked away) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
        <img src={refImage} alt="Reference" className="max-w-full max-h-full object-contain blur-sm" />
      </div>

      {/* Main Controller Panel */}
      <Controller />
      
      {/* Floating reference thumbnail */}
      <div className="absolute bottom-4 right-4 opacity-30 hover:opacity-100 transition-opacity flex flex-col items-end gap-2 z-50">
        <span className="text-[10px] font-mono text-muted-foreground uppercase">Reference</span>
        <img src={refImage} alt="Reference Thumbnail" className="w-48 rounded shadow-xl border border-white/10" />
      </div>
    </div>
  );
}
