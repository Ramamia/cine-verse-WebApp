import fs from 'fs';

function inspectModel(filename) {
  console.log(`\n=== INSPECTING ${filename} ===`);
  const buffer = fs.readFileSync('public/models/' + filename);
  const chunkLength = buffer.readUInt32LE(12);
  const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
  const gltf = JSON.parse(jsonStr);

  const bodyNodeIdx = gltf.nodes.findIndex(n => n.name && n.name.includes('pCube35_lambert1'));
  if (bodyNodeIdx === -1) {
    console.log('Body node not found!');
    return;
  }
  const bodyNode = gltf.nodes[bodyNodeIdx];
  console.log('Body Node:', JSON.stringify(bodyNode, null, 2));

  const findParent = (idx) => {
    return gltf.nodes.findIndex(n => n.children && n.children.includes(idx));
  };

  let currentIdx = bodyNodeIdx;
  while (currentIdx !== -1) {
    const parentIdx = findParent(currentIdx);
    if (parentIdx !== -1) {
      console.log(`Parent of ${gltf.nodes[currentIdx].name} (Node ${currentIdx}) is: ${gltf.nodes[parentIdx].name} (Node ${parentIdx})`);
      if (gltf.nodes[parentIdx].translation) console.log(`  translation: ${JSON.stringify(gltf.nodes[parentIdx].translation)}`);
      if (gltf.nodes[parentIdx].scale) console.log(`  scale: ${JSON.stringify(gltf.nodes[parentIdx].scale)}`);
      if (gltf.nodes[parentIdx].rotation) console.log(`  rotation: ${JSON.stringify(gltf.nodes[parentIdx].rotation)}`);
      if (gltf.nodes[parentIdx].matrix) console.log(`  matrix: ${JSON.stringify(gltf.nodes[parentIdx].matrix)}`);
    }
    currentIdx = parentIdx;
  }
}

inspectModel('pink.glb');
inspectModel('green.glb');
inspectModel('base_avatar.glb');
