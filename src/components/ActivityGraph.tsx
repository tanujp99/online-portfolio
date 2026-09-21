'use client';

import { useEffect, useState } from 'react';
import { buildActivityGraph, selectRecentDays, Colors, ContributionDay } from '@/lib/activityGraph';

// Same colors the old github-readme-activity-graph URLs asked for
const lightColors: Colors = {
  areaColor: 'E3F2FD',
  bgColor: 'eef0f2',
  borderColor: 'ffffff',
  color: '212121',
  titleColor: '212121',
  lineColor: 'a3cfb4',
  pointColor: 'c30b4e',
};

// The service's "material" theme
const darkColors: Colors = {
  areaColor: '80cbc4',
  bgColor: '263238',
  borderColor: 'ffffff',
  color: '80cbc4',
  titleColor: '80cbc4',
  lineColor: '80cbc4',
  pointColor: 'ffab91',
};

let cachedDays: ContributionDay[] | null = null;

interface ActivityGraphProps {
  username: string;
  name: string;
  theme: string;
}

export default function ActivityGraph({ username, name, theme }: ActivityGraphProps) {
  const [days, setDays] = useState<ContributionDay[] | null>(cachedDays);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (cachedDays) return;
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then((response) => {
        if (!response.ok) throw new Error(`Contributions API responded with ${response.status}`);
        return response.json();
      })
      .then((data) => {
        cachedDays = selectRecentDays(data.contributions);
        setDays(cachedDays);
      })
      .catch((error) => console.error('Error fetching contributions:', error));
  }, [username]);

  useEffect(() => {
    if (!days) return;
    let cancelled = false;
    buildActivityGraph(days, theme === 'light' ? lightColors : darkColors, `${name}'s Contribution Graph`)
      .then((svg) => {
        if (!cancelled) setSrc(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
      })
      .catch((error) => console.error('Error rendering activity graph:', error));
    return () => {
      cancelled = true;
    };
  }, [days, theme, name]);

  if (!src) return null;

  return (
    <img
      src={src}
      alt="Activity Graph"
      className="w-full rounded-card"
      style={{ clipPath: 'inset(2px)' }}
    />
  );
}
