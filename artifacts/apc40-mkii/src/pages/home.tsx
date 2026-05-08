import { useState, useRef, useCallback, useEffect } from "react";
import apcPhoto from "@assets/APC40mkIII_ortho_web_lg_1778105759979.webp";

type ZoneType = "pad" | "knob" | "button" | "button-red" | "button-orange" | "button-green" | "fader" | "slider";

export interface Zone {
  id: string;
  label: string;
  type: ZoneType;
  x: number;
  y: number;
  w: number;
  h: number;
}

const RESOLUME_MAP: Record<string, string | null> = {
  "ak-1": "Dashboard Dial Hue \u2014 Layer 1",
  "ak-2": "Dashboard Dial Hue \u2014 Layer 2",
  "ak-3": "Dashboard Dial Hue \u2014 Layer 3",
  "ak-4": null, "ak-5": null, "ak-6": null, "ak-7": null, "ak-8": null,
  "pad-r1-c1": "Trigger Column 1",
  "pad-r1-c2": "Trigger Column 2",
  "pad-r1-c3": "Trigger Column 3",
  "pad-r1-c4": "Trigger Column 4",
  "pad-r1-c5": "Trigger Column 5",
  "pad-r1-c6": "Trigger Column 6",
  "pad-r1-c7": "Trigger Column 7",
  "pad-r1-c8": null,
  "pad-r2-c1": null, "pad-r2-c2": null, "pad-r2-c3": null, "pad-r2-c4": null,
  "pad-r2-c5": null, "pad-r2-c6": null, "pad-r2-c7": null, "pad-r2-c8": null,
  "pad-r3-c1": "Clip Trigger \u2014 Layer 1, Col 1",
  "pad-r3-c2": "Clip Trigger \u2014 Layer 1, Col 2",
  "pad-r3-c3": "Clip Trigger \u2014 Layer 1, Col 3",
  "pad-r3-c4": "Clip Trigger \u2014 Layer 1, Col 4",
  "pad-r3-c5": "Clip Trigger \u2014 Layer 1, Col 5",
  "pad-r3-c6": "Clip Trigger \u2014 Layer 1, Col 6",
  "pad-r3-c7": "Clip Trigger \u2014 Layer 1, Col 7",
  "pad-r3-c8": null,
  "pad-r4-c1": "Clip Trigger \u2014 Layer 2, Col 1",
  "pad-r4-c2": "Clip Trigger \u2014 Layer 2, Col 2",
  "pad-r4-c3": "Clip Trigger \u2014 Layer 2, Col 3",
  "pad-r4-c4": "Clip Trigger \u2014 Layer 2, Col 4",
  "pad-r4-c5": "Clip Trigger \u2014 Layer 2, Col 5",
  "pad-r4-c6": "Clip Trigger \u2014 Layer 2, Col 6",
  "pad-r4-c7": "Clip Trigger \u2014 Layer 2, Col 7",
  "pad-r4-c8": null,
  "pad-r5-c1": "Clip Trigger \u2014 Layer 3, Col 1",
  "pad-r5-c2": "Clip Trigger \u2014 Layer 3, Col 2",
  "pad-r5-c3": "Clip Trigger \u2014 Layer 3, Col 3",
  "pad-r5-c4": "Clip Trigger \u2014 Layer 3, Col 4",
  "pad-r5-c5": "Clip Trigger \u2014 Layer 3, Col 5",
  "pad-r5-c6": "Clip Trigger \u2014 Layer 3, Col 6",
  "pad-r5-c7": "Clip Trigger \u2014 Layer 3, Col 7",
  "pad-r5-c8": null,
  "scene-1": null, "scene-2": null,
  "scene-3": "Scene Launch 3", "scene-4": "Scene Launch 4", "scene-5": "Scene Launch 5",
  "stop-all": "Stop All Clips",
  "clip-stop-1": "Clear Layer 1", "clip-stop-2": "Clear Layer 2", "clip-stop-3": "Clear Layer 3",
  "clip-stop-4": null, "clip-stop-5": null, "clip-stop-6": null, "clip-stop-7": null, "clip-stop-8": null,
  "track-sel-1": null, "track-sel-2": null, "track-sel-3": null,
  "track-sel-4": null, "track-sel-5": null, "track-sel-6": null, "track-sel-7": null, "track-sel-8": null,
  "track-sel-master": null,
  "activator-1": "Next (A|B) / Previous Clip \u2014 Layer 1", "activator-2": "Next (A|B) / Previous Clip \u2014 Layer 2", "activator-3": "Next (A|B) / Previous Clip \u2014 Layer 3",
  "activator-4": null, "activator-5": null, "activator-6": null, "activator-7": null, "activator-8": null,
  "crossfade-1": "Next (A|B) / Previous Clip \u2014 Layer 1", "crossfade-2": "Next (A|B) / Previous Clip \u2014 Layer 2", "crossfade-3": "Next (A|B) / Previous Clip \u2014 Layer 3",
  "crossfade-4": null, "crossfade-5": null, "crossfade-6": null, "crossfade-7": null, "crossfade-8": null,
  "solo-1": "Master Fader \u2014 Layer 1", "solo-2": "Master Fader \u2014 Layer 2", "solo-3": "Master Fader \u2014 Layer 3",
  "solo-4": null, "solo-5": null, "solo-6": null, "solo-7": null, "solo-8": null,
  "recarm-1": "Bypass \u2014 Layer 1", "recarm-2": "Bypass \u2014 Layer 2", "recarm-3": "Bypass \u2014 Layer 3",
  "recarm-4": null, "recarm-5": null, "recarm-6": null, "recarm-7": null, "recarm-8": null,
  "fader-1": "Composition Master Fader",
  "fader-2": "Composition Master Fader", "fader-3": "Composition Master Fader",
  "fader-4": null, "fader-5": null, "fader-6": null, "fader-7": null, "fader-8": null,
  "fader-master": "Master Volume Fader",
  "cue-level": "Cue Level",
  "crossfader": null, "pan": null, "play": null, "record": null, "session": null, "sends": null,
  "metro": "BPM Resync", "tap": "BPM Tap", "tempo": "BPM Adjust",
  "user": null, "nudge-minus": null, "nudge-plus": null,
  "dc-knob-1": "Dashboard Dial \u2014 Composition 1",
  "dc-knob-2": "Dashboard Dial \u2014 Composition 2",
  "dc-knob-3": "Dashboard Dial \u2014 Composition 3",
  "dc-knob-4": "Dashboard Dial \u2014 Composition 4",
  "dc-knob-5": "Select Layer 1", "dc-knob-6": "Select Layer 2", "dc-knob-7": "Select Layer 3",
  "dc-knob-8": "Eject All Clips / Preview Composition",
  "dev-left": null, "dev-right": null,
  "bank-left": "Previous Deck", "bank-right": "Next Deck",
  "dev-on": null, "dev-lock": null,
  "clip-dev-view": "Playhead Active Clip", "detail-view": null,
  "shift": null, "bank-btn": null, "bsel-up": null,
  "bsel-left": "Trigger Previous Column", "bsel-down": null,
  "bsel-right": "Trigger Next Column",
};

const MAPPED_STYLE   = { bg: "rgba(34,197,94,0.25)",  border: "#22c55e" };
const UNMAPPED_STYLE = { bg: "rgba(239,68,68,0.20)",  border: "#ef4444" };
const MAPPED_HOVER   = { bg: "rgba(34,197,94,0.50)",  border: "#4ade80" };
const UNMAPPED_HOVER = { bg: "rgba(239,68,68,0.42)",  border: "#f87171" };

const ZONE_COLORS_CALIBRATE: Record<ZoneType, { bg: string; border: string }> = {
  pad:             { bg: "rgba(255,200,0,0.22)",   border: "#ffc800" },
  knob:            { bg: "rgba(249,115,22,0.22)",  border: "#f97316" },
  button:          { bg: "rgba(148,163,184,0.22)", border: "#94a3b8" },
  "button-red":    { bg: "rgba(239,68,68,0.22)",   border: "#ef4444" },
  "button-orange": { bg: "rgba(249,115,22,0.22)",  border: "#f97316" },
  "button-green":  { bg: "rgba(34,197,94,0.22)",   border: "#22c55e" },
  fader:           { bg: "rgba(99,102,241,0.22)",  border: "#6366f1" },
  slider:          { bg: "rgba(99,102,241,0.22)",  border: "#6366f1" },
};

const STORAGE_KEY = "apc40-zones-v2";

const DEFAULT_ZONES: Zone[] = [
  { id: "ak-1", label: "Assignable Knob 1", type: "knob", x: 5, y: 7.5, w: 6.6, h: 9.5 },
  { id: "ak-2", label: "Assignable Knob 2", type: "knob", x: 12.1, y: 7.5, w: 6.6, h: 9.5 },
  { id: "ak-3", label: "Assignable Knob 3", type: "knob", x: 19.2, y: 7.5, w: 6.6, h: 9.5 },
  { id: "ak-4", label: "Assignable Knob 4", type: "knob", x: 26.3, y: 7.5, w: 6.6, h: 9.5 },
  { id: "ak-5", label: "Assignable Knob 5", type: "knob", x: 33.4, y: 7.5, w: 6.6, h: 9.5 },
  { id: "ak-6", label: "Assignable Knob 6", type: "knob", x: 40.5, y: 7.5, w: 6.6, h: 9.5 },
  { id: "ak-7", label: "Assignable Knob 7", type: "knob", x: 47.6, y: 7.5, w: 6.6, h: 9.5 },
  { id: "ak-8", label: "Assignable Knob 8", type: "knob", x: 54.7, y: 7.5, w: 6.6, h: 9.5 },
  { id: "pad-r1-c1", label: "Clip Launch \u2014 Row 1, Col 1", type: "pad", x: 5, y: 18.93, w: 6.77, h: 4.6 },
  { id: "pad-r1-c2", label: "Clip Launch \u2014 Row 1, Col 2", type: "pad", x: 12.1, y: 18.93, w: 6.6, h: 4.6 },
  { id: "pad-r1-c3", label: "Clip Launch \u2014 Row 1, Col 3", type: "pad", x: 19.2, y: 19.07, w: 6.6, h: 4.6 },
  { id: "pad-r1-c4", label: "Clip Launch \u2014 Row 1, Col 4", type: "pad", x: 26.22, y: 18.93, w: 6.6, h: 4.47 },
  { id: "pad-r1-c5", label: "Clip Launch \u2014 Row 1, Col 5", type: "pad", x: 33.4, y: 18.93, w: 6.6, h: 4.6 },
  { id: "pad-r1-c6", label: "Clip Launch \u2014 Row 1, Col 6", type: "pad", x: 40.5, y: 18.93, w: 6.6, h: 4.33 },
  { id: "pad-r1-c7", label: "Clip Launch \u2014 Row 1, Col 7", type: "pad", x: 47.43, y: 18.8, w: 6.6, h: 4.73 },
  { id: "pad-r1-c8", label: "Clip Launch \u2014 Row 1, Col 8", type: "pad", x: 54.37, y: 18.93, w: 6.6, h: 4.6 },
  { id: "pad-r2-c1", label: "Clip Launch \u2014 Row 2, Col 1", type: "pad", x: 5.33, y: 24.8, w: 6.43, h: 3.93 },
  { id: "pad-r2-c2", label: "Clip Launch \u2014 Row 2, Col 2", type: "pad", x: 12.35, y: 25.07, w: 6.35, h: 3.8 },
  { id: "pad-r2-c3", label: "Clip Launch \u2014 Row 2, Col 3", type: "pad", x: 19.37, y: 24.67, w: 6.43, h: 4.33 },
  { id: "pad-r2-c4", label: "Clip Launch \u2014 Row 2, Col 4", type: "pad", x: 26.55, y: 24.93, w: 6.35, h: 3.93 },
  { id: "pad-r2-c5", label: "Clip Launch \u2014 Row 2, Col 5", type: "pad", x: 33.4, y: 24.8, w: 6.6, h: 4.2 },
  { id: "pad-r2-c6", label: "Clip Launch \u2014 Row 2, Col 6", type: "pad", x: 40.58, y: 24.8, w: 6.35, h: 4.07 },
  { id: "pad-r2-c7", label: "Clip Launch \u2014 Row 2, Col 7", type: "pad", x: 47.68, y: 24.67, w: 6.35, h: 4.07 },
  { id: "pad-r2-c8", label: "Clip Launch \u2014 Row 2, Col 8", type: "pad", x: 54.7, y: 24.8, w: 6.35, h: 3.93 },
  { id: "pad-r3-c1", label: "Clip Launch \u2014 Row 3, Col 1", type: "pad", x: 5.42, y: 30.27, w: 6.35, h: 4.2 },
  { id: "pad-r3-c2", label: "Clip Launch \u2014 Row 3, Col 2", type: "pad", x: 12.27, y: 30.27, w: 6.52, h: 4.2 },
  { id: "pad-r3-c3", label: "Clip Launch \u2014 Row 3, Col 3", type: "pad", x: 19.28, y: 30.27, w: 6.43, h: 4.2 },
  { id: "pad-r3-c4", label: "Clip Launch \u2014 Row 3, Col 4", type: "pad", x: 26.38, y: 30.27, w: 6.43, h: 3.93 },
  { id: "pad-r3-c5", label: "Clip Launch \u2014 Row 3, Col 5", type: "pad", x: 33.32, y: 30.27, w: 6.6, h: 4.07 },
  { id: "pad-r3-c6", label: "Clip Launch \u2014 Row 3, Col 6", type: "pad", x: 40.67, y: 30.13, w: 6.27, h: 4.2 },
  { id: "pad-r3-c7", label: "Clip Launch \u2014 Row 3, Col 7", type: "pad", x: 47.6, y: 30.4, w: 6.35, h: 3.93 },
  { id: "pad-r3-c8", label: "Clip Launch \u2014 Row 3, Col 8", type: "pad", x: 54.62, y: 30.13, w: 6.52, h: 4.2 },
  { id: "pad-r4-c1", label: "Clip Launch \u2014 Row 4, Col 1", type: "pad", x: 5.25, y: 35.87, w: 6.6, h: 3.8 },
  { id: "pad-r4-c2", label: "Clip Launch \u2014 Row 4, Col 2", type: "pad", x: 12.43, y: 35.73, w: 6.52, h: 3.8 },
  { id: "pad-r4-c3", label: "Clip Launch \u2014 Row 4, Col 3", type: "pad", x: 19.2, y: 35.6, w: 6.6, h: 4.07 },
  { id: "pad-r4-c4", label: "Clip Launch \u2014 Row 4, Col 4", type: "pad", x: 26.55, y: 35.73, w: 6.35, h: 3.8 },
  { id: "pad-r4-c5", label: "Clip Launch \u2014 Row 4, Col 5", type: "pad", x: 33.57, y: 35.6, w: 6.35, h: 3.93 },
  { id: "pad-r4-c6", label: "Clip Launch \u2014 Row 4, Col 6", type: "pad", x: 40.5, y: 35.73, w: 6.35, h: 3.8 },
  { id: "pad-r4-c7", label: "Clip Launch \u2014 Row 4, Col 7", type: "pad", x: 47.6, y: 35.6, w: 6.43, h: 3.93 },
  { id: "pad-r4-c8", label: "Clip Launch \u2014 Row 4, Col 8", type: "pad", x: 54.78, y: 35.73, w: 6.35, h: 3.8 },
  { id: "pad-r5-c1", label: "Clip Launch \u2014 Row 5, Col 1", type: "pad", x: 5.42, y: 41.2, w: 6.27, h: 3.8 },
  { id: "pad-r5-c2", label: "Clip Launch \u2014 Row 5, Col 2", type: "pad", x: 12.35, y: 41.07, w: 6.35, h: 3.93 },
  { id: "pad-r5-c3", label: "Clip Launch \u2014 Row 5, Col 3", type: "pad", x: 19.53, y: 41.2, w: 6.18, h: 3.67 },
  { id: "pad-r5-c4", label: "Clip Launch \u2014 Row 5, Col 4", type: "pad", x: 26.55, y: 40.93, w: 6.35, h: 4.07 },
  { id: "pad-r5-c5", label: "Clip Launch \u2014 Row 5, Col 5", type: "pad", x: 33.48, y: 40.93, w: 6.43, h: 4.07 },
  { id: "pad-r5-c6", label: "Clip Launch \u2014 Row 5, Col 6", type: "pad", x: 40.75, y: 41.2, w: 6.35, h: 3.8 },
  { id: "pad-r5-c7", label: "Clip Launch \u2014 Row 5, Col 7", type: "pad", x: 47.85, y: 41.07, w: 6.18, h: 3.93 },
  { id: "pad-r5-c8", label: "Clip Launch \u2014 Row 5, Col 8", type: "pad", x: 54.87, y: 41.07, w: 6.18, h: 3.8 },
  { id: "scene-1", label: "Scene Launch 1", type: "button", x: 61.83, y: 19.2, w: 3.67, h: 4.07 },
  { id: "scene-2", label: "Scene Launch 2", type: "button", x: 61.83, y: 24.67, w: 3.75, h: 3.93 },
  { id: "scene-3", label: "Scene Launch 3", type: "button", x: 61.83, y: 30.13, w: 3.75, h: 4.07 },
  { id: "scene-4", label: "Scene Launch 4", type: "button", x: 61.92, y: 35.33, w: 3.67, h: 3.93 },
  { id: "scene-5", label: "Scene Launch 5", type: "button", x: 61.83, y: 40.93, w: 3.75, h: 4.07 },
  { id: "stop-all", label: "Stop All Clips", type: "button-red", x: 61.92, y: 46.83, w: 3.67, h: 4.03 },
  { id: "clip-stop-1", label: "Clip Stop T1", type: "button", x: 6.42, y: 46.97, w: 4.27, h: 4.17 },
  { id: "clip-stop-2", label: "Clip Stop T2", type: "button", x: 13.52, y: 46.7, w: 4.1, h: 4.3 },
  { id: "clip-stop-3", label: "Clip Stop T3", type: "button", x: 20.53, y: 47.1, w: 4.27, h: 4.17 },
  { id: "clip-stop-4", label: "Clip Stop T4", type: "button", x: 27.8, y: 46.97, w: 3.93, h: 4.3 },
  { id: "clip-stop-5", label: "Clip Stop T5", type: "button", x: 34.65, y: 46.97, w: 4.27, h: 4.17 },
  { id: "clip-stop-6", label: "Clip Stop T6", type: "button", x: 41.58, y: 47.1, w: 4.43, h: 4.03 },
  { id: "clip-stop-7", label: "Clip Stop T7", type: "button", x: 48.68, y: 46.83, w: 4.35, h: 4.57 },
  { id: "clip-stop-8", label: "Clip Stop T8", type: "button", x: 55.78, y: 47.1, w: 4.35, h: 4.3 },
  { id: "track-sel-1", label: "Track Selector 1", type: "button", x: 5.5, y: 53.2, w: 6.02, h: 3.67 },
  { id: "track-sel-2", label: "Track Selector 2", type: "button", x: 12.43, y: 53.2, w: 6.27, h: 3.27 },
  { id: "track-sel-3", label: "Track Selector 3", type: "button", x: 19.45, y: 53.33, w: 6.27, h: 3.4 },
  { id: "track-sel-4", label: "Track Selector 4", type: "button", x: 26.55, y: 53.2, w: 6.1, h: 3.4 },
  { id: "track-sel-5", label: "Track Selector 5", type: "button", x: 33.65, y: 53.2, w: 6.18, h: 3.4 },
  { id: "track-sel-6", label: "Track Selector 6", type: "button", x: 40.75, y: 52.93, w: 6.1, h: 3.8 },
  { id: "track-sel-7", label: "Track Selector 7", type: "button", x: 47.77, y: 53.2, w: 6.1, h: 3.4 },
  { id: "track-sel-8", label: "Track Selector 8", type: "button", x: 54.78, y: 53.47, w: 6.43, h: 3.4 },
  { id: "track-sel-master", label: "Master Track Selector", type: "button", x: 61.92, y: 52.8, w: 3.75, h: 3.8 },
  { id: "activator-1", label: "Track Activator 1", type: "button-green", x: 5.25, y: 58.83, w: 3.02, h: 3.47 },
  { id: "activator-2", label: "Track Activator 2", type: "button-green", x: 12.35, y: 58.83, w: 2.93, h: 3.47 },
  { id: "activator-3", label: "Track Activator 3", type: "button-green", x: 19.53, y: 58.97, w: 2.85, h: 3.33 },
  { id: "activator-4", label: "Track Activator 4", type: "button-green", x: 26.47, y: 58.83, w: 2.6, h: 3.6 },
  { id: "activator-5", label: "Track Activator 5", type: "button-green", x: 33.48, y: 58.83, w: 2.93, h: 3.47 },
  { id: "activator-6", label: "Track Activator 6", type: "button-green", x: 40.58, y: 58.83, w: 2.93, h: 3.47 },
  { id: "activator-7", label: "Track Activator 7", type: "button-green", x: 47.77, y: 58.97, w: 2.68, h: 3.33 },
  { id: "activator-8", label: "Track Activator 8", type: "button-green", x: 54.95, y: 58.97, w: 2.27, h: 3.33 },
  { id: "crossfade-1", label: "Crossfade Assign 1", type: "button", x: 8.92, y: 58.83, w: 2.6, h: 3.33 },
  { id: "crossfade-2", label: "Crossfade Assign 2", type: "button", x: 16.02, y: 58.97, w: 2.77, h: 3.33 },
  { id: "crossfade-3", label: "Crossfade Assign 3", type: "button", x: 23.03, y: 58.97, w: 2.52, h: 3.33 },
  { id: "crossfade-4", label: "Crossfade Assign 4", type: "button", x: 30.13, y: 58.83, w: 2.6, h: 3.73 },
  { id: "crossfade-5", label: "Crossfade Assign 5", type: "button", x: 36.98, y: 59.1, w: 2.85, h: 3.2 },
  { id: "crossfade-6", label: "Crossfade Assign 6", type: "button", x: 44.17, y: 59.1, w: 2.85, h: 3.47 },
  { id: "crossfade-7", label: "Crossfade Assign 7", type: "button", x: 51.35, y: 58.83, w: 2.6, h: 3.33 },
  { id: "crossfade-8", label: "Crossfade Assign 8", type: "button", x: 58.37, y: 58.97, w: 2.85, h: 3.47 },
  { id: "solo-1", label: "Solo T1", type: "button", x: 5.5, y: 64.03, w: 2.52, h: 3.2 },
  { id: "solo-2", label: "Solo T2", type: "button", x: 12.68, y: 64.17, w: 2.35, h: 2.93 },
  { id: "solo-3", label: "Solo T3", type: "button", x: 19.53, y: 63.9, w: 2.52, h: 3.47 },
  { id: "solo-4", label: "Solo T4", type: "button", x: 26.55, y: 63.9, w: 2.68, h: 3.33 },
  { id: "solo-5", label: "Solo T5", type: "button", x: 33.48, y: 63.9, w: 2.93, h: 3.6 },
  { id: "solo-6", label: "Solo T6", type: "button", x: 40.75, y: 63.9, w: 2.6, h: 3.2 },
  { id: "solo-7", label: "Solo T7", type: "button", x: 47.77, y: 64.03, w: 2.52, h: 3.2 },
  { id: "solo-8", label: "Solo T8", type: "button", x: 54.87, y: 64.17, w: 2.6, h: 3.07 },
  { id: "recarm-1", label: "Record Arm T1", type: "button-red", x: 8.92, y: 63.9, w: 2.85, h: 3.6 },
  { id: "recarm-2", label: "Record Arm T2", type: "button-red", x: 16.02, y: 64.03, w: 2.6, h: 3.33 },
  { id: "recarm-3", label: "Record Arm T3", type: "button-red", x: 22.95, y: 63.9, w: 2.77, h: 3.47 },
  { id: "recarm-4", label: "Record Arm T4", type: "button-red", x: 30.05, y: 63.9, w: 2.68, h: 3.6 },
  { id: "recarm-5", label: "Record Arm T5", type: "button-red", x: 37.07, y: 64.03, w: 2.77, h: 3.33 },
  { id: "recarm-6", label: "Record Arm T6", type: "button-red", x: 44.17, y: 63.77, w: 3.02, h: 3.6 },
  { id: "recarm-7", label: "Record Arm T7", type: "button-red", x: 51.18, y: 63.9, w: 3.02, h: 3.6 },
  { id: "recarm-8", label: "Record Arm T8", type: "button-red", x: 58.45, y: 64.03, w: 2.68, h: 3.33 },
  { id: "fader-1", label: "Volume Fader 1", type: "fader", x: 6.2, y: 69.23, w: 4.45, h: 22.43 },
  { id: "fader-2", label: "Volume Fader 2", type: "fader", x: 13.05, y: 68.83, w: 4.53, h: 23.1 },
  { id: "fader-3", label: "Volume Fader 3", type: "fader", x: 20.23, y: 69.23, w: 4.53, h: 22.17 },
  { id: "fader-4", label: "Volume Fader 4", type: "fader", x: 27.42, y: 69.23, w: 4.45, h: 22.43 },
  { id: "fader-5", label: "Volume Fader 5", type: "fader", x: 34.35, y: 69.23, w: 4.53, h: 22.57 },
  { id: "fader-6", label: "Volume Fader 6", type: "fader", x: 41.45, y: 69.1, w: 4.45, h: 22.7 },
  { id: "fader-7", label: "Volume Fader 7", type: "fader", x: 48.38, y: 69.1, w: 4.53, h: 22.7 },
  { id: "fader-8", label: "Volume Fader 8", type: "fader", x: 55.57, y: 69.37, w: 4.37, h: 22.3 },
  { id: "fader-master", label: "Master Volume Fader", type: "fader", x: 61.7, y: 68.8, w: 4.37, h: 22.97 },
  { id: "cue-level", label: "Cue Level Knob", type: "knob", x: 61.75, y: 57.27, w: 4.5, h: 9 },
  { id: "crossfader", label: "Crossfader A/B", type: "slider", x: 77.5, y: 81.77, w: 17.75, h: 10.57 },
  { id: "pan", label: "PAN Mode", type: "button-orange", x: 68.83, y: 17, w: 3.42, h: 2.83 },
  { id: "play", label: "Play/Pause", type: "button", x: 76.08, y: 15.8, w: 3.08, h: 3.5 },
  { id: "record", label: "Record", type: "button-red", x: 83, y: 15.53, w: 3.17, h: 3.9 },
  { id: "session", label: "Session Rec", type: "button-red", x: 90.17, y: 15.8, w: 3, h: 3.9 },
  { id: "sends", label: "SENDS Mode", type: "button-orange", x: 68.83, y: 23.53, w: 3.25, h: 2.7 },
  { id: "metro", label: "Metronome", type: "button", x: 76.08, y: 23.8, w: 3, h: 2.57 },
  { id: "tap", label: "Tap Tempo", type: "button", x: 83.17, y: 23.67, w: 3, h: 2.7 },
  { id: "tempo", label: "Tempo Knob", type: "knob", x: 88.58, y: 22.47, w: 6.08, h: 10.27 },
  { id: "user", label: "USER Mode", type: "button-orange", x: 69, y: 29.67, w: 3.25, h: 3.1 },
  { id: "nudge-minus", label: "Nudge \u2212", type: "button", x: 76.08, y: 29.93, w: 3.08, h: 2.43 },
  { id: "nudge-plus", label: "Nudge +", type: "button", x: 83.08, y: 30.07, w: 3, h: 2.43 },
  { id: "dc-knob-1", label: "Device Knob 1", type: "knob", x: 67, y: 36, w: 6.8, h: 9.37 },
  { id: "dc-knob-2", label: "Device Knob 2", type: "knob", x: 74.5, y: 36, w: 6.8, h: 9.77 },
  { id: "dc-knob-3", label: "Device Knob 3", type: "knob", x: 82, y: 36, w: 5.88, h: 9.63 },
  { id: "dc-knob-4", label: "Device Knob 4", type: "knob", x: 88.67, y: 36.13, w: 6.8, h: 9.37 },
  { id: "dc-knob-5", label: "Device Knob 5", type: "knob", x: 67.17, y: 46.9, w: 6.8, h: 10.13 },
  { id: "dc-knob-6", label: "Device Knob 6", type: "knob", x: 74.5, y: 46.9, w: 6.8, h: 10 },
  { id: "dc-knob-7", label: "Device Knob 7", type: "knob", x: 81.67, y: 46.9, w: 6.8, h: 10 },
  { id: "dc-knob-8", label: "Device Knob 8", type: "knob", x: 88.75, y: 47.03, w: 6.8, h: 9.6 },
  { id: "dev-left", label: "Device \u2190", type: "button", x: 69, y: 59.1, w: 3.33, h: 2.63 },
  { id: "dev-right", label: "Device \u2192", type: "button", x: 76, y: 59.37, w: 3.17, h: 2.37 },
  { id: "bank-left", label: "Bank \u2190", type: "button", x: 83.08, y: 59.5, w: 3.25, h: 2.37 },
  { id: "bank-right", label: "Bank \u2192", type: "button", x: 90, y: 59.37, w: 3.33, h: 2.37 },
  { id: "dev-on", label: "Dev On/Off", type: "button", x: 69.08, y: 65.57, w: 3.17, h: 2.5 },
  { id: "dev-lock", label: "Dev Lock", type: "button", x: 76.08, y: 65.7, w: 3.25, h: 2.5 },
  { id: "clip-dev-view", label: "Clip/Dev View", type: "button", x: 82.92, y: 65.7, w: 3.67, h: 2.37 },
  { id: "detail-view", label: "Detail View", type: "button", x: 90, y: 65.43, w: 3.25, h: 2.77 },
  { id: "shift", label: "Shift", type: "button", x: 82.92, y: 72.27, w: 3.25, h: 4.2 },
  { id: "bank-btn", label: "Bank", type: "button", x: 89.83, y: 72, w: 3.5, h: 2.47 },
  { id: "bsel-up", label: "Bank Select \u2191", type: "button", x: 71, y: 72.3, w: 3.67, h: 3.43 },
  { id: "bsel-left", label: "Bank Select \u2190", type: "button", x: 68.92, y: 72.5, w: 2, h: 8.23 },
  { id: "bsel-down", label: "Bank Select \u2193", type: "button", x: 71.08, y: 77.97, w: 3.58, h: 2.9 },
  { id: "bsel-right", label: "Bank Select \u2192", type: "button", x: 74.92, y: 72.37, w: 1.58, h: 8.77 },
];

function loadZones(): Zone[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_ZONES;
}

type Handle = "move" | "n" | "s" | "e" | "w" | "nw" | "ne" | "sw" | "se";

interface DragState {
  zoneId: string;
  handle: Handle;
  startMouseX: number;
  startMouseY: number;
  startZone: Zone;
  imgW: number;
  imgH: number;
}

function ZoneEditor({
  zone, onUpdate, selected, onSelect,
}: {
  zone: Zone; onUpdate: (z: Zone) => void; selected: boolean; onSelect: (id: string) => void;
}) {
  const dragRef = useRef<DragState | null>(null);
  const colors = ZONE_COLORS_CALIBRATE[zone.type];

  const startDrag = useCallback((e: React.MouseEvent, handle: Handle) => {
    e.stopPropagation(); e.preventDefault();
    onSelect(zone.id);
    const img = (e.currentTarget.closest("[data-imgcontainer]") as HTMLElement);
    if (!img) return;
    const rect = img.getBoundingClientRect();
    dragRef.current = { zoneId: zone.id, handle, startMouseX: e.clientX, startMouseY: e.clientY, startZone: { ...zone }, imgW: rect.width, imgH: rect.height };
    const onMove = (mv: MouseEvent) => {
      if (!dragRef.current) return;
      const { handle, startMouseX, startMouseY, startZone, imgW, imgH } = dragRef.current;
      const dx = ((mv.clientX - startMouseX) / imgW) * 100;
      const dy = ((mv.clientY - startMouseY) / imgH) * 100;
      let { x, y, w, h } = startZone;
      if (handle === "move")       { x += dx; y += dy; }
      if (handle === "e" || handle === "ne" || handle === "se") { w = Math.max(1, startZone.w + dx); }
      if (handle === "w" || handle === "nw" || handle === "sw") { x += dx; w = Math.max(1, startZone.w - dx); }
      if (handle === "s" || handle === "se" || handle === "sw") { h = Math.max(0.5, startZone.h + dy); }
      if (handle === "n" || handle === "ne" || handle === "nw") { y += dy; h = Math.max(0.5, startZone.h - dy); }
      onUpdate({ ...zone, x: Math.max(0, x), y: Math.max(0, y), w, h });
    };
    const onUp = () => { dragRef.current = null; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [zone, onUpdate, onSelect]);

  const HS = 9;
  const hStyle = (cursor: string, top?: string | number, left?: string | number, bottom?: string | number, right?: string | number, transform?: string): React.CSSProperties => ({
    position: "absolute", width: HS, height: HS, background: "#fff", border: "1.5px solid #000", borderRadius: 2, cursor,
    ...(top !== undefined ? { top } : {}), ...(left !== undefined ? { left } : {}),
    ...(bottom !== undefined ? { bottom } : {}), ...(right !== undefined ? { right } : {}),
    transform: transform ?? "translate(-50%,-50%)", zIndex: 20,
  });

  return (
    <div
      onMouseDown={(e) => startDrag(e, "move")}
      style={{
        position: "absolute", left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.w}%`, height: `${zone.h}%`,
        background: selected ? colors.bg.replace("0.22", "0.45") : colors.bg,
        border: `2px solid ${colors.border}`, borderRadius: 3, cursor: "move",
        boxSizing: "border-box", userSelect: "none", zIndex: selected ? 15 : 10,
        outline: selected ? `2px solid white` : "none", outlineOffset: 1,
      }}
    >
      <span style={{ position: "absolute", top: 1, left: 2, right: 2, fontSize: 7, fontFamily: "monospace", color: "#fff", textShadow: "0 0 3px #000", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", pointerEvents: "none", lineHeight: 1.2 }}>
        {zone.label}
      </span>
      {selected && <>
        <div style={hStyle("nw-resize", -HS/2, -HS/2, undefined, undefined, "none")}           onMouseDown={(e) => startDrag(e, "nw")} />
        <div style={hStyle("n-resize",  -HS/2, undefined, undefined, undefined, "translateX(-50%)")} onMouseDown={(e) => startDrag(e, "n")} />
        <div style={hStyle("ne-resize", -HS/2, undefined, undefined, -HS/2, "none")}           onMouseDown={(e) => startDrag(e, "ne")} />
        <div style={hStyle("e-resize",  "50%", undefined, undefined, -HS/2, "translateY(-50%)")} onMouseDown={(e) => startDrag(e, "e")} />
        <div style={hStyle("se-resize", undefined, undefined, -HS/2, -HS/2, "none")}           onMouseDown={(e) => startDrag(e, "se")} />
        <div style={hStyle("s-resize",  undefined, "50%", -HS/2, undefined, "translateX(-50%)")} onMouseDown={(e) => startDrag(e, "s")} />
        <div style={hStyle("sw-resize", undefined, -HS/2, -HS/2, undefined, "none")}           onMouseDown={(e) => startDrag(e, "sw")} />
        <div style={hStyle("w-resize",  "50%", -HS/2, undefined, undefined, "translateY(-50%)")} onMouseDown={(e) => startDrag(e, "w")} />
      </>}
    </div>
  );
}

const IMAGE_FILENAME = "APC40mkIII_ortho_web_lg_1778105759979.webp";

export default function Home() {
  const [zones, setZones] = useState<Zone[]>(loadZones);
  const [calibrating, setCalibrating] = useState(false);
  const [activeZone, setActiveZone] = useState<Zone | null>(null);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [copied, setCopied] = useState(false);
  const [infoText, setInfoText] = useState<{ label: string; mapped: string | null } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const mappedCount = zones.filter(z => RESOLUME_MAP[z.id] != null).length;
  const unmappedCount = zones.length - mappedCount;

  const positionTooltip = useCallback((mx: number, my: number) => {
    const tip = tooltipRef.current;
    if (!tip) return;
    const tw = 290, pad = 18, vw = window.innerWidth, vh = window.innerHeight;
    let left = mx + pad, top = my + pad;
    if (left + tw > vw - pad) left = mx - tw - pad;
    if (top + tip.offsetHeight > vh - pad) top = my - tip.offsetHeight - pad;
    if (left < pad) left = pad;
    if (top < pad) top = pad;
    tip.style.left = left + "px";
    tip.style.top = top + "px";
  }, []);

  const showZone = useCallback((zone: Zone, mx: number, my: number, touch: boolean) => {
    setActiveZone(zone);
    setIsTouchActive(touch);
    setInfoText({ label: zone.label, mapped: RESOLUME_MAP[zone.id] ?? null });
    requestAnimationFrame(() => positionTooltip(mx, my));
  }, [positionTooltip]);

  const hideZone = useCallback(() => {
    setActiveZone(null);
    setInfoText(null);
  }, []);

  const updateZone = useCallback((updated: Zone) => {
    setZones((prev) => prev.map((z) => (z.id === updated.id ? updated : z)));
  }, []);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(zones));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const reset = () => { setZones(DEFAULT_ZONES); localStorage.removeItem(STORAGE_KEY); };

  const buildExportPayload = () => {
    const img = imgRef.current;
    return {
      image: { filename: IMAGE_FILENAME, naturalWidth: img?.naturalWidth ?? null, naturalHeight: img?.naturalHeight ?? null, note: "Zone x/y/w/h values are percentages of the rendered image dimensions" },
      exportedAt: new Date().toISOString(), zones,
    };
  };

  const [jsonText, setJsonText] = useState("");
  const exportJson = () => { setJsonText(JSON.stringify(buildExportPayload(), null, 2)); setShowExport(true); };
  const copyJson = () => {
    navigator.clipboard.writeText(jsonText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  const exitCalibrate = () => { save(); setCalibrating(false); setSelectedId(null); };

  useEffect(() => {
    if (calibrating) localStorage.setItem(STORAGE_KEY, JSON.stringify(zones));
  }, [zones, calibrating]);

  useEffect(() => {
    const handler = (e: TouchEvent | MouseEvent) => {
      if (!activeZone) return;
      const target = e.target as HTMLElement;
      if (tooltipRef.current?.contains(target)) return;
      if (target.dataset?.zoneId) return;
      hideZone();
    };
    document.addEventListener("touchstart", handler, { passive: true });
    document.addEventListener("click", handler);
    return () => { document.removeEventListener("touchstart", handler); document.removeEventListener("click", handler); };
  }, [activeZone, hideZone]);

  const mapped = activeZone ? RESOLUME_MAP[activeZone.id] ?? null : null;

  const btnStyle = (color: string, active = false): React.CSSProperties => ({
    padding: "4px 12px", borderRadius: 5, border: `1px solid ${color}`,
    background: active ? color : "transparent", color: active ? "#000" : color,
    fontFamily: "monospace", fontSize: 11, cursor: "pointer",
  });

  return (
    <div
      style={{ minHeight: "100vh", width: "100%", background: "#0d0d0f", display: "flex", flexDirection: "column", alignItems: "center", padding: 12, boxSizing: "border-box", gap: 10, fontFamily: "'Inter', system-ui, sans-serif", WebkitUserSelect: "none", userSelect: "none" }}
      onClick={(e) => { if (activeZone && !(e.target as HTMLElement).dataset?.zoneId) hideZone(); }}
    >
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", background: "#1a1a20", border: "1px solid #2a2a32", borderRadius: 8, padding: "8px 14px", width: "100%", maxWidth: 1200 }}>
        {!calibrating ? (
          <>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", letterSpacing: "0.01em" }}>APC40 mkII — Resolume Mapping</span>
            <span style={{ fontSize: 11, fontWeight: 500, padding: "4px 11px", borderRadius: 5, background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.4)" }}>● {mappedCount} mapped</span>
            <span style={{ fontSize: 11, fontWeight: 500, padding: "4px 11px", borderRadius: 5, background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}>● {unmappedCount} unmapped</span>
            <button onClick={() => setCalibrating(true)} style={btnStyle("#f97316")}>Calibrate Zones</button>
            <button onClick={exportJson} style={btnStyle("#38bdf8")}>Export JSON</button>
          </>
        ) : (
          <>
            <span style={{ fontSize: 12, color: "#fcd34d", fontWeight: 500 }}>Calibration Mode — drag zones, resize with corner handles</span>
            <button onClick={save}  style={btnStyle("#22c55e", saved)}>{saved ? "Saved ✓" : "Save"}</button>
            <button onClick={reset} style={btnStyle("#ef4444")}>Reset</button>
            <button onClick={exitCalibrate} style={btnStyle("#94a3b8")}>Done</button>
          </>
        )}
      </div>

      {/* Legend + tap hint */}
      {!calibrating && (
        <>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: 1200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 500, color: "#8a8a96" }}>
              <div style={{ width: 13, height: 13, borderRadius: 2, background: "rgba(34,197,94,0.35)", border: "1.5px solid #22c55e", flexShrink: 0 }} />
              Mapped to Resolume
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 500, color: "#8a8a96" }}>
              <div style={{ width: 13, height: 13, borderRadius: 2, background: "rgba(239,68,68,0.25)", border: "1.5px solid #ef4444", flexShrink: 0 }} />
              Unmapped — available
            </div>
          </div>
          <div style={{ fontSize: 10, color: "#475569", textAlign: "center", width: "100%", maxWidth: 1200 }} className="tap-hint">
            ℹ Tap any control to see its Resolume mapping
          </div>
        </>
      )}

      {/* Image + zones */}
      <div
        data-imgcontainer=""
        style={{ position: "relative", lineHeight: 0, width: "100%", maxWidth: 1200 }}
        onClick={(e) => calibrating && (e.target as HTMLElement).tagName === "DIV" && setSelectedId(null)}
      >
        <img
          ref={imgRef}
          src={apcPhoto}
          alt="APC40 MKII"
          style={{ display: "block", width: "100%", height: "auto", userSelect: "none", touchAction: "pan-y" }}
          draggable={false}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.37)", pointerEvents: "none" }} />

        {calibrating ? (
          zones.map((zone) => (
            <ZoneEditor key={zone.id} zone={zone} onUpdate={updateZone} selected={selectedId === zone.id} onSelect={setSelectedId} />
          ))
        ) : (
          zones.map((zone) => {
            const isMapped = RESOLUME_MAP[zone.id] != null;
            const s = isMapped ? MAPPED_STYLE : UNMAPPED_STYLE;
            const h = isMapped ? MAPPED_HOVER : UNMAPPED_HOVER;
            const isActive = activeZone?.id === zone.id;
            return (
              <div
                key={zone.id}
                data-zone-id={zone.id}
                onMouseEnter={(e) => showZone(zone, e.clientX, e.clientY, false)}
                onMouseMove={(e) => { if (activeZone?.id === zone.id && !isTouchActive) positionTooltip(e.clientX, e.clientY); }}
                onMouseLeave={() => { if (!isTouchActive) hideZone(); }}
                onTouchStart={(e) => {
                  e.preventDefault(); e.stopPropagation();
                  if (activeZone?.id === zone.id) { hideZone(); return; }
                  const t = e.touches[0];
                  showZone(zone, t.clientX, t.clientY, true);
                }}
                style={{
                  position: "absolute", left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.w}%`, height: `${zone.h}%`,
                  background: isActive ? h.bg : s.bg,
                  border: `1.5px solid ${isActive ? h.border : s.border}`,
                  borderRadius: 3, cursor: "crosshair", boxSizing: "border-box",
                  transition: "background 0.08s, border-color 0.08s",
                  WebkitTapHighlightColor: "transparent",
                }}
              />
            );
          })
        )}
      </div>

      {/* Info bar */}
      {!calibrating && (
        <div style={{ fontSize: 11, fontWeight: 500, color: "#475569", minHeight: 18, width: "100%", maxWidth: 1200, textAlign: "center", letterSpacing: "0.01em" }}>
          {infoText ? (
            infoText.mapped ? (
              <><span style={{ color: "#86efac" }}>{infoText.label}</span> <span style={{ color: "#334155" }}>→</span> <span style={{ color: "#22c55e" }}>{infoText.mapped}</span></>
            ) : (
              <><span style={{ color: "#fca5a5" }}>{infoText.label}</span><span style={{ color: "#ef4444" }}> — unmapped (available to assign)</span></>
            )
          ) : "Hover or tap any control to see its Resolume mapping"}
        </div>
      )}

      {calibrating && selectedId && (
        <div style={{ fontSize: 11, fontFamily: "monospace", color: "#94a3b8" }}>
          Selected: <strong style={{ color: "#e2e8f0" }}>{zones.find(z => z.id === selectedId)?.label}</strong> — drag to move · corner handles to resize
        </div>
      )}

      {/* Fixed tooltip — follows mouse on desktop, fixed-bottom on mobile */}
      {activeZone && (
        <div
          ref={tooltipRef}
          style={{
            position: "fixed", zIndex: 9999, pointerEvents: isTouchActive ? "auto" : "none",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            background: "#0c1220", borderRadius: 12, width: 290, overflow: "hidden",
            boxShadow: "0 16px 48px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#111827" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Hardware Control</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", lineHeight: 1.3, letterSpacing: "-0.01em" }}>{activeZone.label}</div>
          </div>
          <div style={{ padding: "11px 16px 13px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Resolume Arena Default</div>
            {mapped ? (
              <>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#22c55e", lineHeight: 1.4, letterSpacing: "-0.01em" }}>{mapped}</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 20, fontSize: 10, fontWeight: 700, padding: "3px 10px", marginTop: 9, letterSpacing: "0.06em", textTransform: "uppercase", background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.35)" }}>
                  ✓ Mapped
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#f87171", lineHeight: 1.4 }}>Not assigned in default mapping</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 20, fontSize: 10, fontWeight: 700, padding: "3px 10px", marginTop: 9, letterSpacing: "0.06em", textTransform: "uppercase", background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.35)" }}>
                  ○ Unmapped — available
                </div>
              </>
            )}
          </div>
          {isTouchActive && (
            <div
              onClick={hideZone}
              style={{ textAlign: "center", padding: 9, fontSize: 11, fontWeight: 500, color: "#4b5563", borderTop: "1px solid rgba(255,255,255,0.06)", cursor: "pointer" }}
            >
              Tap to dismiss ×
            </div>
          )}
        </div>
      )}

      {/* Export modal */}
      {showExport && (
        <div onClick={() => setShowExport(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#16161e", border: "1px solid #2a2a38", borderRadius: 10, width: "min(660px, 100%)", maxHeight: "80vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #2a2a38" }}>
              <span style={{ fontFamily: "monospace", fontSize: 13, color: "#e2e8f0" }}>
                apc40-mkii-zones.json <span style={{ marginLeft: 10, color: "#64748b", fontSize: 11 }}>{zones.length} zones</span>
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={copyJson} style={{ padding: "4px 14px", borderRadius: 5, cursor: "pointer", fontFamily: "monospace", fontSize: 11, border: `1px solid ${copied ? "#22c55e" : "#38bdf8"}`, background: copied ? "#22c55e" : "transparent", color: copied ? "#000" : "#38bdf8", transition: "all 0.15s" }}>
                  {copied ? "Copied ✓" : "Copy to clipboard"}
                </button>
                <button onClick={() => setShowExport(false)} style={{ padding: "4px 10px", borderRadius: 5, cursor: "pointer", fontFamily: "monospace", fontSize: 11, border: "1px solid #3a3a48", background: "transparent", color: "#94a3b8" }}>✕</button>
              </div>
            </div>
            <pre style={{ margin: 0, padding: 16, overflowY: "auto", flex: 1, fontFamily: "monospace", fontSize: 11, color: "#94a3b8", lineHeight: 1.6, whiteSpace: "pre", background: "transparent" }}>{jsonText}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
