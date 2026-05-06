import { Button } from "./Button";
import Knob from "./Knob";

export default function DeviceControl() {
  return (
    <div className="flex flex-col h-full gap-4 pt-2">
      {/* Transport / Global */}
      <div className="grid grid-cols-4 gap-2 border-b border-[#3a3a40]/50 pb-4">
        <Button label="PAN" type="rect" color="grey" indicator="dot" indicatorColor="orange" active />
        <Button label="PLAY" type="rect" color="grey" />
        <Button label="REC" type="rect" color="red" />
        <Button label="SESS" type="rect" color="red" />
        
        <Button label="SENDS" type="rect" color="grey" indicator="dot" indicatorColor="orange" />
        <Button label="METRO" type="rect" color="grey" />
        <Button label="TAP" type="rect" color="grey" />
        <div className="flex justify-center items-center"><Knob value={60} size="sm" ledColor="none" /></div>
        
        <Button label="USER" type="rect" color="grey" indicator="dot" indicatorColor="orange" />
        <Button label="NUDGE-" type="rect" color="grey" />
        <Button label="NUDGE+" type="rect" color="grey" />
        <div className="text-[8px] font-mono text-[#5a5a63] text-center pt-2 font-bold tracking-widest">TEMPO</div>
      </div>
      
      {/* Device Control Section */}
      <div className="flex flex-col gap-4 border-b border-[#3a3a40]/50 pb-4">
        <div className="text-[10px] font-bold tracking-widest text-[#8a8a93] mb-1 uppercase">Device Control</div>
        
        {/* Device Knobs */}
        <div className="grid grid-cols-4 gap-2 gap-y-3 justify-items-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <Knob key={`dk1-${i}`} value={(i * 20) % 100} size="sm" />
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`dl1-${i}`} className="text-[8px] font-mono text-[#5a5a63] font-bold">{i + 1}</div>
          ))}
          
          {Array.from({ length: 4 }).map((_, i) => (
            <Knob key={`dk2-${i}`} value={(i * 30 + 15) % 100} size="sm" />
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`dl2-${i}`} className="text-[8px] font-mono text-[#5a5a63] font-bold">{i + 5}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-4 gap-2 mt-2">
          <Button label="DEV ←" type="rect" color="grey" />
          <Button label="DEV →" type="rect" color="grey" />
          <Button label="BANK ←" type="rect" color="grey" />
          <Button label="BANK →" type="rect" color="grey" />
          
          <Button label="DEV ON" type="rect" color="grey" />
          <Button label="DEV LCK" type="rect" color="grey" />
          <Button label="CLIP/DEV" type="rect" color="grey" />
          <Button label="DETAIL" type="rect" color="grey" />
        </div>
      </div>
      
      {/* Shift & Bank */}
      <div className="flex gap-2">
        <Button label="SHIFT" type="rect" color="grey" className="flex-1 max-w-[80px]" />
        <Button label="BANK" type="rect" color="grey" className="flex-1 max-w-[80px]" />
      </div>
      
      {/* Bank Select / Navigation */}
      <div className="mt-auto flex flex-col items-center border-t border-[#3a3a40]/50 pt-4 pb-2">
        <div className="grid grid-cols-3 grid-rows-2 gap-1 mb-2">
          <div />
          <Button label="↑" type="square" color="grey" />
          <div />
          <Button label="←" type="square" color="grey" />
          <Button label="↓" type="square" color="grey" />
          <Button label="→" type="square" color="grey" />
        </div>
        <div className="text-[8px] font-mono text-[#5a5a63] uppercase tracking-widest font-bold">Bank Select</div>
      </div>
    </div>
  );
}
