import React from 'react';
export default function DestinationScene({ scene = 'mountain', className = '' }) {
  const colors = {
    desert: ['#eed8ba', '#e6b678', '#b36b4b', '#714b43'],
    mountain: ['#d5e4df', '#f4dfac', '#6d9993', '#285c59'],
    andes: ['#dedec6', '#f0cb83', '#87977b', '#445f51'],
    beach: ['#cfe9e6', '#f7dd96', '#70aba2', '#2d6d69'],
    city: ['#e0ddd2', '#edc481', '#a2957e', '#4d6961'],
    island: ['#d7e6dc', '#efdb9c', '#87a28d', '#3e6d5c'],
  };
  const c = colors[scene] || colors.mountain;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 360"
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <rect width="600" height="360" fill={c[0]} />
      <circle cx="445" cy="95" r="46" fill={c[1]} />
      {scene === 'city' ? (
        <>
          <path
            d="M0 240H75V152H125V240H155V105H230V240H260V170H345V240H380V130H425V240H455V190H525V240H600V360H0Z"
            fill={c[2]}
          />
          <path
            d="M168 105V82H217V105M188 82V55M390 130V110H415V130"
            stroke={c[3]}
            strokeWidth="8"
            fill="none"
          />
          <path d="M0 284Q160 240 300 280T600 280V360H0Z" fill={c[3]} />
        </>
      ) : (
        <>
          <path d="M-30 280 135 95 240 245 330 122 485 277 610 195V360H0Z" fill={c[2]} />
          {scene === 'mountain' && (
            <path d="m91 144 44-49 48 67-35-13-20 7-12-17Z" fill="#f8f9ef" />
          )}
          <path d="M-20 314Q120 220 255 300T620 268V380H0Z" fill={c[3]} />
          <path
            d="M-10 342Q160 290 320 330T610 314"
            stroke={c[0]}
            strokeOpacity=".45"
            strokeWidth="2"
            fill="none"
          />
        </>
      )}
      {scene === 'beach' && (
        <>
          <path d="M0 245Q150 205 300 255T600 240V360H0Z" fill="#6daaa3" />
          <path d="M0 300Q170 258 300 305T600 290" stroke="#e8f4e7" strokeWidth="4" fill="none" />
          <path
            d="M92 300Q105 210 95 169M95 170Q45 130 35 177M95 170Q137 130 165 174M95 170Q63 162 55 205"
            stroke="#335f51"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}
      {scene === 'desert' && (
        <path
          d="M52 290V205M52 242Q28 242 28 218M52 256Q76 256 76 228"
          stroke="#6f7252"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
      )}
      <path d="m305 78 17-7-7 17-3-7-7-3Z" fill={c[3]} opacity=".6" />
    </svg>
  );
}
