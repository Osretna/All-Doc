import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height, r, g, b) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace

  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw pixel data: scanlines with filter byte 0
  const rowLength = width * 4 + 1;
  const rawData = Buffer.alloc(rowLength * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter 0: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Gradient background + stylized infinity / circle
      const t = y / height;
      const pr = Math.round(15 + t * 25);
      const pg = Math.round(23 + t * 75);
      const pb = Math.round(42 + t * 160);

      if (dist < radius) {
        // Inner glowing crest
        const borderDist = Math.abs(dist - radius * 0.75);
        if (borderDist < radius * 0.18) {
          rawData[pxOffset] = 0x38; // cyan-blue glow
          rawData[pxOffset + 1] = 0xbd;
          rawData[pxOffset + 2] = 0xf8;
          rawData[pxOffset + 3] = 255;
        } else if (dist < radius * 0.35) {
          rawData[pxOffset] = 0xff; // central white core
          rawData[pxOffset + 1] = 0xff;
          rawData[pxOffset + 2] = 0xff;
          rawData[pxOffset + 3] = 255;
        } else {
          rawData[pxOffset] = Math.min(255, pr + 40);
          rawData[pxOffset + 1] = Math.min(255, pg + 40);
          rawData[pxOffset + 2] = Math.min(255, pb + 60);
          rawData[pxOffset + 3] = 255;
        }
      } else {
        rawData[pxOffset] = pr;
        rawData[pxOffset + 1] = pg;
        rawData[pxOffset + 2] = pb;
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(12 + length);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + length));
  chunk.writeInt32BE(crc, 8 + length);
  return chunk;
}

// Standard CRC32 table
const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ -1) | 0;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, 37, 99, 235));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, 37, 99, 235));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, 37, 99, 235));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, 37, 99, 235));
console.log('PWA PNG icons generated successfully!');
