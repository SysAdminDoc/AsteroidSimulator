import { useState, useCallback, useRef } from 'react';
import { catppuccinMocha } from '../../theme';

interface NeoResult {
  fullname: string;
  diameter: number;
  velocity: number;
  density: number;
}

interface NeoSearchProps {
  onSelect: (neo: NeoResult) => void;
}

function estimateDensity(specType: string): number {
  const s = (specType || '').toUpperCase();
  if (s.startsWith('M') || s.startsWith('X')) return 5000;
  if (s.startsWith('S') || s.startsWith('Q') || s.startsWith('V')) return 3300;
  if (s.startsWith('C') || s.startsWith('B') || s.startsWith('D') || s.startsWith('P')) return 1800;
  return 2600;
}

function estimateDiameterKm(hMag: number, albedo: number): number {
  return (1329 / Math.sqrt(albedo)) * Math.pow(10, -0.2 * hMag);
}

export function NeoSearch({ onSelect }: NeoSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NeoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = `/api/jpl/sbdb.api?sstr=${encodeURIComponent(q)}&phys-par=true`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`API returned ${resp.status}`);
      const data = await resp.json();

      if (data.code && data.code !== '200') {
        if (data.message?.includes('not found')) {
          setResults([]);
          setError('No matching objects found');
        } else {
          setError(data.message || 'API error');
        }
        setLoading(false);
        return;
      }

      const obj = data.object;
      if (!obj) {
        setResults([]);
        setLoading(false);
        return;
      }

      const physPar = data.phys_par || [];
      let diameter = 0;
      let albedo = 0.15;
      let specType = '';

      for (const p of physPar) {
        if (p.name === 'diameter' && p.value) diameter = parseFloat(p.value) * 1000;
        if (p.name === 'albedo' && p.value) albedo = parseFloat(p.value);
        if (p.name === 'spec_T' && p.value) specType = p.value;
        if (p.name === 'spec_B' && p.value && !specType) specType = p.value;
      }

      if (diameter <= 0 && data.object?.des) {
        const hMag = data.orbit?.elements?.find((e: any) => e.name === 'H')?.value;
        if (hMag) {
          diameter = estimateDiameterKm(parseFloat(hMag), albedo) * 1000;
        }
      }

      if (diameter <= 0) diameter = 100;

      const density = estimateDensity(specType);
      const typicalVelocity = 20000;

      setResults([{
        fullname: obj.fullname || obj.des || q,
        diameter,
        velocity: typicalVelocity,
        density,
      }]);
    } catch (err: any) {
      setError(err.message || 'Network error');
      setResults([]);
    }

    setLoading(false);
  }, []);

  const handleInput = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 500);
  }, [search]);

  const s = {
    container: { marginTop: 16 },
    label: {
      color: catppuccinMocha.subtext0,
      fontSize: 11,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.08em',
      marginBottom: 6,
      display: 'block',
    },
    input: {
      width: '100%',
      padding: '6px 8px',
      background: catppuccinMocha.surface0,
      color: catppuccinMocha.text,
      border: `1px solid ${catppuccinMocha.surface1}`,
      borderRadius: 6,
      fontSize: 13,
      outline: 'none',
      boxSizing: 'border-box' as const,
    },
    result: {
      padding: '6px 8px',
      background: catppuccinMocha.surface0,
      border: `1px solid ${catppuccinMocha.surface1}`,
      borderRadius: 6,
      marginTop: 4,
      cursor: 'pointer',
      fontSize: 12,
    },
    hint: {
      color: catppuccinMocha.overlay0,
      fontSize: 10,
      marginTop: 4,
    },
  };

  return (
    <div style={s.container}>
      <span style={s.label}>NASA NEO Lookup</span>
      <input
        type="text"
        style={s.input}
        placeholder="e.g. Apophis, Bennu, 2024 YR4"
        value={query}
        onChange={e => handleInput(e.target.value)}
        onFocus={e => (e.target.style.borderColor = catppuccinMocha.blue)}
        onBlur={e => (e.target.style.borderColor = catppuccinMocha.surface1)}
      />
      {loading && <div style={s.hint}>Searching JPL database...</div>}
      {error && <div style={{ ...s.hint, color: catppuccinMocha.red }}>{error}</div>}
      {results.map((neo, i) => (
        <div
          key={i}
          style={s.result}
          onClick={() => onSelect(neo)}
          onMouseOver={e => (e.currentTarget.style.background = catppuccinMocha.surface1)}
          onMouseOut={e => (e.currentTarget.style.background = catppuccinMocha.surface0)}
        >
          <div style={{ color: catppuccinMocha.text, fontWeight: 600 }}>{neo.fullname}</div>
          <div style={{ color: catppuccinMocha.overlay1, marginTop: 2 }}>
            {neo.diameter >= 1000
              ? `${(neo.diameter / 1000).toFixed(1)} km`
              : `${neo.diameter.toFixed(0)} m`}
            {' diameter, '}
            {neo.density} kg/m3
          </div>
          <div style={{ color: catppuccinMocha.green, marginTop: 2, fontSize: 11 }}>
            Click to simulate impact
          </div>
        </div>
      ))}
      {!loading && !error && results.length === 0 && query.length >= 2 && (
        <div style={s.hint}>Type an asteroid name or designation</div>
      )}
    </div>
  );
}
