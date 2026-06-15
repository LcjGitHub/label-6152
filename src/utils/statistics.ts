import type { Star, Enclosure } from '@/types/star';

export interface EnclosureStat {
  id: string;
  name: string;
  count: number;
}

export interface MagnitudeRangeStat {
  range: string;
  min: number;
  max: number;
  count: number;
}

export interface StarStatistics {
  totalStars: number;
  enclosureStats: EnclosureStat[];
  magnitudeStats: MagnitudeRangeStat[];
  maxMagnitude: number;
  minMagnitude: number;
  avgMagnitude: number;
}

const MAGNITUDE_RANGES = [
  { range: '1等及更亮', min: -Infinity, max: 1.5 },
  { range: '1.5-2等', min: 1.5, max: 2.0 },
  { range: '2-2.5等', min: 2.0, max: 2.5 },
  { range: '2.5-3等', min: 2.5, max: 3.0 },
  { range: '3等及更暗', min: 3.0, max: Infinity },
];

export function calculateStatistics(
  stars: Star[],
  enclosures: Enclosure[],
): StarStatistics {
  const totalStars = stars.length;

  const enclosureStats: EnclosureStat[] = enclosures.map((enc) => ({
    id: enc.id,
    name: enc.name,
    count: stars.filter((s) => s.enclosureId === enc.id).length,
  }));

  const magnitudeStats: MagnitudeRangeStat[] = MAGNITUDE_RANGES.map((r) => ({
    ...r,
    count: stars.filter((s) => s.magnitude >= r.min && s.magnitude < r.max).length,
  }));

  const magnitudes = stars.map((s) => s.magnitude);
  const maxMagnitude = Math.max(...magnitudes);
  const minMagnitude = Math.min(...magnitudes);
  const avgMagnitude = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;

  return {
    totalStars,
    enclosureStats,
    magnitudeStats,
    maxMagnitude,
    minMagnitude,
    avgMagnitude,
  };
}
