import React, { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useKeyboard } from '../hooks/useKeyboard';

export const MOVIES = [
  {
    id: 'horror-jacobs-ladder',
    title: 'Jacob’s Ladder',
    slogan: 'The most frightening thing about Jacob Singer’s nightmare is that he isn’t dreaming.',
    description: 'After returning home from the Vietnam War, veteran Jacob Singer struggles to maintain his sanity. Plagued by hallucinations and flashbacks, Singer rapidly falls apart as the world and people around him morph and twist into disturbing images.',
    year: '1990',
    director: 'Adrian Lyne',
    actors: 'Tim Robbins, Elizabeth Peña, Danny Aiello, Matt Craven',
    poster: '/images/jacobs_ladder.png',
    side: 'left',
    z: 10
  },
  {
    id: 'horror-it',
    title: 'It',
    slogan: 'The Master of Horror unleashes everything you were ever afraid of.',
    description: 'In 1960, seven outcast kids known as “The Losers’ Club” fight against an ancient shape-shifting alien who poses as a child-killing clown. Thirty years later, they reunite to stop the creature once and for all when it returns to their hometown.',
    year: '1990',
    director: 'Tommy Lee Wallace',
    actors: 'Tim Curry, Harry Anderson, Dennis Christopher, Richard Masur',
    poster: '/images/it.png',
    side: 'right',
    z: 10
  },
  {
    id: 'horror-exorcist-3',
    title: 'The Exorcist III',
    slogan: 'Do you dare walk these steps again?',
    description: 'On the fifteenth anniversary of the exorcism that claimed Father Damien Karras’ life, Police Lieutenant Kinderman’s world is once again shattered when a boy is found decapitated and savagely crucified.',
    year: '1990',
    director: 'William Peter Blatty',
    actors: 'George C. Scott, Ed Flanders, Brad Dourif, Jason Miller',
    poster: '/images/exorcist_3.png',
    side: 'left',
    z: 3
  },
  {
    id: 'horror-cabin-woods',
    title: 'The Cabin in the Woods',
    slogan: 'You think you know the story.',
    description: 'Five friends set out for a weekend at a remote cabin in the woods, expecting nothing more than fun and relaxation. As night falls, they discover that something far more unsettling is at work and that nothing about their getaway is what it seems.',
    year: '2011',
    director: 'Drew Goddard',
    actors: 'Kristen Connolly, Fran Kranz, Chris Hemsworth, Jesse Williams',
    poster: '/images/cabin_in_the_woods.png',
    side: 'right',
    z: 3
  },
  {
    id: 'horror-mother',
    title: 'mother!',
    slogan: 'Seeing is believing.',
    description: 'A couple’s relationship is tested when uninvited guests arrive at their home, disrupting their tranquil existence.',
    year: '2017',
    director: 'Darren Aronofsky',
    actors: 'Jennifer Lawrence, Javier Bardem, Ed Harris, Michelle Pfeiffer',
    poster: '/images/mother.png',
    side: 'left',
    z: -4
  },
  {
    id: 'horror-terrifier',
    title: 'Terrifier',
    slogan: 'You never forget your first kill.',
    description: 'A maniacal clown named Art terrorizes three young women on Halloween night and everyone else who stands in his way.',
    year: '2016',
    director: 'Damien Leone',
    actors: 'David Howard Thornton, Jenna Kanell, Samantha Scaffidi, Catherine Corcoran',
    poster: '/images/terrifier.png',
    side: 'right',
    z: -4
  },
  {
    id: 'horror-get-out',
    title: 'Get Out',
    slogan: 'Just because you’re invited, doesn’t mean you’re welcome.',
    description: 'Chris and his girlfriend Rose go upstate to visit her parents for the weekend. At first, Chris reads the family’s overly accommodating behavior as nervous attempts to deal with their daughter’s interracial relationship, but he soon discovers a disturbing truth.',
    year: '2017',
    director: 'Jordan Peele',
    actors: 'Daniel Kaluuya, Allison Williams, Catherine Keener, Bradley Whitford',
    poster: '/images/get_out.png',
    side: 'left',
    z: -11
  },
  {
    id: 'horror-saw',
    title: 'Saw',
    slogan: 'How much blood would you shed to stay alive?',
    description: 'Two men wake up to find themselves shackled in a grimy, abandoned bathroom. They discover they must partake in a gruesome game orchestrated by the sadistic mastermind Jigsaw in order to secure their freedom.',
    year: '2004',
    director: 'James Wan',
    actors: 'Tobin Bell, Cary Elwes, Leigh Whannell, Danny Glover',
    poster: '/images/saw.png',
    side: 'right',
    z: -11
  },
  {
    id: 'horror-eden-lake',
    title: 'Eden Lake',
    slogan: 'A weekend by the lake, with views to die for.',
    description: 'When a young couple goes to a remote wooded lake for a romantic getaway, their quiet weekend is shattered by an aggressive group of local kids. A weekend outing becomes a bloody battle for survival.',
    year: '2008',
    director: 'James Watkins',
    actors: 'Kelly Reilly, Michael Fassbender, Jack O\'Connell, Finn Atkins',
    poster: '/images/eden_lake.png',
    side: 'left',
    z: -18
  },
  {
    id: 'horror-hereditary',
    title: 'Hereditary',
    slogan: 'Every family tree hides a secret.',
    description: 'Following the death of the Leigh family matriarch, Annie and her children uncover disturbing secrets about their heritage, becoming entangled in a chilling fate from which they cannot escape.',
    year: '2018',
    director: 'Ari Aster',
    actors: 'Toni Collette, Alex Wolff, Gabriel Byrne, Milly Shapiro',
    poster: '/images/hereditary.png',
    side: 'right',
    z: -18
  },
  {
    id: 'horror-orphan',
    title: 'Orphan',
    slogan: 'There’s something wrong with Esther.',
    description: 'After losing their baby, a married couple adopt 9-year old Esther, who may not be as innocent as she seems.',
    year: '2009',
    director: 'Jaume Collet-Serra',
    actors: 'Vera Farmiga, Peter Sarsgaard, Isabelle Fuhrman, CCH Pounder',
    poster: '/images/orphan.png',
    side: 'left',
    z: -25
  },
  {
    id: 'horror-hush',
    title: 'Hush',
    slogan: 'Silence can be killer.',
    description: 'A deaf woman is stalked by a psychotic killer in her secluded home.',
    year: '2016',
    director: 'Mike Flanagan',
    actors: 'Kate Siegel, John Gallagher Jr., Michael Trucco, Samantha Sloyan',
    poster: '/images/hush.png',
    side: 'right',
    z: -25
  }
];

function MoviePosterMesh({ movie, texture, index, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const isLeft = movie.side === 'left';
  
  // Position slightly offset from the hallway walls (which are at X = -5 and X = 5)
  const posX = isLeft ? -4.92 : 4.92;
  const posY = 1.8;
  const rotY = isLeft ? Math.PI / 2 : -Math.PI / 2;
  
  // Staggered light color (amber vs dark red) to give a cinematic horror atmosphere
  const lightColor = index % 2 === 0 ? '#760707' : '#a55d0f';

  const lightRef = React.useRef();
  useFrame((state) => {
    if (lightRef.current) {
      // Scary flickering light above the poster
      const baseIntensity = hovered ? 28 : 18;
      const flicker = Math.sin(state.clock.getElapsedTime() * 12 + index) * 3;
      // Occasional random blackout flicker
      const glitch = Math.random() > 0.97 ? -12 : 0;
      lightRef.current.intensity = Math.max(0, baseIntensity + flicker + glitch);
    }
  });

  return (
    <group position={[posX, posY, movie.z]}>
      {/* Colored flickering light (red/amber atmosphere) */}
      <pointLight 
        ref={lightRef}
        position={[isLeft ? 0.8 : -0.8, 1.4, 0]} 
        intensity={18} 
        distance={6} 
        color={lightColor}
        decay={1.8}
      />

      {/* Soft white fill light to illuminate the poster clearly */}
      <pointLight 
        position={[isLeft ? 0.3 : -0.3, 1.8, 0]} 
        intensity={5} 
        distance={5} 
        color="#ffffff"
        decay={2.5}
      />

      {/* Interactive Frame Box */}
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

      {/* Poster Image Plane */}
      <mesh position={[isLeft ? 0.045 : -0.045, 0, 0]} rotation={[0, rotY, 0]}>
        <planeGeometry args={[1.05, 1.55]} />
        <meshStandardMaterial 
          map={texture} 
          roughness={0.3} 
          metalness={0.1} 
        />
      </mesh>

      {/* Interactive Label Overlay */}
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
  const { camera } = useThree();
  const { forward, backward } = useKeyboard();
  const [showEndSign, setShowEndSign] = useState(false);

  // Load all textures in parallel
  const textures = useTexture(MOVIES.map(m => m.poster));

  useFrame((state, delta) => {
    const speed = 6;
    
    // First person keyboard movement along the hallway Z axis
    if (forward)  camera.position.z -= speed * delta;
    if (backward) camera.position.z += speed * delta;

    // Clamp boundary — stop user well before the end wall
    camera.position.z = Math.max(-24, Math.min(12.5, camera.position.z));
    camera.position.x = 0; // Lock to the middle of the hallway width
    camera.position.y = 2; // Lock eye level height

    // Keep camera target facing straight forward down the hallway (Z negative direction)
    camera.lookAt(0, 2, camera.position.z - 10);

    // Only show THE END sign when close enough to read it
    setShowEndSign(camera.position.z < -20);
  });

  return (
    <group>
      {/* Ambience & Spooky Atmosphere */}
      <ambientLight intensity={0.03} />

      {/* Ceiling spot fill lights to paint a dim red glow along the middle corridor */}
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

      {/* Hallway Ceiling Mesh */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 4.5, -8.75]}>
        <planeGeometry args={[10, 43.5]} />
        <meshStandardMaterial color="#150808" roughness={1} side={THREE.DoubleSide} />
      </mesh>

      {/* Hallway Floor Mesh */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, -8.75]}>
        <planeGeometry args={[10, 43.5]} />
        <meshStandardMaterial color="#120808" roughness={1.0} />
      </mesh>

      {/* Left Wall Mesh */}
      <mesh position={[-5, 1.8, -8.75]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[43.5, 6]} />
        <meshStandardMaterial color="#1a0a0a" roughness={0.9} />
      </mesh>

      {/* Right Wall Mesh */}
      <mesh position={[5, 1.8, -8.75]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[43.5, 6]} />
        <meshStandardMaterial color="#1a0a0a" roughness={0.9} />
      </mesh>

      {/* End Wall Mesh (Dark end of the corridor) */}
      <mesh position={[0, 1.8, -30.5]} rotation={[0, 0, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#1a0a0a" roughness={1.0} />
      </mesh>

      {/* Scary End Sign — only visible when very close */}
      {showEndSign && (
        <Html position={[0, 2.0, -30.4]} center transform zIndexRange={[0, 0]}>
          <div style={{
            textAlign: 'center',
            color: '#ff1a1a',
            fontFamily: '"Creepster", "Courier New", Courier, monospace',
            textShadow: '0 0 10px #760707, 0 0 20px #ff0000',
            userSelect: 'none',
            pointerEvents: 'none',
          }}>
            <h1 style={{ fontSize: '32px', margin: '0 0 10px 0', letterSpacing: '8px', fontWeight: 'bold' }}>THE END</h1>
            <p style={{
              fontSize: '11px',
              color: '#888',
              fontFamily: 'monospace',
              letterSpacing: '2px',
              margin: 0,
              fontStyle: 'italic',
              maxWidth: '300px',
              textTransform: 'uppercase',
              lineHeight: '1.4'
            }}>
              That's all for the horror movies... for now...
            </p>
          </div>
        </Html>
      )}

      {/* Back Entrance Wall Mesh */}
      <mesh position={[0, 1.8, 13.0]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#1a0a0a" roughness={1.0} />
      </mesh>

      {/* Renders the 12 Movie Poster meshes along the walls */}
      {MOVIES.map((movie, index) => (
        <MoviePosterMesh
          key={movie.id}
          movie={movie}
          texture={textures[index]}
          index={index}
          onSelect={onSelectMovie}
        />
      ))}

      {/* Spooky mist sparkles floating in the air */}
      <Sparkles count={150} scale={15} size={1.2} speed={0.4} color="#760707" />
    </group>
  );
}
