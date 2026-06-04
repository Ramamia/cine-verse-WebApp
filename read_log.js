import fs from 'fs';
const text = fs.readFileSync('log.txt', 'utf16le');
const indexPink = text.indexOf('MODEL: pink.glb');
if (indexPink !== -1) {
  console.log(text.slice(indexPink, indexPink + 3000));
}

const indexGreen = text.indexOf('MODEL: green.glb');
if (indexGreen !== -1) {
  console.log(text.slice(indexGreen, indexGreen + 3000));
}
