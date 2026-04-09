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
  const [selectedGenre, setSelectedGenre] = useState('ALL');
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

  const getGenreColor = (genre) => {
  switch(genre) {
    case 'ROM-COM': return '#ff69b4';
    case 'HORROR': return '#433636';
    case 'SCI-FI': return '#00d4ff';
    default: return '#760707'; // Cine-Verse Red
  }
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
              <div style={userRow}><b>Lara</b> <span style={ratingStyle}>★ 4.5</span></div>
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

{/* COOLER SEARCH BAR WITH INTEGRATED FILTERS */}
<div style={searchWrapper}>
      <div style={searchGlassContainer}>
        <input 
          type="text" 
          placeholder={`SEARCHING ${selectedGenre === 'ALL' ? 'CINEMA' : selectedGenre}...`} 
          style={searchField} 
          onChange={(e) => handleSearch(e.target.value)}
        />
        
        {/* CLICKABLE FILTER BAR */}
        <div style={filterBar}>
          {['ALL', 'ROM-COM', 'HORROR', 'SCI-FI'].map((genre) => (
            <div 
              key={genre} 
              onClick={() => setSelectedGenre(genre)}
              style={{
                ...filterTab, 
                color: selectedGenre === genre ? getGenreColor(genre) : '#555',
                borderBottom: selectedGenre === genre ? `1px solid ${getGenreColor(genre)}` : '1px solid transparent'
              }}
            >
              {genre}
            </div>
          ))}
        </div>
      </div>
      <div style={{...searchAccent, background: getGenreColor(selectedGenre), boxShadow: `0 0 15px ${getGenreColor(selectedGenre)}` }} />
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

{step === 'entrance' && (
  <OrbitControls 
    enablePan={false}
    enableZoom={false}
    enableRotate={true}
    
    // 1. PUSH THE CAMERA TO THE BACK OF THE UNIVERSE
    // If 80 didn't work, we jump to 150-200
    minDistance={180} 
    maxDistance={200} 

    // 2. ADJUST THE TARGET
    // Setting Z to 0 and Y higher to frame the booth from far away
    target={[-2, 10, 5]}

    // 3. KEEP ROTATION TIGHT
    minAzimuthAngle={-Math.PI / 16} 
    maxAzimuthAngle={Math.PI / 16} 
    minPolarAngle={Math.PI / 2.5} 
    maxPolarAngle={Math.PI / 2.1} 
  />
)}


        {/* OrbitControls enabled only in the hub for free movement */}
{step === 'hub' && (
  <OrbitControls 
    enablePan={false} 
    // Limits looking up and down significantly
    maxPolarAngle={Math.PI / 2.2} 
    minPolarAngle={Math.PI / 2.5}
    minDistance={10} 
    maxDistance={16} 
    target={[3.5, 4, 2]}
    enableRotate={true}
    // Limits rotation to a very small left/right nudge
    minAzimuthAngle={-Math.PI / 12} 
    maxAzimuthAngle={Math.PI / 12}
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

const searchWrapper = { 
  position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', 
  zIndex: 100, width: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' 
};

const searchGlassContainer = {
  width: '100%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)', 
  border: '1px solid rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '4px',
  boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
};

const filterBar = { 
  display: 'flex', justifyContent: 'center', gap: '25px', marginTop: '5px', 
  padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.05)' 
};

const filterTab = {
  fontSize: '0.65rem', letterSpacing: '2px', cursor: 'pointer', transition: '0.3s all ease',
  fontWeight: 'bold', textTransform: 'uppercase', paddingBottom: '4px'
};
const searchField = { 
  width: '100%', background: 'transparent', border: 'none', padding: '15px 0', 
  color: '#fff', letterSpacing: '4px', outline: 'none', fontSize: '0.8rem', 
  textAlign: 'center' 
};
const searchAccent = { 
  width: '100px', height: '2px', marginTop: '12px', transition: '0.5s all ease' 
};

const sidePanelStyle = { position: 'absolute', left: '20px',height: '35%', top: '75%', transform: 'translateY(-50%)', width: '260px', background: 'rgba(10, 0, 0, 0.4)', padding: '23px', borderRadius: '2px', borderLeft: '4px solid #760707', zIndex: 100, backdropFilter: 'blur(10px)' };
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