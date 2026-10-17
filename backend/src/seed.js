// Seeds the demo accounts documented in DEMO_DATASET.txt.
// Run with: npm run seed   (after `vercel env pull .env` in the repo root)
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('./models/User');

const DEMO = [
  { name: 'Patient Test',      email: 'patient@test.com', phone: '9876543211', role: 'patient',       gender: 'male',   abhaId: '12-3456-7890-1234' },
  { name: 'Dr. Rajesh Sharma', email: 'doctor@test.com',  phone: '9876543210', role: 'doctor',        gender: 'male',   specialization: 'MD (General Medicine)', registrationNumber: 'MP-DOC-10021' },
  { name: 'Sunita Devi',       email: 'asha@test.com',    phone: '9876543212', role: 'health_worker', gender: 'female' },
  { name: 'Dr. Manoj Kumar Singh', email: 'admin@test.com', phone: '9876543213', role: 'admin',       gender: 'male',   specialization: 'DHO Sitapur', registrationNumber: 'MP-DHO-0001' },
];

const PASSWORD = process.env.SEED_PASSWORD || '123456';

(async () => {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set');
  await mongoose.connect(process.env.MONGO_URI);
  for (const d of DEMO) {
    const exists = await User.findOne({ email: d.email });
    if (exists) {
      console.log(`skip (exists): ${d.email}`);
      continue;
    }
    await User.create({ ...d, password: PASSWORD });
    console.log(`created: ${d.role.padEnd(13)} ${d.email} / ${PASSWORD}`);
  }
  console.log('Seed complete.');
  await mongoose.disconnect();
})().catch(async (e) => { console.error('Seed failed:', e.message); await mongoose.disconnect(); process.exit(1); });
