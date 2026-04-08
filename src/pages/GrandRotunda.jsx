import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float, Html, Sparkles } from '@react-three/drei';
import Avatar from '../components/3d/Avatar';
import { scale } from 'framer-motion';

export default function GrandRotunda({ config }) {
  const [hoveredGenre, setHoveredGenre] = useState(null);
  const compassRef = useRef();

  // Load your GLB assets
  const { scene: compass } = useGLTF('/models/compass_floor.glb');
  const { scene: romcomDoor } = useGLTF('/models/romcom_door2.glb');
  const { scene: horrorDoor } = useGLTF('/models/horror_door2.glb');
  const { scene: scifiDoor } = useGLTF('/models/scifi_door2.glb');

  // Rotate the compass floor slowly
  useFrame((state, delta) => {
    if (compassRef.current) compassRef.current.rotation.y += 0.15 * delta;
  });

  const genres = [
    { 
      id: 'romcom', 
      name: 'ROM-COM', 
      desc: 'Love, digital style. Find your cinematic match.', 
      color: '#ff69b4', 
      model: romcomDoor, 
      pos: [-7, 0, -8] 
    },
    { 
      id: 'horror', 
      name: 'HORROR', 
      desc: 'Face the glitches in the dark. Dare to enter?', 
      color: '#760707', 
      model: horrorDoor, 
      pos: [0, 0, -11] ,
      scale: 4.8
    },
    { 
      id: 'scifi', 
      name: 'SCI-FI', 
      desc: 'Beyond the code. Explore the future of film.', 
      color: '#00d4ff', 
      model: scifiDoor, 
      pos: [7, 0, -8] 
    }
  ];

  return (
    <group>
      {/* 1. COMPASS FLOOR */}
      <primitive 
        ref={compassRef} 
        object={compass} 
        position={[0, 2.9, 10]} 
        scale={9.2} 
      />

      {/* 2. GLB DOORS WITH HOVER LOGIC */}
      {genres.map((g) => (
        <group 
          key={g.id} 
          position={g.pos}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredGenre(g);
          }}
          onPointerOut={() => setHoveredGenre(null)}
          onClick={() => console.log(`Entering ${g.name} Portal...`)}
        >
          <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.6}>
            <primitive object={g.model.clone()} scale={1.5} />
          </Float>
          
          {/* 3. COOL GENRE POPUP */}
// Change the popup return in GrandRotunda.jsx to look sleeker:
{hoveredGenre?.id === g.id && (
  <Html distanceFactor={10} position={[0, 4, 0]} center>
    <div style={{
      background: 'rgba(0,0,0,0.4)',
      color: 'white',
      padding: '15px 25px',
      borderLeft: `3px solid ${g.color}`,
      textAlign: 'center',
      backdropFilter: 'blur(10px)',
      boxShadow: `0 0 40px ${g.color}33`,
      width: '180px'
    }}>
      <h3 style={{ margin: 0, letterSpacing: '5px', fontSize: '1rem' }}>{g.name}</h3>
      <h4 style={{ margin: '5px 0', fontSize: '0.75rem', opacity: 0.8  ,fontWeight: 'normal'}}>{g.desc}</h4>
      <div style={{ height: '1px', background: g.color, margin: '10px 0', opacity: 0.5 }} />
      <p style={{ fontSize: '0.65rem', opacity: 0.7, margin: 0 , color: g.color , fontWeight: 'bold'}}>ENTER PORTAL</p>
    </div>
  </Html>
)}
        </group>
      ))}

      {/* 4. PLAYER AVATAR - Center Hub Position */}
      <group position={[0, -1, -1]} rotation={[0, Math.PI, 0]}>
        <Avatar config={config} />
      </group>

      {/* CINEMATIC SPARKLES */}
      <Sparkles count={200} scale={25} size={1.5} speed={0.6} color="#760707" />
    </group>
  );
}

// --- POPUP STYLES ---
const popupStyle = (color) => ({
  background: 'rgba(5, 0, 0, 0.9)',
  color: 'white',
  padding: '25px',
  borderRadius: '2px',
  borderLeft: `4px solid ${color}`,
  width: '220px',
  textAlign: 'center',
  backdropFilter: 'blur(15px)',
  boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 15px ${color}33`,
  pointerEvents: 'none',
  fontFamily: '"Courier New", Courier, monospace',
  transition: '0.3s ease-in-out'
});

const popupTitle = { margin: '0 0 10px 0', letterSpacing: '5px', fontSize: '1.2rem', fontWeight: 'bold' };
const popupDesc = { fontSize: '0.75rem', opacity: 0.7, lineHeight: '1.4', margin: 0 };

const pulseEffect = (color) => ({
  position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)',
  width: '12px', height: '12px', background: color, borderRadius: '50%', filter: 'blur(8px)',
  animation: 'pulse 2s infinite'
});