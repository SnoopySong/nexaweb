import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import the built server
const handler = require('../dist/index.cjs');

export default handler;
