import { useState, useCallback, useMemo, useEffect } from 'react';
import { simulate } from '../physics';
import type { ImpactParams, TargetType } from '../physics/types';
import { PRESETS } from '../presets/historical';

const DEFAULT_PARAMS: ImpactParams = {
  diameter: 50,
  density: 7800,
  velocity: 12800,
  angle: 45,
  targetType: 'sedimentary_rock',
  waterDepth: 0,
  distance: 50000,
};

const DEFAULT_LAT = 35.0268;
const DEFAULT_LON = -111.0222;

function parseUrlParams(): { params: ImpactParams; lat: number; lon: number } | null {
  const hash = window.location.hash.slice(1);
  if (!hash) return null;
  try {
    const sp = new URLSearchParams(hash);
    const d = sp.get('d'), rho = sp.get('rho'), v = sp.get('v'),
      a = sp.get('a'), t = sp.get('t'), wd = sp.get('wd'),
      dist = sp.get('dist'), lat = sp.get('lat'), lon = sp.get('lon');
    if (!d || !rho || !v || !a) return null;
    return {
      params: {
        diameter: parseFloat(d),
        density: parseFloat(rho),
        velocity: parseFloat(v),
        angle: parseFloat(a),
        targetType: (t || 'sedimentary_rock') as TargetType,
        waterDepth: parseFloat(wd || '0'),
        distance: parseFloat(dist || '50000'),
      },
      lat: parseFloat(lat || String(DEFAULT_LAT)),
      lon: parseFloat(lon || String(DEFAULT_LON)),
    };
  } catch {
    return null;
  }
}

function writeUrlParams(params: ImpactParams, lat: number, lon: number) {
  const sp = new URLSearchParams();
  sp.set('d', String(params.diameter));
  sp.set('rho', String(params.density));
  sp.set('v', String(params.velocity));
  sp.set('a', String(params.angle));
  sp.set('t', params.targetType);
  if (params.waterDepth > 0) sp.set('wd', String(params.waterDepth));
  sp.set('dist', String(params.distance));
  sp.set('lat', lat.toFixed(4));
  sp.set('lon', lon.toFixed(4));
  window.history.replaceState(null, '', `#${sp.toString()}`);
}

export function useSimulation() {
  const initial = parseUrlParams();
  const [params, setParams] = useState<ImpactParams>(initial?.params ?? DEFAULT_PARAMS);
  const [impactLat, setImpactLat] = useState(initial?.lat ?? DEFAULT_LAT);
  const [impactLon, setImpactLon] = useState(initial?.lon ?? DEFAULT_LON);

  const results = useMemo(() => simulate(params), [params]);

  useEffect(() => {
    writeUrlParams(params, impactLat, impactLon);
  }, [params, impactLat, impactLon]);

  const updateParam = useCallback(<K extends keyof ImpactParams>(
    key: K,
    value: ImpactParams[K],
  ) => {
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const setImpactLocation = useCallback((lat: number, lon: number) => {
    setImpactLat(lat);
    setImpactLon(lon);
  }, []);

  const loadPreset = useCallback((index: number) => {
    const preset = PRESETS[index];
    if (preset) {
      setParams(preset.params);
    }
  }, []);

  return {
    params,
    results,
    impactLat,
    impactLon,
    updateParam,
    setImpactLocation,
    loadPreset,
  };
}
