import React from 'react';

export const AtmosphericLayer: React.FC = () => {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atlas-watermark atlas-watermark--manhattan" />
      <div className="atlas-watermark atlas-watermark--brooklyn" />
      <div className="edge-vignette" />
    </div>
  );
};
