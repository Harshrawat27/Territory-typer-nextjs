'use client';

export default function WorldMap({ territories = [], onTerritoryClick }) {
  // Get player color for a territory
  const getTerritoryColor = (territoryId) => {
    if (!territories || territories.length === 0) return '#eee';

    const territory = territories.find((t) => t.id === territoryId);
    if (!territory || !territory.owner) return '#eee';

    const player = territories.find((p) => p.id === territory.owner);
    return player?.color || '#eee';
  };

  return (
    <svg
      viewBox='0 0 1000 500'
      width='100%'
      height='100%'
      className='world-map'
    >
      {/* North America */}
      <path
        className='territory'
        id='north-america'
        d='M150,120 L200,100 L280,150 L250,200 L180,220 L120,200 Z'
        fill={getTerritoryColor('north-america')}
        stroke='#ccc'
        strokeWidth='2'
        onClick={() => onTerritoryClick && onTerritoryClick('north-america')}
      />

      {/* South America */}
      <path
        className='territory'
        id='south-america'
        d='M220,230 L260,250 L240,320 L190,340 L170,290 Z'
        fill={getTerritoryColor('south-america')}
        stroke='#ccc'
        strokeWidth='2'
        onClick={() => onTerritoryClick && onTerritoryClick('south-america')}
      />

      {/* Europe */}
      <path
        className='territory'
        id='europe'
        d='M420,120 L480,100 L510,140 L460,180 L430,160 Z'
        fill={getTerritoryColor('europe')}
        stroke='#ccc'
        strokeWidth='2'
        onClick={() => onTerritoryClick && onTerritoryClick('europe')}
      />

      {/* Africa */}
      <path
        className='territory'
        id='africa'
        d='M420,190 L490,190 L520,260 L480,320 L420,310 L390,250 Z'
        fill={getTerritoryColor('africa')}
        stroke='#ccc'
        strokeWidth='2'
        onClick={() => onTerritoryClick && onTerritoryClick('africa')}
      />

      {/* Asia */}
      <path
        className='territory'
        id='asia'
        d='M520,100 L650,120 L700,180 L620,250 L520,220 L490,170 Z'
        fill={getTerritoryColor('asia')}
        stroke='#ccc'
        strokeWidth='2'
        onClick={() => onTerritoryClick && onTerritoryClick('asia')}
      />

      {/* Oceania */}
      <path
        className='territory'
        id='oceania'
        d='M700,280 L750,290 L760,320 L730,350 L690,330 Z'
        fill={getTerritoryColor('oceania')}
        stroke='#ccc'
        strokeWidth='2'
        onClick={() => onTerritoryClick && onTerritoryClick('oceania')}
      />

      {/* Antarctica */}
      <path
        className='territory'
        id='antarctica'
        d='M300,400 L450,420 L600,410 L550,450 L350,450 Z'
        fill={getTerritoryColor('antarctica')}
        stroke='#ccc'
        strokeWidth='2'
        onClick={() => onTerritoryClick && onTerritoryClick('antarctica')}
      />
    </svg>
  );
}
