import React, { useState, useEffect, useRef } from 'react';
import NET from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';

const ThreeDBackground = ({ children }) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE: THREE,
          color: 0x0077ff,
          backgroundColor: 0x1a1a1a,
          points: 10.0,
          maxDistance: 20.0,
          spacing: 15.0,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div ref={vantaRef} style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ color: '#fff', paddingTop: '20px', textAlign: 'center' }}>
          {children}
        </p>
      </div>
    </div>
  );
};

export default ThreeDBackground;
