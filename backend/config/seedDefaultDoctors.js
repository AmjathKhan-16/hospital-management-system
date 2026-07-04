import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

const DEFAULT_DOCTORS = [
  ['Dr. Arjun Mehta', 'cardiology.doctor@hospital.local', 'Cardiology', 'Mon-Fri, 9:00 AM - 5:00 PM'],
  ['Dr. Kavya Raman', 'neurology.doctor@hospital.local', 'Neurology', 'Mon-Fri, 10:00 AM - 4:00 PM'],
  ['Dr. Sara Thomas', 'pulmonology.doctor@hospital.local', 'Pulmonology', 'Mon-Sat, 9:30 AM - 3:30 PM'],
  ['Dr. Nikhil Varma', 'gastro.doctor@hospital.local', 'Gastroenterology', 'Mon-Fri, 11:00 AM - 5:00 PM'],
  ['Dr. Farah Khan', 'nephrology.doctor@hospital.local', 'Nephrology', 'Tue-Sat, 9:00 AM - 2:00 PM'],
  ['Dr. Meera Iyer', 'endocrinology.doctor@hospital.local', 'Endocrinology', 'Mon-Fri, 8:30 AM - 2:30 PM'],
  ['Dr. Rohan Das', 'dermatology.doctor@hospital.local', 'Dermatology', 'Mon-Sat, 10:00 AM - 4:00 PM'],
  ['Dr. Prakash Nair', 'orthopedics.doctor@hospital.local', 'Orthopedics', 'Mon-Fri, 9:00 AM - 6:00 PM'],
  ['Dr. Anita George', 'ophthalmology.doctor@hospital.local', 'Ophthalmology', 'Mon-Fri, 9:00 AM - 1:00 PM'],
  ['Dr. Sameer Ali', 'ent.doctor@hospital.local', 'ENT', 'Mon-Sat, 10:00 AM - 3:00 PM'],
  ['Dr. Leena Joseph', 'gynecology.doctor@hospital.local', 'Gynecology and Obstetrics', 'Mon-Fri, 10:00 AM - 5:00 PM'],
  ['Dr. Priya Menon', 'pediatrics.doctor@hospital.local', 'Pediatrics', 'Mon-Sat, 9:00 AM - 5:00 PM'],
  ['Dr. Vikram Sethi', 'oncology.doctor@hospital.local', 'Oncology', 'Mon-Fri, 11:00 AM - 4:00 PM'],
  ['Dr. Aisha Rahman', 'psychiatry.doctor@hospital.local', 'Psychiatry', 'Tue-Sat, 10:00 AM - 4:00 PM'],
  ['Dr. Manoj Pillai', 'infectious.doctor@hospital.local', 'Infectious Diseases', 'Mon-Fri, 9:00 AM - 3:00 PM'],
  ['Dr. Neha Kapoor', 'emergency.doctor@hospital.local', 'Emergency Medicine', '24/7 Emergency Rotation'],
  ['Dr. Hari Krishnan', 'general.doctor@hospital.local', 'General Medicine', 'Mon-Sat, 8:00 AM - 6:00 PM']
];

export const seedDefaultDoctors = async () => {
  for (const [name, email, specialization, availability] of DEFAULT_DOCTORS) {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: '123456',
        role: 'doctor',
        isEmailVerified: true
      });
    } else {
      user.name = name;
      user.role = 'doctor';
      user.isEmailVerified = true;
      await user.save();
    }

    const existingDoctor = await Doctor.findOne({ userId: user._id });
    if (!existingDoctor) {
      await Doctor.create({ userId: user._id, specialization, availability });
    } else {
      existingDoctor.specialization = specialization;
      existingDoctor.availability = availability;
      await existingDoctor.save();
    }
  }

  console.log(`Default doctors ready: ${DEFAULT_DOCTORS.length}`);
};