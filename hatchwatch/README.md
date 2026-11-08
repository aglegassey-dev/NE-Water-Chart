# HatchWatch

A mobile-first fly fishing conditions dashboard for rivers in Maine, New Hampshire, and Vermont. Shows live USGS streamflow, water temperature, weather, and active hatch information for 24 rivers across the region.

## Setup

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`. No API keys required — data is sourced from the free USGS Water Services API and Open-Meteo.

## Deploying

```bash
npm run build
netlify deploy --prod --dir=dist
```

Or connect the repo to Netlify — `netlify.toml` handles the build command and SPA redirect automatically.

## Adding a River

Edit `src/data/rivers.js` and add an entry to the `rivers` array. Each river requires these fields:

```js
{
  id: string,           // unique kebab-case slug, e.g. 'my-river-section'
  name: string,         // river name, e.g. 'Kennebec River'
  section: string,      // section description, e.g. 'East Outlet'
  state: 'ME' | 'NH' | 'VT',
  usgsStationId: string, // 8-digit USGS station ID — find at waterdata.usgs.gov
  lat: number,
  lng: number,
  targetSpecies: string[],
  notes: string,        // one sentence describing the fishery character
  difficulty: 'wade' | 'drift' | 'both',
  flyFishingOnly: boolean,
}
```

The USGS station ID drives all live data (discharge, gauge height, water temperature). Find station IDs at [waterdata.usgs.gov](https://waterdata.usgs.gov).

## Data Sources

- **Streamflow & gauge**: [USGS Water Services](https://waterservices.usgs.gov/) (no key required)
- **Weather**: [Open-Meteo](https://open-meteo.com/) (no key required)
- **Hatch data**: Curated for Maine, New Hampshire & Vermont

## Freeport Hunt Map (`/hunt/`)

An installable, offline-capable hunting map app (PWA) at `public/hunt/`, served at `/hunt/` on the deployed
site. Open it on your phone and use **Add to Home Screen** (iPhone: Safari → Share → Add to Home Screen;
Android: Chrome → Install app).

**Legal zones:** Freeport Conservation Trust preserves colored by hunting status. Live GPS shows your status,
the distance to the boundary and a warning when GPS accuracy is larger than that distance. Also includes
about 100-yard safety circles around E911 address points, a Sunday warning and calculated legal shooting hours.

**Terrain & food (onX-style layers):**
- LiDAR terrain base and hillshade overlay (Maine 1 m bare-earth DEM): ravines, benches, saddles
- Slope angle shading (10–15°, 15–25°, 25–35°, 35°+) from the same LiDAR
- USGS contour lines with elevation labels, USGS streams and water
- Leaf-off aerial photos (Maine GeoLibrary): hardwoods look gray/brown, conifers dark green
- Hardwood forest (NLCD 2021, 30 m) and oak forest groups (USFS FIA, 250 m)
- Presets: *Terrain scout*, *Terrain on satellite*, *Food / hardwoods*, *Plain satellite*

**Waypoints & tracks:**
- Long-press the map or tap ＋ to drop a waypoint (stand, blind, camera, scrape, rub, bedding, oaks, water, …)
  with name, notes and photos. Drag to move it, and tap **Go** to navigate (distance and bearing from your GPS).
- ● records a track of your walk.
- Import/export GPX and KML, compatible with onX, Garmin and Gaia.
- Everything is stored on the device in IndexedDB.

**Offline:** the Offline maps sheet downloads every selected layer for the area on screen into Cache Storage
(`hunt-tiles`), and the service worker serves tiles cache-first. Zones, waypoints and GPS work without signal.

**Wind:** current wind with hourly forecast (Open-Meteo). Arrows show where your scent drifts.

**Code layout:** `index.html` and `app.css` with ES modules in `js/` (`main`, `layers`, `geo`, `db`, `gpx`,
`offline`, `weather`) plus vendored Leaflet. There's no build step for the hunt app itself: Vite copies `public/`
and workbox precaches it. Runtime tile caching is configured in `vite.config.js`.

GPS requires HTTPS (Netlify provides it). This is a guide only. Posted signs and FCT rules take priority.

**Updating zone data:** hunting status for each parcel is set in `STATUS` in `scripts/build-hunt-data.py`
(transcribed from FCT's "Hunting on Freeport Conservation Trust Preserves" map). Boundaries and address
points are downloaded from Maine GeoLibrary. Regenerate with:

```bash
python3 scripts/build-hunt-data.py   # writes public/hunt/data.js
```
