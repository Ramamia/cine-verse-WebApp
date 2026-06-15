import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useKeyboard } from '../hooks/useKeyboard';

import { useAppContext } from '../contexts/AppContext';

function MoviePosterMesh({ movie, onSelect }) {
  const [texture, setTexture] = useState(null);
  
  React.useEffect(() => {
    const url = movie.poster_url || movie.poster;
    if (url) {
      new THREE.TextureLoader().load(
        url,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          setTexture(tex);
        },
        undefined,
        (err) => console.error("Error loading texture for", movie.title, err)
      );
    }
  }, [movie]);

  const [hovered, setHovered] = useState(false);
  const isLeft = movie.side === 'left';
  
  const posX = isLeft ? -4.92 : 4.92;
  const posY = 1.8;
  const rotY = isLeft ? Math.PI / 2 : -Math.PI / 2;
  
  const lightRef = React.useRef();
  useFrame(() => {
    if (lightRef.current) {
      // cool glitchy effect for the sci-fi vibe
      const baseIntensity = hovered ? 22 : 12;
      const flicker = Math.random() > 0.95 ? -6 : 0;
      lightRef.current.intensity = Math.max(0, baseIntensity + flicker);
    }
  });

  return (
    <group position={[posX, posY, movie.z]}>
      {/* techy yellow light around the poster */}
      <pointLight 
        ref={lightRef}
        position={[isLeft ? 0.8 : -0.8, 1.4, 0]} 
        intensity={12} 
        distance={6} 
        color="#ffd700"
        decay={1.8}
      />

      {/* pure white light so you can read it clearly */}
      <pointLight 
        position={[isLeft ? 0.3 : -0.3, 1.8, 0]} 
        intensity={4} 
        distance={5} 
        color="#ffffff"
        decay={2.5}
      />

      {/* the glowing frame border */}
      <mesh
        rotation={[0, rotY, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(movie)}
      >
        <boxGeometry args={[1.15, 1.65, 0.08]} />
        <meshStandardMaterial 
          color="#031520" 
          roughness={0.6} 
          metalness={0.8}
          emissive={hovered ? '#ffd700' : '#000000'}
          emissiveIntensity={hovered ? 0.8 : 0}
        />
      </mesh>

      {/* the actual movie poster */}
      {texture && (
        <mesh position={[isLeft ? 0.045 : -0.045, 0, 0]} rotation={[0, rotY, 0]}>
          <planeGeometry args={[1.05, 1.55]} />
          <meshStandardMaterial 
            map={texture} 
            roughness={0.3} 
            metalness={0.1} 
          />
        </mesh>
      )}

      {/* system access prompt on hover */}
      {hovered && (
        <Html distanceFactor={6} position={[0, -1.0, 0]} center transform rotation={[0, rotY, 0]}>
          <div style={{
            background: 'rgba(255, 215, 0, 0.9)',
            color: '#000',
            fontFamily: 'monospace',
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '2px',
            border: '1px solid #fff',
            whiteSpace: 'nowrap',
            letterSpacing: '1px',
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
            pointerEvents: 'none',
            textTransform: 'uppercase',
            fontWeight: 'bold'
          }}>
            SYSTEM: ACCESS DATA
          </div>
        </Html>
      )}
    </group>
  );
}

export default function ScifiRoom({ onSelectMovie }) {
  const { scifiMovies: MOVIES } = useAppContext();
  const { forward, backward } = useKeyboard();
  const [showEndSign, setShowEndSign] = useState(false);

  useFrame((state, delta) => {
    // standard first person controls
    const speed = 6;
    
    if (forward)  state.camera.position.z -= speed * delta;
    if (backward) state.camera.position.z += speed * delta;

    // fence them in so they stay inside the room boundaries
    state.camera.position.z = Math.max(-25, Math.min(12.5, state.camera.position.z));
    state.camera.position.x = 0; // lock X
    state.camera.position.y = 2; // lock Y

    // lock camera gaze forward
    state.camera.lookAt(0, 2, state.camera.position.z - 10);

    // show the warning sign if they get too deep
    setShowEndSign(state.camera.position.z < -20);
  });

  return (
    <group>
      {/* deep dark blue ambient light */}
      <ambientLight intensity={0.08} color="#102a50" />

      {/* overhead lights mapping out the corridor */}
      {[-25, -15, -5, 5, 12.5].map((zVal) => (
        <pointLight
          key={zVal}
          position={[0, 4.4, zVal]}
          intensity={6}
          distance={12}
          color="#1e5c43"
          decay={2}
        />
      ))}

      {/* metallic ceiling */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 4.5, -8.75]}>
        <planeGeometry args={[10, 43.5]} />
        <meshStandardMaterial color="#0a1c36" roughness={0.8} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* dark sci-fi floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, -8.75]}>
        <planeGeometry args={[10, 43.5]} />
        <meshStandardMaterial color="#061226" roughness={0.6} metalness={0.7} />
      </mesh>

      {/* left wall */}
      <mesh position={[-5, 1.8, -8.75]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[43.5, 6]} />
        <meshStandardMaterial color="#0c203f" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* right wall */}
      <mesh position={[5, 1.8, -8.75]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[43.5, 6]} />
        <meshStandardMaterial color="#0c203f" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* end of the hall barrier */}
      <mesh position={[0, 1.8, -30.5]} rotation={[0, 0, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#08162e" roughness={0.9} metalness={0.2} />
      </mesh>

      {/* holographic warning sign */}
      {showEndSign && (
        <Html position={[0, 2.0, -30.4]} center transform zIndexRange={[0, 0]}>
          <div style={{
            textAlign: 'center',
            color: '#00ff41',
            fontFamily: '"Courier New", Courier, monospace',
            textShadow: '0 0 10px #00ff41, 0 0 20px #00aa00',
            userSelect: 'none',
            pointerEvents: 'none',
            background: 'rgba(0,20,0,0.8)',
            padding: '20px',
            border: '2px solid #00ff41'
          }}>
            <h1 style={{ fontSize: '32px', margin: '0 0 10px 0', letterSpacing: '6px', fontWeight: 'bold' }}>SYSTEM WARNING</h1>
            <p style={{
              fontSize: '12px',
              color: '#00cc33',
              letterSpacing: '2px',
              margin: 0,
              maxWidth: '300px',
              lineHeight: '1.5'
            }}>
              RESTRICTED AREA.
              <br/>
              NO FURTHER DATA AVAILABLE.
              <br/>
              TURN BACK IMMEDIATELY.
            </p>
          </div>
        </Html>
      )}

      {/* entrance wall right behind you */}
      <mesh position={[0, 1.8, 13.0]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#0a1c36" roughness={1.0} />
      </mesh>

      {/* spit out all the movies */}
      {MOVIES.map((movie, index) => (
        <MoviePosterMesh
          key={movie.id}
          movie={movie}
          index={index}
          onSelect={onSelectMovie}
        />
      ))}

      {/* cool floating data sparks */}
      <Sparkles count={150} scale={15} size={1.2} speed={0.8} color="#00ff41" />
      <Sparkles count={100} scale={15} size={1.0} speed={0.5} color="#00aaff" />
    </group>
  );
}
