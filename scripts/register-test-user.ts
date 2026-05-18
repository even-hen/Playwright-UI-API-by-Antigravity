/**
 * One-time setup script: registers the test user defined in .env.
 * Run with: npx ts-node scripts/register-test-user.ts
 *
 * This only needs to be run once. After registration, the credentials
 * in .env will work for all subsequent test runs via global.setup.ts.
 */
import dotenv from 'dotenv';
import path from 'path';
import https from 'https';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BASE_URL = process.env.API_BASE_URL!;
const EMAIL = process.env.TEST_USER_EMAIL!;
const PASSWORD = process.env.TEST_USER_PASSWORD!;
const FIRST_NAME = process.env.TEST_USER_FIRST_NAME ?? 'Test';
const LAST_NAME = process.env.TEST_USER_LAST_NAME ?? 'Automation';

const payload = JSON.stringify({
  firstName: FIRST_NAME,
  lastName: LAST_NAME,
  email: EMAIL,
  password: PASSWORD,
});

const url = new URL(`${BASE_URL}/users`);

const options = {
  hostname: url.hostname,
  port: url.port || 443,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  },
};

console.log(`\n🚀 Registering test user: ${EMAIL} at ${BASE_URL}\n`);

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    if (res.statusCode === 201) {
      console.log('✅ Test user registered successfully!');
      console.log(`   Email: ${EMAIL}`);
      console.log(`   Password: ${PASSWORD}`);
      console.log('\n➡️  You can now run: npm test\n');
    } else if (res.statusCode === 400 && data.includes('duplicate')) {
      console.log('ℹ️  User already exists — no action needed.');
      console.log('\n➡️  You can now run: npm test\n');
    } else {
      console.error(`❌ Registration failed [${res.statusCode}]:`, data);
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Request error:', err.message);
  process.exit(1);
});

req.write(payload);
req.end();
