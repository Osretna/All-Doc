const fs = require('fs');
const text = fs.readFileSync('/tmp/word_complete_source.js', 'utf8');

function dumpChunk(name, startTag, endTag) {
  const p1 = text.indexOf(startTag);
  const p2 = endTag ? text.indexOf(endTag, p1) : p1 + 5000;
  console.log(`\n================== ${name} ==================`);
  console.log(text.substring(p1, Math.min(p2, p1 + 4000)));
}

dumpChunk('Fr (Design)', 'Fr=', 'Ir=');
dumpChunk('Ir (Layout)', 'Ir=', 'Lr=');
dumpChunk('Lr (References)', 'Lr=', 'Rr=');
dumpChunk('Rr (Mailings)', 'Rr=', 'zr=');
dumpChunk('zr (Review)', 'zr=', 'Br=');
dumpChunk('Br (View)', 'Br=', 'Vr=');
