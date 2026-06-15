import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { useKeyboard } from '../../hooks/useKeyboard';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';


// Expose model offsets here so they can be easily customized by the user.
// You can adjust position [x, y, z], scale, and rotation [x, y, z] (in radians) for each model.
export const MODEL_OFFSETS = {
  '/models/base_avatar.glb': {
    position: [-0.2, 1.5, 8.3],
    scale: 2.5,
    rotation: [0, 0, 0]
  },
  '/models/pink.glb': {
    position: [-7.28, 0.4, -4.9],
    scale: 2.5,
    rotation: [0, 0, 0]
  },
  '/models/green.glb': {
    position: [-7.28, 0.4, -4.9],
    scale: 2.5,
    rotation: [0, 0, 0]
  },
  '/models/cowboy pink.glb': {
    position:[-6.54, 0.32, -0.5],
    scale: 0.5,
    rotation: [0, 0, 0]
  },
  '/models/cowboy green.glb': {
    position: [-2.78, 0.62, -0.38],
    scale: 0.5,
    rotation: [0, 0, 0]
  },
  '/models/glasses pink.glb': {
    position: [-1.47, 0, -1.39],
    scale: 0.125,
    rotation: [0, 0, 0]
  },
  '/models/glasses green.glb': {
    position: [0, 0, 0],
    scale: 2.5,
    rotation: [0, 0, 0]
  },
  '/models/monroe hair pink.glb': {
    position: [-1.47, 0, -0.87],
    scale: 0.125,
    rotation: [0, 0, 0]
  },
  '/models/monroe hair green.glb': {
    position: [-0.51, 0, -0.87],
    scale: 0.125,
    rotation: [0, 0, 0]
  }
};


export function getModelPath(config) {
  let modelPath = '/models/base_avatar.glb';
  if (config?.skin === 'pink') {
    if (config.acc === 'cowboy') {
      modelPath = '/models/cowboy pink.glb';
    } else if (config.acc === 'glasses') {
      modelPath = '/models/glasses pink.glb';
    } else if (config.hair === 'marilyn') {
      modelPath = '/models/monroe hair pink.glb';
    } else {
      modelPath = '/models/pink.glb';
    }
  } else if (config?.skin === 'green') {
    if (config.acc === 'cowboy') {
      modelPath = '/models/cowboy green.glb';
    } else if (config.acc === 'glasses') {
      modelPath = '/models/glasses green.glb';
    } else if (config.hair === 'marilyn') {
      modelPath = '/models/monroe hair green.glb';
    } else {
      modelPath = '/models/green.glb';
    }
  }
  return modelPath;
}

export default function Avatar({ config, accessories = {}, isPreview = false, isProfile = false }) {
  const group = useRef();

  // 1. Resolve the correct model path based on selected skin color and accessories.
  const modelPath = getModelPath(config);

  // 2. Load the base avatar (for skeletal animations and reference sizing) and the selected model.
  const baseAvatar = useGLTF('/models/base_avatar.glb');
  const { scene, animations: modelAnimations } = useGLTF(modelPath);

  // Clone the scene to isolate instances (stretching/positioning in Profile vs customization)
  const clonedScene = React.useMemo(() => {
    if (!scene) return null;
    return clone(scene);
  }, [scene]);

  // Use the animations from base_avatar if the loaded model has no embedded clips.
  const animations = modelAnimations.length > 0 ? modelAnimations : baseAvatar.animations;
  const { actions }           = useAnimations(animations, group);
  const { forward, backward, left, right } = useKeyboard();

  // 3. Dynamically set the skin color of the body mesh to match the user config color.
  const skinColorMap = {
    pink: '#cb186c',
    green: '#06973d',
    '#ffdbac': '#ffdbac'
  };
  const targetColor = skinColorMap[config?.skin] ?? '#ffdbac';

  useEffect(() => {
    if (!clonedScene) return;

    // Check if a root 'base_avatar' node exists in the scene hierarchy.
    let baseAvatarNodeExists = false;
    clonedScene.traverse((n) => {
      if (n.name === 'base_avatar') baseAvatarNodeExists = true;
    });

    clonedScene.traverse((child) => {
      // If a 'base_avatar' node is present in the file, filter out duplicate mesh elements
      // that are not parented under it.
      let isFromMainAvatar = true;
      if (baseAvatarNodeExists) {
        let curr = child;
        let found = false;
        while (curr) {
          if (curr.name === 'base_avatar') {
            found = true;
            break;
          }
          curr = curr.parent;
        }
        isFromMainAvatar = found;
      }

      if (child.isMesh) {
        if (!isFromMainAvatar) {
          child.visible = false;
          return;
        }

        if (child.name.includes('pCube35_lambert1')) {
          child.material = child.material.clone();
          child.material.color.set(new THREE.Color(targetColor));
        }

        const isBody = child.name.includes('pCube35_lambert1');
        const isCowboyHat = child.name.includes('Hat4_pasted__M_Hat') || child.name.includes('pCube32') || child.name.includes('pCube33') || child.name.includes('pCube34');
        const isGlasses = child.name.toLowerCase().includes('glass') || child.name.toLowerCase().includes('cinema');
        const isHair = child.name.toLowerCase().includes('hair') || child.name.toLowerCase().includes('monroe') || child.name.toLowerCase().includes('marilyn');

        if (isBody) {
          child.visible = true;
        } else if (isCowboyHat) {
          child.visible = (config?.acc === 'cowboy');
        } else if (isGlasses) {
          child.visible = (config?.acc === 'glasses');
        } else if (isHair) {
          child.visible = (config?.hair === 'marilyn');
        } else {
          child.visible = false;
        }
      }
    });
  }, [clonedScene, targetColor, config]);

  // Swap between idle and walk animations
  useEffect(() => {
    if (!actions || animations.length === 0) return;
    const isMoving    = forward || backward || left || right;
    const idleAction  = actions[animations[0]?.name];
    const walkAction  = actions[animations[1]?.name];

    if (isMoving && walkAction) {
      idleAction?.fadeOut(0.2);
      walkAction.reset().fadeIn(0.2).play();
    } else if (idleAction) {
      walkAction?.fadeOut(0.2);
      idleAction.reset().fadeIn(0.2).play();
    }
  }, [forward, backward, left, right, actions, animations]);

  // Movement & camera follow
  useFrame((state, delta) => {
    if (isPreview) return;
    if (!group.current) return;
    const speed    = 4;
    const rotSpeed = 2.5;

    if (forward)  group.current.translateZ(-speed * delta);
    if (backward) group.current.translateZ(speed  * delta);
    if (left)     group.current.rotation.y += rotSpeed * delta;
    if (right)    group.current.rotation.y -= rotSpeed * delta;

    const cameraOffset = new THREE.Vector3(0, 3, 6)
      .applyQuaternion(group.current.quaternion)
      .add(group.current.position);
    state.camera.position.lerp(cameraOffset, 0.1);
    state.camera.lookAt(
      group.current.position.x - 1,
      group.current.position.y + 1,
      group.current.position.z,
    );
  });

  // 4. Retrieve position, scale, and rotation offsets from the user-customizable offsets config
  const offsets = MODEL_OFFSETS[modelPath] ?? {
    position: [0, 0, 0],
    scale: 2.5,
    rotation: [0, 0, 0]
  };

  return (
    <group ref={group} name="avatar-isolation-container">
      {/* 
        We use the modelPath as a key to force React Three Fiber to completely 
        unmount the old scene and mount the new scene, preventing stale references 
        and ensuring animations bind correctly to the new mesh structure.
      */}
      <primitive
        key={modelPath}
        object={clonedScene}
        scale={offsets.scale}
        position={offsets.position}
        rotation={offsets.rotation}
      />
    </group>
  );
}
