const fs = require('fs');
const text = fs.readFileSync('/tmp/target_app.js', 'utf8');

// Search for the apps list near 275052
console.log('--- Context around 275052 ---');
console.log(text.substring(273000, 277000));
