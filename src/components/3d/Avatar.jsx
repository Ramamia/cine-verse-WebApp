import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useKeyboard } from '../../hooks/useKeyboard';
import * as THREE from 'three';

export default function Avatar({ config, accessories = {} }) {
  const group = useRef();
  const { scene, animations } = useGLTF('/models/base_avatar.glb'); 
  const { actions } = useAnimations(animations, group);
  const { forward, backward, left, right } = useKeyboard();

  // Logic to change Skin Color
  useEffect(() => {
    if (!config?.skin || !scene) return;
    scene.traverse((child) => {
      if (child.isMesh && child.material && child.material.name.toLowerCase().includes("skin")) {
        child.material.color.set(new THREE.Color(config.skin));
      }
    });
  }, [scene, config?.skin]);

  // Animation Controller
  useEffect(() => {
    if (!actions || animations.length === 0) return;
    const isMoving = forward || backward || left || right;
    const idleAction = actions[animations[0]?.name];
    const walkAction = actions[animations[1]?.name];

    if (isMoving && walkAction) {
      idleAction?.fadeOut(0.2);
      walkAction.reset().fadeIn(0.2).play();
    } else if (idleAction) {
      walkAction?.fadeOut(0.2);
      idleAction.reset().fadeIn(0.2).play();
    }
  }, [forward, backward, left, right, actions, animations]);

  useFrame((state, delta) => {
    if (!group.current) return;
    // Standard movement speed
    const speed = 4;
    const rotSpeed = 2.5;

    if (forward) group.current.translateZ(-speed * delta);
    if (backward) group.current.translateZ(speed * delta);
    if (left) group.current.rotation.y += rotSpeed * delta;
    if (right) group.current.rotation.y -= rotSpeed * delta;
    
    // Camera follow logic
    const cameraOffset = new THREE.Vector3(0, 3, 6).applyQuaternion(group.current.quaternion).add(group.current.position);
    state.camera.position.lerp(cameraOffset, 0.1);
    state.camera.lookAt(group.current.position.x -1, group.current.position.y + 1, group.current.position.z);
  });

  return (
    <primitive ref={group} object={scene} scale={2.5}>
      {/* ACCESSORY SLOT SYSTEM - Fixed with .clone() */}
      <group position={[0, 0.65, 0]}>
        {config?.acc === 'cowboy' && accessories.cowboy && (
          <primitive object={accessories.cowboy.clone()} scale={0.15} position={[0, 0.1, 0]} />
        )}
        {config?.acc === 'astronaut' && accessories.astronaut && (
          <primitive object={accessories.astronaut.clone()} scale={0.25} position={[0, 0.05, 0]} />
        )}
        {config?.acc === 'glasses' && accessories.glasses && (
          <primitive object={accessories.glasses.clone()} scale={0.18} position={[0, -0.05, 0.1]} />
        )}
        {config?.hair === 'marilyn' && accessories.hair && (
          <primitive object={accessories.hair.clone()} scale={0.2} position={[0, 0, 0]} />
        )}
      </group>
    </primitive>
  );
}