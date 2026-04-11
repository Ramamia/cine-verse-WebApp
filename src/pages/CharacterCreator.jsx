import React from 'react';
import { useGLTF } from '@react-three/drei';
import Avatar from '../components/3d/Avatar';

export default function CharacterCreator({ config }) {
  // Loading models here to pass them as props
  useGLTF.preload('/models/base_avatar.glb');
  useGLTF.preload('/models/pink_avatar.glb');
useGLTF.preload('/models/green_avatar.glb');
  const { scene: cowboy } = useGLTF('/models/cowboy_hat.glb');
  const { scene: glasses } = useGLTF('/models/cinema_glasses.glb');
  const { scene: hair } = useGLTF('/models/monroe_hair.glb');

  const accessories = { cowboy, glasses, hair };

  return (
    <group>
      {/* Dramatic Character Lighting - Your Exact Specs */}
      <spotLight 
        position={[-0.3, 10, 5.6]} 
        target-position={[-0.3, 2.67, 5.6]} 
        angle={0.4} 
        penumbra={0.5} 
        intensity={60} 
        color="#ffffff" 
        castShadow 
      />
      
      <pointLight 
        position={[-0.3, -0.9, 5.6]} 
        color="#760707" 
        intensity={150} 
        distance={8} 
      />

      <pointLight 
        position={[-0.3, 4, 3]} 
        color="#ffffff" 
        intensity={10} 
      />

      {/* Your Exact Base Model Placement */}
      <group position={[-0.3, 2.67, 5.6]} rotation={[-0.1, 0.3, -0.1]}>
        <Avatar config={config} accessories={accessories} /> 
      </group>
    </group>
  );
}