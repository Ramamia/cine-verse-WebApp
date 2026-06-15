import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Environment } from '@react-three/drei';

// ─── Per-genre config ─────────────────────────────────────────────────────────
const LOADING_DATA = {
  romcom: {
    text: 'ROMANTIC COMEDY',
    model: '/models/heart_ring.glb',
    scale: 2.3,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    bgImage: '/images/loadingBackgounds/romcom_bg.png',
    accent: '#ff69b4',
  },
  horror: {
    text: 'HORROR',
    model: '/models/skull.glb',
    scale: 4,
    position: [0, -0.9, 1],
    rotation: [0, 0, 0.2],
    bgImage: '/images/loadingBackgounds/horror_bg.png',
    accent: '#433636',
  },
  scifi: {
    text: 'SCI-FI',
    model: '/models/cyberpunk.glb',
    scale: 0.014,
    position: [0, -2, 1],
    rotation: [0, Math.PI, 0.5],
    bgImage: '/images/loadingBackgounds/scifi_bg.png',
    accent: '#00d4ff',
  },
};

// ─── Spinning 3-D prop ────────────────────────────────────────────────────────
function SpinningModel({ modelPath, scale, position, rotation }) {
  const { scene } = useGLTF(modelPath);
  const meshRef   = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 1.5;
  });

  return (
    <primitive
      ref={meshRef}
      object={scene}
      scale={scale    || 1}
      position={position || [0, 0, 0]}
      rotation={rotation || [0, 0, 0]}
    />
  );
}

// ─── Loading screen ───────────────────────────────────────────────────────────
export default function LoadingScreen({ genre }) {
  const current = LOADING_DATA[genre] ?? LOADING_DATA.romcom;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        backgroundImage: `url(${current.bgImage})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Dark radial overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.9) 100%)',
        zIndex: -1,
      }} />

      {/* 3-D spinning model */}
      <div style={{ width: '100%', height: '55vh' }}>
        <Canvas camera={{ position: [0, 0, 8] }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.7} />
            <pointLight position={[10, 10, 10]} intensity={2} color={current.accent} />
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
              <SpinningModel
                modelPath={current.model}
                scale={current.scale}
                position={current.position}
                rotation={current.rotation}
              />
            </Float>
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      {/* Text + progress bar */}
      <div style={{
        textAlign: 'center', background: 'rgba(0,0,0,0.7)', padding: '50px 0', width: '100%',
        backdropFilter: 'blur(10px)',
        borderTop:    `1px solid ${current.accent}`,
        borderBottom: `1px solid ${current.accent}`,
      }}>
        <h1 style={{
          color: '#fff', letterSpacing: '15px', fontSize: '1.4rem', margin: 0,
          textShadow: `0 0 20px ${current.accent}`,
        }}>
          LOADING {current.text}
        </h1>

        <div style={{
          width: '300px', height: '2px', background: 'rgba(255,255,255,0.1)',
          margin: '30px auto', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', background: current.accent, width: '100%',
            animation: 'loadingBar 10s linear forwards',
            boxShadow: `0 0 10px ${current.accent}`,
          }} />
        </div>

        <p style={{ color: '#fff', opacity: 0.6, fontSize: '0.7rem', letterSpacing: '4px' }}>
          PLEASE WAIT WHILE WE INITIALIZE THE VAULT
        </p>
      </div>

      <style>{`
        @keyframes loadingBar {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0%);    }
        }
      `}</style>
    </div>
  );
}
