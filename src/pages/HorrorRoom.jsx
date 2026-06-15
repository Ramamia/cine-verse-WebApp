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
  
  // offset the poster a bit from the walls so it doesn't clip
  const posX = isLeft ? -4.92 : 4.92;
  const posY = 1.8;
  const rotY = isLeft ? Math.PI / 2 : -Math.PI / 2;
  
  // swap between two creepy colors for the cinematic vibe
  const lightColor = index % 2 === 0 ? '#760707' : '#a55d0f';

  const lightRef = React.useRef();
  useFrame((state) => {
    if (lightRef.current) {
      // make the light flicker above the poster for that spooky feel
      const baseIntensity = hovered ? 28 : 18;
      const flicker = Math.sin(state.clock.getElapsedTime() * 12 + index) * 3;
      // throw in a random blackout glitch sometimes
      const glitch = Math.random() > 0.97 ? -12 : 0;
      lightRef.current.intensity = Math.max(0, baseIntensity + flicker + glitch);
    }
  });

  return (
    <group position={[posX, posY, movie.z]}>
      {/* creepy flickering light to set the mood */}
      <pointLight 
        ref={lightRef}
        position={[isLeft ? 0.8 : -0.8, 1.4, 0]} 
        intensity={18} 
        distance={6} 
        color={lightColor}
        decay={1.8}
      />

      {/* clean white light so you can actually read the poster */}
      <pointLight 
        position={[isLeft ? 0.3 : -0.3, 1.8, 0]} 
        intensity={5} 
        distance={5} 
        color="#ffffff"
        decay={2.5}
      />

      {/* invisible box you can actually click on */}
      <mesh
        rotation={[0, rotY, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(movie)}
        style={{ cursor: 'pointer' }}
      >
        <boxGeometry args={[1.15, 1.65, 0.08]} />
        <meshStandardMaterial 
          color="#060606" 
          roughness={0.9} 
          metalness={0.2}
          emissive={hovered ? '#760707' : '#000000'}
          emissiveIntensity={hovered ? 1.5 : 0}
        />
      </mesh>

      {/* the actual poster image */}
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

      {/* show the click prompt when they hover */}
      {hovered && (
        <Html distanceFactor={6} position={[0, -1.0, 0]} center transform rotation={[0, rotY, 0]}>
          <div style={{
            background: 'rgba(118, 7, 7, 0.9)',
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '2px',
            border: '1px solid #ff4b4b',
            whiteSpace: 'nowrap',
            letterSpacing: '1px',
            boxShadow: '0 0 10px rgba(118, 7, 7, 0.8)',
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

export default function HorrorRoom({ onSelectMovie }) {
  const { horrorMovies: MOVIES } = useAppContext();
  const { forward, backward } = useKeyboard();
  const [showEndSign, setShowEndSign] = useState(false);

  useFrame((state, delta) => {
    const speed = 6;
    
    // handle the walking controls
    if (forward)  state.camera.position.z -= speed * delta;
    if (backward) state.camera.position.z += speed * delta;

    // lock the camera so they don't walk through the walls
    state.camera.position.z = Math.max(-24, Math.min(12.5, state.camera.position.z));
    state.camera.position.x = 0; // stick to the center
    state.camera.position.y = 2; // lock it at eye level

    // always look down the hallway
    state.camera.lookAt(0, 2, state.camera.position.z - 10);

    // jumpscare sign logic
    setShowEndSign(state.camera.position.z < -20);
  });

  return (
    <group>
      {/* super dark ambient light */}
      <ambientLight intensity={0.03} />

      {/* line of red lights down the hallway ceiling */}
      {[-25, -15, -5, 5, 12.5].map((zVal) => (
        <pointLight
          key={zVal}
          position={[0, 4.4, zVal]}
          intensity={6}
          distance={12}
          color="#3a0202"
          decay={2}
        />
      ))}

      {/* hallway ceiling */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 4.5, -8.75]}>
        <planeGeometry args={[10, 43.5]} />
        <meshStandardMaterial color="#150808" roughness={1} side={THREE.DoubleSide} />
      </mesh>

      {/* hallway floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, -8.75]}>
        <planeGeometry args={[10, 43.5]} />
        <meshStandardMaterial color="#120808" roughness={1.0} />
      </mesh>

      {/* left wall */}
      <mesh position={[-5, 1.8, -8.75]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[43.5, 6]} />
        <meshStandardMaterial color="#1a0a0a" roughness={0.9} />
      </mesh>

      {/* right wall */}
      <mesh position={[5, 1.8, -8.75]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[43.5, 6]} />
        <meshStandardMaterial color="#1a0a0a" roughness={0.9} />
      </mesh>

      {/* the wall at the end of the hallway */}
      <mesh position={[0, 1.8, -33.75]} rotation={[0, 0, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#050000" roughness={1.0} />
      </mesh>

      {/* spooky dead end sign that pops up */}
      {showEndSign && (
        <Html position={[0, 2.0, -33.65]} center transform zIndexRange={[0, 0]}>
          <div style={{
            textAlign: 'center',
            color: '#ff1a1a',
            fontFamily: '"Creepster", "Courier New", Courier, monospace',
            textShadow: '0 0 10px #760707, 0 0 20px #ff0000',
            userSelect: 'none',
            pointerEvents: 'none',
          }}>
            <h1 style={{ fontSize: '40px', margin: '0 0 10px 0', letterSpacing: '8px' }}>DEAD END</h1>
            <p style={{
              fontSize: '14px',
              color: '#ff4b4b',
              fontFamily: 'monospace',
              letterSpacing: '2px',
              margin: 0,
              fontStyle: 'italic'
            }}>
              You've gone too far. They are waiting for you in the dark.<br />
              Don't look behind you.
            </p>
          </div>
        </Html>
      )}

      {/* the wall directly behind where you spawn */}
      <mesh position={[0, 1.8, 13.0]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#1a0a0a" roughness={1.0} />
      </mesh>

      {/* loop through the movies and toss them on the walls */}
      {MOVIES.map((movie, index) => (
        <MoviePosterMesh
          key={movie.id}
          movie={movie}
          index={index}
          onSelect={onSelectMovie}
        />
      ))}

      {/* little dust particles for extra atmosphere */}
      <Sparkles count={150} scale={15} size={1.2} speed={0.4} color="#760707" />
    </group>
  );
}
