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
