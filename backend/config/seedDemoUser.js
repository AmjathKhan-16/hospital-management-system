import User from '../models/User.js';

const DEMO_ADMIN = {
  name: 'Amjath',
  email: 'amjathak46@gmail.com',
  password: '123456',
  role: 'admin',
  isEmailVerified: true
};

export const seedDemoUser = async () => {
  const existing = await User.findOne({ email: DEMO_ADMIN.email });

  if (!existing) {
    await User.create(DEMO_ADMIN);
    console.log(`Demo admin ready: ${DEMO_ADMIN.email}`);
    return;
  }

  existing.name = DEMO_ADMIN.name;
  existing.password = DEMO_ADMIN.password;
  existing.markModified('password');
  existing.role = DEMO_ADMIN.role;
  existing.isEmailVerified = true;
  existing.emailOtp = undefined;
  existing.emailOtpExpires = undefined;
  await existing.save();
  console.log(`Demo admin updated: ${DEMO_ADMIN.email}`);
};