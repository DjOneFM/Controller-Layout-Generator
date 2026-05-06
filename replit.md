# APC40 MKII Virtual Layout

A browser-based interactive map of the Akai APC40 MKII MIDI controller — hover any control to identify it, and use the built-in calibration editor to precisely position zones.

## Run & Operate

- `pnpm --filter @workspace/apc40-mkii run dev` — run the web app (via workflow `artifacts/apc40-mkii: web`)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Web app: React + Vite (`artifacts/apc40-mkii`)
- API: Express 5 (`artifacts/api-server`)

## Where things live

- `artifacts/apc40-mkii/src/pages/home.tsx` — entire app: photo overlay, zone definitions, calibration editor
- `attached_assets/APC40mkIII_ortho_web_lg_1778105759979.webp` — device reference photo (imported via `@assets` Vite alias)
- Zone positions stored in `localStorage` under key `apc40-zones-v1`

## Architecture decisions

- **Photo-overlay approach**: device photo as background, transparent `div` zones positioned as `%` of image dimensions — scales with the image automatically
- **Calibration editor built-in**: users drag/resize zones directly over the photo using mouse handles; positions auto-save to `localStorage`
- **Default zones as code**: `DEFAULT_ZONES` in `home.tsx` is the fallback if no saved calibration exists; `localStorage` overrides on load
- **Zone types drive color**: `ZONE_COLORS` map determines highlight color per control type (pad, knob, fader, button variants, slider)

## Product

- Display the APC40 MKII controller photo full-screen
- Hover any control to see a tooltip identifying it
- "Calibrate Zones" mode: all zones visible, draggable, resizable with corner handles; saves to localStorage

## User preferences

- Faders: one slim rectangular zone per fader track (not a full column)
- Calibration editor added so user can precisely position zones themselves

## Gotchas

- Zone `x/y/w/h` are `%` of rendered image dimensions — they scale automatically with viewport
- `localStorage` key `apc40-zones-v1` — clear to reset to defaults (or use the Reset button in calibration mode)
- The `@assets` Vite alias resolves to `attached_assets/` at the workspace root

## Pointers

- See the `pnpm-workspace` skill for workspace structure and TypeScript setup
- See the `react-vite` skill for Vite config details and `@assets` alias
