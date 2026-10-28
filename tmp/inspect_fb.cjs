const fs = require('fs');
const text = fs.readFileSync('/tmp/target_app.js', 'utf8');

// The main App component FB starts right before 2423391
console.log('Context before 2423391:');
console.log(text.substring(2400000, 2423461));
