import React from 'react';
import { useGLTF } from '@react-three/drei';
import Avatar from '../components/3d/Avatar';

// Preload all avatar variants up-front so they're ready when the user picks one
useGLTF.preload('/models/base_avatar.glb');
useGLTF.preload('/models/pink.glb');
useGLTF.preload('/models/green.glb');
useGLTF.preload('/models/cowboy pink.glb');
useGLTF.preload('/models/cowboy green.glb');
useGLTF.preload('/models/glasses pink.glb');
useGLTF.preload('/models/glasses green.glb');
useGLTF.preload('/models/monroe hair pink.glb');
useGLTF.preload('/models/monroe hair green.glb');

export default function CharacterCreator({ config }) {
  const { scene: cowboy  } = useGLTF('/models/cowboy_hat.glb');
  const { scene: glasses } = useGLTF('/models/cinema_glasses.glb');
  const { scene: hair    } = useGLTF('/models/monroe_hair.glb');

  const accessories = { cowboy, glasses, hair };

  return (
    <group>
      {/* Key spotlight from above */}
      <spotLight
        position={[-0.3, 10, 5.6]}
        target-position={[-0.3, 2.67, 5.6]}
        angle={0.4}
        penumbra={0.5}
        intensity={60}
        color="#ffffff"
        castShadow
      />

      {/* Rim light from below — dramatic red */}
      <pointLight position={[-0.3, -0.9, 5.6]} color="#760707" intensity={150} distance={8} />

      {/* Soft fill from front */}
      <pointLight position={[-0.3, 4, 3]} color="#ffffff" intensity={10} />

      {/* Avatar positioned in the scene */}
      <group position={[-0.3, 2.67, 5.6]} rotation={[-0.1, 0.3, -0.1]}>
        <Avatar config={config} accessories={accessories} isPreview={true} />
      </group>
    </group>
  );
}
