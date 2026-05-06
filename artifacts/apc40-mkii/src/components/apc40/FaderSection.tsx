import Fader from "./Fader";
import Knob from "./Knob";

export default function FaderSection() {
  return (
    <div className="flex flex-col mt-2 px-2 relative">
      <div className="flex justify-between items-end gap-2 pr-12">
        <div className="flex justify-between flex-1 relative h-40 border-t border-[#3a3a40]/30 pt-4">
          <div className="absolute top-0 left-0 text-[8px] font-mono text-[#5a5a63] uppercase pt-1 tracking-widest font-bold">Track Volumes</div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`fader-${i}`} className="w-8 flex flex-col items-center">
              <Fader value={70 + (Math.random() * 20 - 10)} type="vertical" />
            </div>
          ))}
        </div>
        
        {/* Master Fader */}
        <div className="w-12 flex flex-col items-center h-40 border-t border-[#3a3a40]/30 pt-4 justify-end">
          <Fader value={85} type="vertical" color="grey" />
          <div className="text-[8px] font-mono text-[#5a5a63] mt-2 uppercase text-center font-bold tracking-widest">Master</div>
        </div>
      </div>
      
      {/* Crossfader Area & Cue */}
      <div className="flex justify-between mt-8 relative pl-16 pr-24 border-t border-[#3a3a40]/30 pt-6">
        <div className="absolute top-2 left-16 text-[8px] font-mono text-[#5a5a63] font-bold">A</div>
        <Fader value={50} type="horizontal" className="flex-1 max-w-[200px] mx-auto" />
        <div className="absolute top-2 right-[20%] text-[8px] font-mono text-[#5a5a63] font-bold">B</div>
        
        <div className="absolute right-0 bottom-0 flex flex-col items-center gap-1">
          <Knob value={40} size="sm" ledColor="orange" />
          <span className="text-[8px] font-mono text-[#5a5a63] font-bold tracking-widest">CUE LEVEL</span>
        </div>
      </div>
    </div>
  );
}
