const fs = require('fs');
const text = fs.readFileSync('/tmp/target_app.js', 'utf8');

// Find all big sections or component names
console.log('Total file length:', text.length);

// Let's search for the main App component or entry point
const appMatches = [];
let idx = 0;
while ((idx = text.indexOf('createRoot', idx)) !== -1) {
  console.log('createRoot at', idx);
  console.log(text.substring(idx - 200, idx + 200));
  idx += 10;
}
