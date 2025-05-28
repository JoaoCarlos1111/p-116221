
console.log('🔧 Starting simple test server...');

import express from 'express';

const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/api/test', (req, res) => {
  console.log('✅ Test endpoint hit');
  res.json({ message: 'Test server working!', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server running on port ${PORT}`);
});
