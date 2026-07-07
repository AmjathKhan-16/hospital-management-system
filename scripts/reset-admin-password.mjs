import { createRequire } from 'node:module';
import { connectDB } from '../backend/config/db.js';
import User from '../backend/models/User.js';

const require = createRequire(new URL('../backend/package.json', import.meta.url));
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: 'backend/.env' });

const admin = {
  name: 'Amjath',
  email: 'amjathak46@gmail.com',
  password: '123456',
  role: 'admin',
  isEmailVerified: true
};

await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/hospital-management');

const existing = await User.findOne({ email: admin.email });
const user = existing || new User({ email: admin.email });

user.name = admin.name;
user.password = admin.password;
user.markModified('password');
user.role = admin.role;
user.isEmailVerified = true;
user.emailOtp = undefined;
user.emailOtpExpires = undefined;
await user.save();

const saved = await User.findOne({ email: admin.email });
const matches = await saved.matchPassword(admin.password);
console.log(`${existing ? 'Admin password reset' : 'Admin created'}: ${admin.email}`);
console.log(`Password check: ${matches ? 'OK' : 'FAILED'}`);
console.log(`Stored password is hash: ${saved.password.startsWith('$2') ? 'yes' : 'no'}`);

await mongoose.disconnect();