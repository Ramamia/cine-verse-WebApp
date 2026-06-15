import React, { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useKeyboard } from '../hooks/useKeyboard';

export const ROMCOM_MOVIES = [
  {
    id: 'romcom-10-things',
    title: '10 Things I Hate About You',
    slogan: 'How do I loathe thee? Let me count the ways.',
    description: 'On the first day at his new school, Cameron instantly falls for Bianca, the gorgeous girl of his dreams. The only problem is that Bianca is forbidden to date until her ill-tempered, completely un-dateable older sister Kat goes out, too.',
    year: '1999',
    director: 'Gil Junger',
    actors: 'Heath Ledger, Julia Stiles, Joseph Gordon-Levitt, Larisa Oleynik',
    poster: '/images/romcomMovies/10 things i hate about you.png',
    side: 'left',
    z: 10
  },
  {
    id: 'romcom-13-going-30',
    title: '13 Going on 30',
    slogan: 'For some, 13 feels like it was just yesterday. For Jenna, it was.',
    description: 'After total humiliation at her thirteenth birthday party, Jenna Rink wants to just hide until she\'s thirty. Thanks to some magic wishing dust, Jenna\'s prayer has been answered.',
    year: '2004',
    director: 'Gary Winick',
    actors: 'Jennifer Garner, Mark Ruffalo, Judy Greer, Andy Serkis',
    poster: '/images/romcomMovies/13 going 30.png',
    side: 'right',
    z: 10
  },
  {
    id: 'romcom-27-dresses',
    title: '27 Dresses',
    slogan: 'She\'s about to find the perfect fit.',
    description: 'Altruistic Jane finds herself facing her worst nightmare as her younger sister announces her engagement to the man Jane secretly adores.',
    year: '2008',
    director: 'Anne Fletcher',
    actors: 'Katherine Heigl, James Marsden, Malin Åkerman, Judy Greer',
    poster: '/images/romcomMovies/27 dresses.png',
    side: 'left',
    z: 3
  },
  {
    id: 'romcom-shes-the-man',
    title: 'She\'s the Man',
    slogan: 'Everybody has a secret…',
    description: 'Viola Hastings is in a real jam. Complications threaten her scheme to pose as her twin brother, Sebastian, and take his place at a new boarding school.',
    year: '2006',
    director: 'Andy Fickman',
    actors: 'Amanda Bynes, Channing Tatum, Laura Ramsey, Vinnie Jones',
    poster: '/images/romcomMovies/she\'s the man.png',
    side: 'right',
    z: 3
  },
  {
    id: 'romcom-cinderella-story',
    title: 'A Cinderella Story',
    slogan: 'Once upon a time… can happen any time.',
    description: 'Routinely exploited by her wicked stepmother, the downtrodden Samantha Montgomery is excited about the prospect of meeting her Internet beau at the school\'s Halloween dance.',
    year: '2004',
    director: 'Mark Rosman',
    actors: 'Hilary Duff, Chad Michael Murray, Jennifer Coolidge, Dan Byrd',
    poster: '/images/romcomMovies/a cinderella story.png',
    side: 'left',
    z: -4
  },
  {
    id: 'romcom-how-to-lose',
    title: 'How to Lose a Guy in 10 Days',
    slogan: 'One of them is lying. So is the other.',
    description: 'It\'s the battle of wills, as Andie needs to prove she can dump a guy in 10 days, whereas Ben needs to prove he can win a girl in 10 days.',
    year: '2003',
    director: 'Donald Petrie',
    actors: 'Kate Hudson, Matthew McConaughey, Kathryn Hahn, Annie Parisse',
    poster: '/images/romcomMovies/how to lose a guy in 10 days.png',
    side: 'right',
    z: -4
  },
  {
    id: 'romcom-when-harry',
    title: 'When Harry Met Sally…',
    slogan: 'Can two friends sleep together and still love each other in the morning?',
    description: 'Sex always gets in the way of friendships between men and women. At least, that\'s what Harry Burns believes. So when Harry meets Sally Albright and a deep friendship blossoms between them, Harry\'s determined not to let his attraction to Sally destroy it.',
    year: '1989',
    director: 'Rob Reiner',
    actors: 'Billy Crystal, Meg Ryan, Carrie Fisher, Bruno Kirby',
    poster: '/images/romcomMovies/when harry met sally.png',
    side: 'left',
    z: -11
  },
  {
    id: 'romcom-legally-blonde',
    title: 'Legally Blonde',
    slogan: 'Boldly going where no blonde has gone.',
    description: 'Fashionable sorority queen Elle Woods has it all, but she wants nothing more than to be Mrs. Warner Huntington III. When he dumps her, she gets into Harvard Law to win him back.',
    year: '2001',
    director: 'Robert Luketic',
    actors: 'Reese Witherspoon, Luke Wilson, Selma Blair, Matthew Davis',
    poster: '/images/romcomMovies/legally blonde.png',
    side: 'right',
    z: -11
  },
  {
    id: 'romcom-set-it-up',
    title: 'Set It Up',
    slogan: 'Finding love takes some assistants.',
    description: 'Two overworked and underpaid assistants come up with a plan to get their bosses off their backs by setting them up with each other.',
    year: '2018',
    director: 'Claire Scanlon',
    actors: 'Glen Powell, Zoey Deutch, Taye Diggs, Lucy Liu',
    poster: '/images/romcomMovies/set it up.png',
    side: 'left',
    z: -18
  },
  {
    id: 'romcom-the-holiday',
    title: 'The Holiday',
    slogan: 'It\'s Christmas Eve and we are going to go celebrate being young and being alive.',
    description: 'Two women, one American and one British, swap homes at Christmastime following bad breakups. Each woman finds romance with a local man.',
    year: '2006',
    director: 'Nancy Meyers',
    actors: 'Cameron Diaz, Kate Winslet, Jude Law, Jack Black',
    poster: '/images/romcomMovies/the holiday.png',
    side: 'right',
    z: -18
  },
  {
    id: 'romcom-people-vacation',
    title: 'People We Meet on Vacation',
    slogan: 'On vacation, you\'re free to follow your heart.',
    description: 'Poppy\'s a free spirit. Alex loves a plan. After years of summer vacations, these polar-opposite pals wonder if they could be a perfect romantic match.',
    year: '2026',
    director: 'Brett Haley',
    actors: 'Emily Bader, Tom Blyth, Sarah Catherine Hook, Jameela Jamil',
    poster: '/images/romcomMovies/people we meet on vacation.png',
    side: 'left',
    z: -25
  },
  {
    id: 'romcom-anyone-but-you',
    title: 'Anyone But You',
    slogan: 'They only look like the perfect couple.',
    description: 'After an amazing first date, Bea and Ben\'s fiery attraction turns ice cold — until they find themselves unexpectedly reunited at a destination wedding in Australia.',
    year: '2023',
    director: 'Will Gluck',
    actors: 'Sydney Sweeney, Glen Powell, Mia Artemis, Nat Buchanan',
    poster: '/images/romcomMovies/anyone but you.png',
    side: 'right',
    z: -25
  },
  {
    id: 'romcom-the-proposal',
    title: 'The Proposal',
    slogan: 'Here comes the bride.',
    description: 'Faced with deportation to her native Canada, high-powered book editor Margaret Tate says she\'s engaged to marry Andrew Paxton, her hapless assistant. Andrew agrees to the charade, but imposes a few conditions of his own, including flying to Alaska to meet his eccentric family.',
    year: '2009',
    director: 'Anne Fletcher',
    actors: 'Sandra Bullock, Ryan Reynolds, Mary Steenburgen, Craig T. Nelson',
    poster: '/images/romcomMovies/the proposal.png',
    side: 'left',
    z: -32
  }
];

function MoviePosterMesh({ movie, texture, index, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const isLeft = movie.side === 'left';
  
  const posX = isLeft ? -4.92 : 4.92;
  const posY = 1.8;
  const rotY = isLeft ? Math.PI / 2 : -Math.PI / 2;
  
  // Alternating light pink shades for a cute dreamy atmosphere
  const lightColor = index % 2 === 0 ? '#ff69b4' : '#ff85c8';

  const lightRef = React.useRef();
  useFrame((state) => {
    if (lightRef.current) {
      // Gentle pulsing glow (not flickering — it's romcom, not horror!)
      const baseIntensity = hovered ? 24 : 14;
      const pulse = Math.sin(state.clock.getElapsedTime() * 2 + index) * 2;
      lightRef.current.intensity = Math.max(0, baseIntensity + pulse);
    }
  });

  return (
    <group position={[posX, posY, movie.z]}>
      {/* Pink glow light */}
      <pointLight 
        ref={lightRef}
        position={[isLeft ? 0.8 : -0.8, 1.4, 0]} 
        intensity={14} 
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

      {/* Frame */}
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

      {/* Poster Image Plane */}
      <mesh position={[isLeft ? 0.045 : -0.045, 0, 0]} rotation={[0, rotY, 0]}>
        <planeGeometry args={[1.05, 1.55]} />
        <meshStandardMaterial 
          map={texture} 
          roughness={0.3} 
          metalness={0.1} 
        />
      </mesh>

      {/* Hover label */}
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
  const { camera } = useThree();
  const { forward, backward } = useKeyboard();
  const [showEndSign, setShowEndSign] = useState(false);

  const textures = useTexture(ROMCOM_MOVIES.map(m => m.poster));

  useFrame((state, delta) => {
    const speed = 6;
    
    if (forward)  camera.position.z -= speed * delta;
    if (backward) camera.position.z += speed * delta;

    // Clamp boundary — stop well before the end wall
    camera.position.z = Math.max(-31, Math.min(12.5, camera.position.z));
    camera.position.x = 0;
    camera.position.y = 2;

    camera.lookAt(0, 2, camera.position.z - 10);

    // Show the end sign when close enough
    setShowEndSign(camera.position.z < -27);
  });

  return (
    <group>
      {/* Soft warm ambient */}
      <ambientLight intensity={0.06} color="#ffe0f0" />

      {/* Ceiling glow lights — soft pink along the corridor */}
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

      {/* Hallway Ceiling Mesh */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 4.5, -8.75]}>
        <planeGeometry args={[10, 50]} />
        <meshStandardMaterial color="#fff0f5" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* Hallway Floor Mesh */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, -8.75]}>
        <planeGeometry args={[10, 50]} />
        <meshStandardMaterial color="#fffafa" roughness={0.7} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-5, 1.8, -8.75]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[50, 6]} />
        <meshStandardMaterial color="#fff0f5" roughness={0.9} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[5, 1.8, -8.75]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[50, 6]} />
        <meshStandardMaterial color="#fff0f5" roughness={0.9} />
      </mesh>

      {/* End Wall */}
      <mesh position={[0, 1.8, -37.5]} rotation={[0, 0, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#ffe4e1" roughness={1.0} />
      </mesh>

      {/* Cute End Sign — only when close */}
      {showEndSign && (
        <Html position={[0, 2.0, -37.4]} center transform zIndexRange={[0, 0]}>
          <div style={{
            textAlign: 'center',
            color: '#ff69b4',
            fontFamily: '"Comic Sans MS", "Segoe UI", sans-serif',
            textShadow: '0 0 10px #ffffff, 0 0 20px #ffb6d9',
            userSelect: 'none',
            pointerEvents: 'none',
          }}>
            <h1 style={{ fontSize: '32px', margin: '0 0 10px 0', letterSpacing: '4px', fontWeight: 'bold' }}>THE END</h1>
            <p style={{
              fontSize: '12px',
              color: '#ff69b4',
              fontFamily: '"Segoe UI", sans-serif',
              letterSpacing: '1px',
              margin: 0,
              fontStyle: 'italic',
              maxWidth: '300px',
              lineHeight: '1.5'
            }}>
              That's all the love stories... for now...
            </p>
          </div>
        </Html>
      )}

      {/* Back Entrance Wall */}
      <mesh position={[0, 1.8, 13.0]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#ffe4e1" roughness={1.0} />
      </mesh>

      {/* Movie Posters */}
      {ROMCOM_MOVIES.map((movie, index) => (
        <MoviePosterMesh
          key={movie.id}
          movie={movie}
          texture={textures[index]}
          index={index}
          onSelect={onSelectMovie}
        />
      ))}

      {/* Dreamy sparkles — light pink */}
      <Sparkles count={200} scale={18} size={1.5} speed={0.3} color="#ff69b4" />
      <Sparkles count={100} scale={15} size={0.8} speed={0.5} color="#ffffff" />
    </group>
  );
}
