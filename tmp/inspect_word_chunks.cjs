const fs = require('fs');
const text = fs.readFileSync('/tmp/word_complete_source.js', 'utf8');

// Print the beginning of each component up to next component
const comps = [
  { name: 'Nr (Home)', start: text.indexOf('Nr=') },
  { name: 'Pr (Insert)', start: text.indexOf('Pr=') },
  { name: 'Fr (Design)', start: text.indexOf('Fr=') },
  { name: 'Ir (Layout)', start: text.indexOf('Ir=') },
  { name: 'Lr (References)', start: text.indexOf('Lr=') },
  { name: 'Rr (Mailings)', start: text.indexOf('Rr=') },
  { name: 'zr (Review)', start: text.indexOf('zr=') },
  { name: 'Br (View)', start: text.indexOf('Br=') },
  { name: 'Vr (Master)', start: text.indexOf('Vr=') },
  { name: 'Ur (Editor)', start: text.indexOf('Ur=') },
  { name: 'Wr (StatusBar)', start: text.indexOf('Wr=') },
];

comps.forEach((c, idx) => {
  const nextStart = comps[idx + 1] ? comps[idx + 1].start : text.length;
  console.log(`\n============================== ${c.name} (length: ${nextStart - c.start}) ==============================`);
  const content = text.substring(c.start, Math.min(nextStart, c.start + 2500));
  console.log(content);
});
