[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/SysAdminDoc/AsteroidSimulator/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()

# AsteroidSimulator

Simulate asteroid and comet impacts on Earth with precise mathematical models. Visualize crater formation, blast waves, thermal radiation, seismic effects, ejecta, and tsunamis from ocean impacts on an interactive 3D globe.

## Features

- **Atmospheric Entry** — Drag, ablation, and fragmentation modeling (Hills & Goda 1993)
- **Crater Formation** — Pi-scaling laws (Holsapple & Schmidt 1987) for transient and final crater dimensions
- **Blast & Thermal Effects** — Overpressure rings, thermal radiation radii, and fireball modeling
- **Seismic Shaking** — Equivalent Richter magnitude at distance from impact
- **Ejecta Distribution** — Ballistic ejecta curtain thickness vs. distance
- **Ocean Impacts** — Tsunami generation, propagation, and coastal runup
- **Historical Comparisons** — Chicxulub, Tunguska, Chelyabinsk, Barringer presets
- **NASA Integration** — Near-Earth Object database (CNEOS/JPL) for real asteroid parameters
- **Interactive 3D Globe** — Click anywhere to simulate an impact with real-time damage visualization

## Physics References

Based on peer-reviewed impact science:

- Collins, Melosh & Marcus (2005) — *Earth Impact Effects Program*
- Holsapple (1993) — Pi-group crater scaling laws
- Hills & Goda (1993) — Atmospheric fragmentation model
- Melosh (1989) — *Impact Cratering: A Geologic Process*
- Glasstone & Dolan (1977) — Blast/thermal scaling (adapted)

## Getting Started

```bash
# Clone
git clone https://github.com/SysAdminDoc/AsteroidSimulator.git
cd AsteroidSimulator

# Install dependencies
npm install

# Development
npm run dev
```

## License

[MIT](LICENSE)
