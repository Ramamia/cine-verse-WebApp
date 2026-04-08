import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, MeshReflectorMaterial, Environment, OrbitControls } from '@react-three/drei';
import Entrance from './pages/Entrance';
import CharacterCreator from './pages/CharacterCreator';
import GrandRotunda from './pages/GrandRotunda'; 
import AuthModal from './components/ui/AuthModal';
import Header from './components/ui/Header';
import CustomizePanel from './components/ui/CustomizePanel.jsx';

function App() {
  const [step, setStep] = useState('entrance'); 
  const [config, setConfig] = useState({ 
    acc: null, 
    hair: null, 
    skin: '#ffdbac' 
  });

  // Dynamic environment settings based on the room
  const roomSettings = {
    entrance: { 
      bg: '#160101', 
      fogNear: 5, 
      fogFar: 25, 
      camPos: [2, 7, 13] 
    },
    customize: { 
      bg: '#050000', 
      fogNear: 2, 
      fogFar: 15, 
      camPos: [0, 4, 10] 
    },
    hub: { 
      bg: '#1f1919', 
      fogNear: 10, 
      fogFar: 40, 
      camPos: [0, 5, 12] 
    }
  };

  const currentSettings = roomSettings[step] || roomSettings.hub;

  const handleSearch = (val) => {
    console.log("Searching TMDB for:", val);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#000' }}>
      
      {/* UI LAYER */}
      {step === 'entrance' && (
        <>
          <Header />
          <AuthModal onLogin={() => setStep('customize')} />
        </>
      )}

      {step === 'customize' && (
        <>
          <div style={customizeHeader}>
            <h1 style={titleStyle}>DESIGN YOUR IDENTITY</h1>
          </div>
          <CustomizePanel 
            config={config} 
            setConfig={setConfig} 
            onFinish={() => setStep('hub')} 
          />
        </>
      )}

      {step === 'hub' && (
        <>
          <div style={sidePanelStyle}>
            <h4 style={panelHeader}>CINE-SOCIAL</h4>
            <div style={feedItem}>
              <div style={userRow}><b>Joudeh</b> <span style={ratingStyle}>★ 4.5</span></div>
              <p style={commentStyle}>"The twist in Scream 6 blew my mind!"</p>
            </div>
            <div style={feedItem}>
              <div style={userRow}><b>Lilia</b> <span style={ratingStyle}>★ 5.0</span></div>
              <p style={commentStyle}>"Interstellar is still a masterpiece."</p>
            </div>
            <div style={feedItem}>
              <div style={userRow}><b>Abdelrahman</b> <span style={ratingStyle}>★ 3.0</span></div>
              <p style={commentStyle}>"Sci-fi lobby is a bit crowded today."</p>
            </div>
          </div>

          <div style={searchWrapper}>
             <input 
               type="text" 
               placeholder="DISCOVER CINEMA..." 
               style={searchField} 
               onChange={(e) => handleSearch(e.target.value)}
             />
             <div style={searchAccent} />
          </div>
        </>
      )}
      
      <Canvas 
        shadows 
        // Camera position now updates when the step changes
        camera={{ position: currentSettings.camPos, fov: 50 }}
      >
        <color attach="background" args={[currentSettings.bg]} />
        <fog attach="fog" args={[currentSettings.bg, currentSettings.fogNear, currentSettings.fogFar]} />

        {/* OrbitControls enabled only in the hub for free movement */}
        {step === 'hub' && (
          <OrbitControls 
            enablePan={false} 
            maxPolarAngle={Math.PI / 2.1} 
            minDistance={5} 
            maxDistance={20} 
          />
        )}

        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          
          {/* Main lighting adjusts slightly for the Hub */}
          <spotLight position={[0, 10, 0]} intensity={step === 'hub' ? 30 : 20} angle={0.5} penumbra={1} castShadow />

          {step === 'entrance' && <Entrance />}
          {step === 'customize' && <CharacterCreator config={config} />}
          {step === 'hub' && <GrandRotunda config={config} />}

          {/* Floor remains consistent but changes color with environment */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[100, 100]} />
            <MeshReflectorMaterial
              blur={[400, 100]}
              resolution={1024}
              mixBlur={1}
              mixStrength={40}
              roughness={1}
              color={step === 'hub' ? "#696666" : "#312b2b"}
              metalness={0.5}
            />
          </mesh>
          <Environment preset="night" />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
}

// Ensure searchWrapper and other new styles are included
const searchWrapper = { position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, width: '450px' };
const searchField = { width: '100%', background: 'rgba(0,0,0,0.8)', border: '1px solid #760707', padding: '15px 30px', color: '#fff', letterSpacing: '4px', outline: 'none', backdropFilter: 'blur(10px)', fontSize: '0.7rem', textAlign: 'center' };
const searchAccent = { width: '60px', height: '2px', background: '#760707', margin: '0 auto', boxShadow: '0 0 10px #760707' };

const sidePanelStyle = { position: 'absolute', left: '30px', top: '50%', transform: 'translateY(-50%)', width: '280px', background: 'rgba(10, 0, 0, 0.7)', padding: '25px', borderRadius: '2px', borderLeft: '3px solid #760707', zIndex: 100, backdropFilter: 'blur(10px)' };
const panelHeader = { color: '#760707', letterSpacing: '5px', marginBottom: '25px', fontSize: '0.8rem' };
const feedItem = { marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #222' };
const userRow = { display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '0.75rem', marginBottom: '5px' };
const ratingStyle = { color: '#ffd700', fontSize: '0.65rem' };
const commentStyle = { color: '#999', fontSize: '0.7rem', margin: 0, fontStyle: 'italic', lineHeight: '1.4' };

const customizeHeader = { position: 'absolute', top: '40px', left: '40px', zIndex: 10 };
const titleStyle = { color: '#fff', fontSize: '2rem', letterSpacing: '10px', fontWeight: '900', textShadow: '0 0 20px rgba(118, 7, 7, 0.5)' };

const subtitleStyle = { color: '#888', letterSpacing: '3px', fontSize: '0.8rem', marginTop: '10px', textTransform: 'uppercase', fontWeight: 'bold' };
const hubOverlay = { position: 'absolute', top: '10%', width: '100%', textAlign: 'center', zIndex: 10, pointerEvents: 'none' };
const hubTitle = { color: '#fff', fontSize: '1.5rem', letterSpacing: '15px', fontWeight: 'bold' };

export default App;