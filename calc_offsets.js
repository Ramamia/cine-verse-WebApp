import fs from 'fs';
import * as THREE from 'three';

function getMatrixRelativeToRoot(nodeIdx, nodes) {
  const mat = new THREE.Matrix4();
  const path = [];
  let currentIdx = nodeIdx;

  // Find parents
  const findParentIdx = (idx) => {
    return nodes.findIndex(n => n.children && n.children.includes(idx));
  };

  while (currentIdx !== -1) {
    path.push(currentIdx);
    currentIdx = findParentIdx(currentIdx);
  }

  // Multiply matrices from root child down to the target node
  for (let i = path.length - 1; i >= 0; i--) {
    const node = nodes[path[i]];
    const localMat = new THREE.Matrix4();
    if (node.matrix) {
      localMat.fromArray(node.matrix);
    } else {
      const pos = node.translation ? new THREE.Vector3(...node.translation) : new THREE.Vector3(0, 0, 0);
      const rot = node.rotation ? new THREE.Quaternion(...node.rotation) : new THREE.Quaternion(0, 0, 0, 1);
      const scl = node.scale ? new THREE.Vector3(...node.scale) : new THREE.Vector3(1, 1, 1);
      localMat.compose(pos, rot, scl);
    }
    mat.multiply(localMat);
  }
  return mat;
}

function calculateOffsets(filename, baseHeight) {
  const buffer = fs.readFileSync('public/models/' + filename);
  const chunkLength = buffer.readUInt32LE(12);
  const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
  const gltf = JSON.parse(jsonStr);

  const bodyNodeIdx = gltf.nodes.findIndex(n => n.name && n.name.includes('pCube35_lambert1'));
  if (bodyNodeIdx === -1) {
    console.log(`Body node not found in ${filename}`);
    return null;
  }

  // Get relative matrix to root
  const relativeMatrix = getMatrixRelativeToRoot(bodyNodeIdx, gltf.nodes);

  // Position accessor bounds (local mesh coordinates)
  const mesh = gltf.meshes[gltf.nodes[bodyNodeIdx].mesh];
  const prim = mesh.primitives[0];
  const posAccessor = gltf.accessors[prim.attributes.POSITION];
  
  const min = new THREE.Vector3(...posAccessor.min);
  const max = new THREE.Vector3(...posAccessor.max);
  const localBox = new THREE.Box3(min, max);
  
  // Transform local box by the relative matrix
  localBox.applyMatrix4(relativeMatrix);

  const size = new THREE.Vector3();
  localBox.getSize(size);
  const center = new THREE.Vector3();
  localBox.getCenter(center);

  const scaleFactor = baseHeight / size.y;
  const primitiveScale = 2.5 * scaleFactor;
  const primitivePosition = [
    -center.x * primitiveScale,
    -localBox.min.y * primitiveScale,
    -center.z * primitiveScale
  ];

  console.log(`\nResults for ${filename}:`);
  console.log(`  Size Y: ${size.y}`);
  console.log(`  Scale Factor: ${scaleFactor}`);
  console.log(`  Computed Scale: ${primitiveScale}`);
  console.log(`  Computed Position: [${primitivePosition.join(', ')}]`);
  return { scale: primitiveScale, position: primitivePosition };
}

// 1. First get base_avatar.glb height
const baseBuffer = fs.readFileSync('public/models/base_avatar.glb');
const baseChunkLength = baseBuffer.readUInt32LE(12);
const baseJsonStr = baseBuffer.toString('utf8', 20, 20 + baseChunkLength);
const baseGltf = JSON.parse(baseJsonStr);
const baseBodyIdx = baseGltf.nodes.findIndex(n => n.name && n.name.includes('pCube35_lambert1'));
const baseMatrix = getMatrixRelativeToRoot(baseBodyIdx, baseGltf.nodes);
const baseMesh = baseGltf.meshes[baseGltf.nodes[baseBodyIdx].mesh];
const baseAccessor = baseGltf.accessors[baseMesh.primitives[0].attributes.POSITION];
const baseMin = new THREE.Vector3(...baseAccessor.min);
const baseMax = new THREE.Vector3(...baseAccessor.max);
const baseBox = new THREE.Box3(baseMin, baseMax);
baseBox.applyMatrix4(baseMatrix);
const baseSize = new THREE.Vector3();
baseBox.getSize(baseSize);
const baseHeight = baseSize.y;
console.log(`Base Avatar Height: ${baseHeight}`);

calculateOffsets('pink.glb', baseHeight);
calculateOffsets('green.glb', baseHeight);
calculateOffsets('cowboy pink.glb', baseHeight);
calculateOffsets('cowboy green.glb', baseHeight);
calculateOffsets('glasses pink.glb', baseHeight);
calculateOffsets('monroe hair pink.glb', baseHeight);
calculateOffsets('monroe hair green.glb', baseHeight);
