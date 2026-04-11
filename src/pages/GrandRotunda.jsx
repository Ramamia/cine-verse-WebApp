import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float, Html, Sparkles } from '@react-three/drei';

// Add enterGenrePortal here
export default function GrandRotunda({ config, enterGenrePortal }) {  if (!config) return null; 

  const [hoveredGenre, setHoveredGenre] = useState(null);
  const compassRef = useRef();

  const { scene: compass } = useGLTF('/models/compass_floor.glb');
  const { scene: romcomDoor } = useGLTF('/models/romcom_door2.glb');
  const { scene: horrorDoor } = useGLTF('/models/horror_door2.glb');
  const { scene: scifiDoor } = useGLTF('/models/scifi_door2.glb');

  useFrame((state, delta) => {
    if (compassRef.current) compassRef.current.rotation.y += 0.15 * delta;
  });

  const genres = [
    { 
      id: 'romcom', 
      name: 'ROM-COM', 
      desc: 'Love, digital style. Find your cinematic match.', 
      color: 'rgb(160, 31, 117)', 
      model: romcomDoor, 
      pos: [-5, 0, -8],
      scale: 5,
      rotY: -5.7,
      lightPos: [0, -1, 3],
      popupPos: [-1, 5.5, -5]
    },
    { 
      id: 'horror', 
      name: 'HORROR', 
      desc: 'Face the glitches in the dark. Dare to enter?', 
      color: '#433636', 
      model: horrorDoor, 
      pos: [-3, 0, -6],
      rotY: 0,
      lightPos: [9, 1, 1.2],
      popupPos: [9, 5.5, 0]
    },
    { 
      id: 'scifi', 
      name: 'SCI-FI', 
      desc: 'Beyond the code. Explore the future of film.', 
      color: '#00d4ff', 
      model: scifiDoor, 
      pos: [0, 0, -11],
      rotY: 5.9,
      lightPos: [15.5, 5, 7],
      popupPos: [15.5, 5.5, 7]
    }
  ];
React.useEffect(() => {
  if (compass) {
    compass.traverse((child) => {
      if (child.isMesh) {
        child.material.transparent = true;
        child.material.opacity = 0.1;
      }
    });
  }
}, [compass]);

  return (
    <group>
      {/* 1. COMPASS FLOOR */}
      <primitive 
        ref={compassRef} 
        object={compass} 
        position={[4.8, 19, -5]} 
        scale={30.2} 
      />

      {/* 2. GLB DOORS */}
      {genres.map((g) => (
        <group 
          key={g.id} 
          position={g.pos}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredGenre(g);
          }}
          onPointerOut={() => setHoveredGenre(null)}
onClick={() => enterGenrePortal(g.id)}
        >
          <pointLight 
            position={g.lightPos || [0, 4, 2]} 
            intensity={300} 
            color={g.color} 
            distance={15} 
            decay={2} 
          />
          <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.6}>
            <primitive object={g.model.clone()} scale={2.6} rotation={[0, g.rotY || 0, 0]} />
          </Float>
          
          {/* 3. POPUP ANCHORED TO DOOR */}
          {hoveredGenre?.id === g.id && (
            <Html 
              distanceFactor={12} 
              /* FIX: [0, height, 0] ensures it is centered horizontally 
                 on the door even as you move the camera. 
              */
              position={g.popupPos || [0, 4, 0]} // Uses the specific X, Y, Z from the array
              center
              transform
              sprite={false}
            >
              <div style={{
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                padding: '15px 25px',
                borderLeft: `3px solid ${g.color}`,
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                boxShadow: `0 0 40px ${g.color}33`,
                width: '180px',
                pointerEvents: 'auto',
                cursor: 'pointer',
                fontFamily: '"Courier New", Courier, monospace',
                transition: '0.2s ease-in-out',
                transformStyle: 'preserve-3d',
                userSelect: 'none'
              }}
              onClick={(e) => {
                  e.stopPropagation(); // Stop click from hitting things behind it
                  enterGenrePortal(g.id);
                }}>
                <h3 style={{ margin: 0, letterSpacing: '5px', fontSize: '1rem' }}>{g.name}</h3>
                <h4 style={{ margin: '5px 0', fontSize: '0.75rem', opacity: 0.8, fontWeight: 'normal' }}>{g.desc}</h4>
                <div style={{ height: '1px', background: g.color, margin: '10px 0', opacity: 0.5 }} />
                <p style={{ fontSize: '0.65rem', opacity: 0.7, margin: 0, color: g.color, fontWeight: 'bold' }}>ENTER PORTAL</p>
              </div>
            </Html>
          )}
        </group>
      ))}

      <Sparkles count={200} scale={25} size={1.5} speed={0.6} color="#760707" />
    </group>
  );
}

// --- POPUP STYLES ---
const popupStyle = (color) => ({
  background: 'rgba(5, 0, 0, 0.5)',
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
  transition: '0.2s ease-in-out'
});

const popupTitle = { margin: '0 0 10px 0', letterSpacing: '5px', fontSize: '1.2rem', fontWeight: 'bold' };
const popupDesc = { fontSize: '0.75rem', opacity: 0.7, lineHeight: '1.4', margin: 0 };

const pulseEffect = (color) => ({
  position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)',
  width: '12px', height: '12px', background: color, borderRadius: '50%', filter: 'blur(8px)',
  animation: 'pulse 2s infinite'
});