import React from 'react';

const Logo = ({ size = 40, color = "white" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }}
    >
      {/* Outer Management Ring */}
      <circle cx="50" cy="55" r="40" stroke={color} strokeWidth="6" strokeDasharray="180 40" />
      
      {/* The Central Drop */}
      <path 
        d="M50 20C50 20 25 50 25 68C25 81.8 36.2 93 50 93C63.8 93 75 81.8 75 68C75 50 50 20 50 20Z" 
        fill={color} 
      />
      
      {/* Interior Heartbeat/Connection Logic */}
      <path 
        d="M40 70H46L50 62L54 78L58 70H64" 
        stroke={color === "white" ? "#722F37" : "white"} 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};

export default Logo;