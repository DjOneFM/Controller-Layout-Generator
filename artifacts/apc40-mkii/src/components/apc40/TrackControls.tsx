import { Button } from "./Button";

export function TrackControls() {
  return (
    <div className="flex flex-col gap-2 mt-2 px-2">
      {/* Track Selectors */}
      <div className="flex gap-2 w-full pr-12">
        <div className="flex gap-2 flex-1 justify-between">
          {Array.from({ length: 8 }).map((_, i) => (
            <Button key={`sel-${i}`} label={`${i + 1}`} type="square" color="grey" />
          ))}
        </div>
        <div className="w-12 flex justify-end">
          <Button label="MASTER" type="square" color="grey" />
        </div>
      </div>
      
      {/* Track Activator, Crossfade Assign, Solo, Rec Arm */}
      <div className="flex gap-2 w-full pr-12 mt-1">
        <div className="flex gap-2 flex-1 justify-between">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`track-btns-${i}`} className="flex flex-col gap-2 items-center w-8">
              <Button label={`${i + 1}`} type="square" color="grey" active={true} indicator="dot" indicatorColor="green" />
              <Button label="A|B" type="square" color="grey" />
              <Button label="S" type="square" color="grey" indicator="dot" indicatorColor="orange" />
              <Button type="round" color="grey" indicator="dot" indicatorColor="red" />
            </div>
          ))}
        </div>
        <div className="w-12"></div>
      </div>
    </div>
  );
}
