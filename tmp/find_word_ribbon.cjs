const fs = require('fs');
const text = fs.readFileSync('/tmp/target_app.js', 'utf8');

const p = text.indexOf('onOpenWatermarkModal');
console.log('onOpenWatermarkModal at:', p);

// Search for the function declaration that takes onOpenWatermarkModal
let pos = 0;
while ((pos = text.indexOf('onOpenWatermarkModal', pos)) !== -1) {
  console.log('--- At', pos, '---');
  console.log(text.substring(Math.max(0, pos - 200), Math.min(text.length, pos + 300)));
  pos += 20;
}
