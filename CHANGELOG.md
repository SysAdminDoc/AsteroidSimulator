# Changelog

All notable changes to AsteroidSimulator will be documented in this file.

## [0.1.0] - 2026-06-26

### Added
- Complete physics engine implementing Collins et al. 2005 impact effects chain
  - Atmospheric entry ODE solver (Hills & Goda 1993 pancake model, RK4 integration)
  - Crater formation via Holsapple pi-scaling with simple/complex transition
  - Fireball and thermal radiation (Glasstone & Dolan adapted)
  - Seismic magnitude and Mercalli intensity at distance
  - Airblast overpressure (static-source two-term model)
  - Ejecta distribution (power-law decay)
  - Tsunami generation for ocean impacts (Ward & Asphaug 2000)
- 43 unit tests validated against historical events (Chelyabinsk, Meteor Crater, Chicxulub)
- Interactive CesiumJS 3D globe with damage ring overlays
- Impact parameter input panel (diameter, density, velocity, angle, target type, observer distance)
- Results panel showing all 9 effect categories with computed values
- 6 historical event presets (Chelyabinsk, Tunguska, Meteor Crater, Ries, Chesapeake Bay, Chicxulub)
- Click-to-impact on globe (left click = ground zero, right click = observer)
- Catppuccin Mocha dark theme
- NASA CNEOS/JPL Small-Body Database integration (search real asteroids by name)
- Atmospheric entry trajectory arc on globe with entry/airburst markers
- Animated blast wave expansion from impact point
- Crater cross-section SVG diagram (simple bowl / complex with central peak)
- Effect ring color-coded legend with radii
- Energy comparison display (Hiroshima, Tsar Bomba, M9 earthquake equivalents)
- Observer distance marker with haversine great-circle calculation
- Ocean vs land auto-detection from click coordinates
- Shareable URL encoding of all impact parameters
- Responsive layout for mobile/tablet
- Comprehensive research report (docs/RESEARCH_REPORT.md)
