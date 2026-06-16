import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useKeyboard } from '../hooks/useKeyboard';

import { useAppContext } from '../contexts/AppContext';

function MoviePosterMesh({ movie, index, onSelect }) {
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
  
  // alternate some cute pink shades for the dreamy vibe
  const lightColor = index % 2 === 0 ? '#ff69b4' : '#ff85c8';

  const lightRef = React.useRef();
  useFrame((state) => {
    if (lightRef.current) {
      // gentle pulsing glow to make it feel romantic
      const baseIntensity = hovered ? 24 : 14;
      const pulse = Math.sin(state.clock.getElapsedTime() * 2 + index) * 2;
      lightRef.current.intensity = Math.max(0, baseIntensity + pulse);
    }
  });

  return (
    <group position={[posX, posY, movie.z]}>
      {/* soft pink glow around the poster */}
      <pointLight 
        ref={lightRef}
        position={[isLeft ? 0.8 : -0.8, 1.4, 0]} 
        intensity={14} 
        distance={6} 
        color={lightColor}
        decay={1.8}
      />

      {/* clean white light so the poster is actually visible */}
      <pointLight 
        position={[isLeft ? 0.3 : -0.3, 1.8, 0]} 
        intensity={5} 
        distance={5} 
        color="#ffffff"
        decay={2.5}
      />

      {/* the frame you actually click on */}
      <mesh
        rotation={[0, rotY, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(movie)}
      >
        <boxGeometry args={[1.15, 1.65, 0.08]} />
        <meshStandardMaterial 
          color="#ffffff" 
          roughness={0.5} 
          metalness={0.1}
          emissive={hovered ? '#ff69b4' : '#ffffff'}
          emissiveIntensity={hovered ? 0.6 : 0.1}
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

      {/* popup label when hovering */}
      {hovered && (
        <Html distanceFactor={6} position={[0, -1.0, 0]} center transform rotation={[0, rotY, 0]}>
          <div style={{
            background: 'rgba(255, 105, 180, 0.9)',
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '12px',
            border: '1px solid #ffb6d9',
            whiteSpace: 'nowrap',
            letterSpacing: '1px',
            boxShadow: '0 0 10px rgba(255, 105, 180, 0.6)',
            pointerEvents: 'none',
            textTransform: 'uppercase',
            fontWeight: 'bold'
          }}>
            CLICK FOR DETAILS
          </div>
        </Html>
      )}
    </group>
  );
}

export default function RomComRoom({ onSelectMovie }) {
  const { romcomMovies: MOVIES } = useAppContext();
  const { forward, backward } = useKeyboard();
  const [showEndSign, setShowEndSign] = useState(false);

  useFrame((state, delta) => {
    const speed = 6;
    
    // handle walking back and forth
    if (forward)  state.camera.position.z -= speed * delta;
    if (backward) state.camera.position.z += speed * delta;

    // keep them locked in the hallway so they don't wander off into the void
    state.camera.position.z = Math.max(-33, Math.min(12.5, state.camera.position.z));
    state.camera.position.x = 0; // stay in the middle
    state.camera.position.y = 2; // stay at eye level

    // always look straight ahead down the hall
    state.camera.lookAt(0, 2, state.camera.position.z - 10);

    // only show the happily ever after sign when they get close
    setShowEndSign(state.camera.position.z < -28);
  });

  return (
    <group>
      {/* nice warm ambient lighting */}
      <ambientLight intensity={0.06} color="#ffe0f0" />

      {/* line of pink ceiling lights down the corridor */}
      {[-30, -20, -10, 0, 10].map((zVal) => (
        <pointLight
          key={zVal}
          position={[0, 4.4, zVal]}
          intensity={8}
          distance={14}
          color="#ff69b4"
          decay={2}
        />
      ))}

      {/* the ceiling */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 4.5, -8.75]}>
        <planeGeometry args={[10, 70]} />
        <meshStandardMaterial color="#fff0f5" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* the floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, -8.75]}>
        <planeGeometry args={[10, 70]} />
        <meshStandardMaterial color="#fffafa" roughness={0.7} />
      </mesh>

      {/* left wall */}
      <mesh position={[-5, 1.8, -8.75]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[70, 6]} />
        <meshStandardMaterial color="#fff0f5" roughness={0.9} />
      </mesh>

      {/* right wall */}
      <mesh position={[5, 1.8, -8.75]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[70, 6]} />
        <meshStandardMaterial color="#fff0f5" roughness={0.9} />
      </mesh>

      {/* wall at the end of the hall */}
      <mesh position={[0, 1.8, -43.75]} rotation={[0, 0, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshBasicMaterial color="#fff0f5" />
      </mesh>

      {/* cute sign at the very end */}
      {showEndSign && (
        <Html position={[0, 2.0, -43.65]} center transform zIndexRange={[0, 0]}>
          <div style={{
            textAlign: 'center',
            color: '#ff69b4',
            fontFamily: '"Comic Sans MS", "Segoe UI", sans-serif',
            textShadow: '0 0 10px #ffffff, 0 0 20px #ffb6d9',
            userSelect: 'none',
            pointerEvents: 'none',
          }}>
            <h1 style={{ fontSize: '24px', margin: '0 0 10px 0', letterSpacing: '4px', fontWeight: 'bold' }}>HAPPILY EVER AFTER</h1>
            <p style={{
              fontSize: '10px',
              color: '#ff69b4',
              fontFamily: '"Segoe UI", sans-serif',
              letterSpacing: '1px',
              margin: 0,
              fontStyle: 'italic',
              maxWidth: '300px',
              lineHeight: '1.5'
            }}>
              Every great love story must come to an end, but yours is just beginning...
            </p>
          </div>
        </Html>
      )}

      {/* wall behind you where you spawn */}
      <mesh position={[0, 1.8, 13.0]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshBasicMaterial color="#fff0f5" />
      </mesh>

      {/* loop through all our romcoms and put them on the walls */}
      {MOVIES.map((movie, index) => (
        <MoviePosterMesh
          key={movie.id}
          movie={movie}
          index={index}
          onSelect={onSelectMovie}
        />
      ))}

      {/* lots of dreamy pink and white sparkles */}
      <Sparkles count={200} scale={18} size={1.5} speed={0.3} color="#ff69b4" />
      <Sparkles count={100} scale={15} size={0.8} speed={0.5} color="#ffffff" />
    </group>
  );
}
