import { useEffect, useRef, useState } from "react";
import Controller from "@/components/apc40/Controller";

const CONTROLLER_W = 1380;
const CONTROLLER_H = 860;

export default function Home() {
  const [scale, setScale] = useState(1);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateScale() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sx = (vw - 32) / CONTROLLER_W;
      const sy = (vh - 32) / CONTROLLER_H;
      setScale(Math.min(sx, sy));
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{ background: "#0d0d0f", width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
    >
      <div
        style={{
          width: CONTROLLER_W,
          height: CONTROLLER_H,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          flexShrink: 0,
        }}
      >
        <Controller />
      </div>
    </div>
  );
}
