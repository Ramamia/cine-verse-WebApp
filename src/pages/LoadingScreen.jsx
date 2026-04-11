import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Environment } from '@react-three/drei';

function SpinningModel({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  const modelRef = React.useRef();

  useFrame((state, delta) => {
    modelRef.current.rotation.y += delta * 2; // Spinning speed
  });

  return <primitive ref={modelRef} object={scene} scale={2} />;
}

export default function LoadingScreen({ genre }) {
  const config = {
    romcom: { img: '/images/romcom_bg.jpg', model: '/models/heart_ring.glb', text: 'ROMANTIC COMEDY' },
    horror: { img: '/images/horror_bg.jpg', model: '/models/skull.glb', text: 'HORROR' },
    scifi: { img: '/images/scifi_bg.jpg', model: '/models/cyberpunk.glb', text: 'SCIENCE FICTION' }
  };

  const current = config[genre] || config.romcom;

  return (
    <div style={{ ...loadingOverlay, backgroundImage: `url(${current.img})` }}>
      <div style={loadingContent}>
        <div style={{ height: '400px', width: '100%' }}>
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Suspense fallback={null}>
              <ambientLight intensity={1} />
              <SpinningModel modelPath={current.model} />
              <Environment preset="night" />
            </Suspense>
          </Canvas>
        </div>
        <h1 style={loadingText}>LOADING {current.text}...</h1>
        <div style={progressBarContainer}><div style={progressBarFill} /></div>
      </div>
    </div>
  );
}

const loadingOverlay = { position: 'fixed', inset: 0, zIndex: 1000, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const loadingContent = { textAlign: 'center', background: 'rgba(0,0,0,0.7)', padding: '50px', borderRadius: '10px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' };
const loadingText = { color: '#fff', letterSpacing: '8px', fontSize: '1.2rem', marginTop: '20px' };
const progressBarContainer = { width: '300px', height: '2px', background: '#333', margin: '20px auto', overflow: 'hidden' };
const progressBarFill = { height: '100%', background: '#760707', width: '100%', animation: 'load 10s linear' };