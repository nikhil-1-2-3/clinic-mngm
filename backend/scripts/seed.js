import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany();
    await Doctor.deleteMany();
    await Appointment.deleteMany();

    console.log('[Seed] Creating initial users...');
    const adminUser = await User.create({
      name: 'Clinic Administrator',
      email: 'admin@clinic.com',
      password: 'admin123',
      role: 'admin'
    });

    const samplePatient = await User.create({
      name: 'Sarah Jenkins',
      email: 'patient@clinic.com',
      password: 'patient123',
      role: 'user'
    });

    console.log('[Seed] Creating sample doctors...');
    const doctors = await Doctor.insertMany([
      {
        name: 'Dr. Elena Rostova',
        specialization: 'Cardiology',
        experience: 12,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableSlots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM'],
        bio: 'Senior Cardiologist specializing in preventative heart care, cardiovascular wellness, and non-invasive diagnostics.',
        contact: '+1 (555) 345-6789',
        consultationFee: 120
      },
      {
        name: 'Dr. Marcus Vance',
        specialization: 'Dermatology',
        experience: 8,
        availableDays: ['Tuesday', 'Thursday', 'Saturday'],
        availableSlots: ['10:00 AM', '11:30 AM', '03:00 PM', '04:30 PM'],
        bio: 'Board-certified dermatologist expert in clinical skin health, acne treatments, and cosmetic skin restoration.',
        contact: '+1 (555) 456-7890',
        consultationFee: 95
      },
      {
        name: 'Dr. Aisha Patel',
        specialization: 'Pediatrics',
        experience: 10,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        availableSlots: ['08:30 AM', '10:00 AM', '01:30 PM', '03:00 PM'],
        bio: 'Compassionate pediatric specialist dedicated to infant, child, and adolescent holistic healthcare.',
        contact: '+1 (555) 567-8901',
        consultationFee: 85
      },
      {
        name: 'Dr. David Chen',
        specialization: 'Orthopedics',
        experience: 15,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableSlots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM'],
        bio: 'Orthopedic surgeon and joint specialist focusing on sports injuries, spine health, and physical rehabilitation.',
        contact: '+1 (555) 678-9012',
        consultationFee: 150
      },
      {
        name: 'Dr. Sophia Martinez',
        specialization: 'Neurology',
        experience: 14,
        availableDays: ['Tuesday', 'Friday'],
        availableSlots: ['10:00 AM', '01:00 PM', '03:30 PM'],
        bio: 'Neurologist with advanced fellowship training in migraine management, neuromuscular disorders, and cognitive health.',
        contact: '+1 (555) 789-0123',
        consultationFee: 140
      },
      {
        name: 'Dr. Robert Miller',
        specialization: 'General Medicine',
        experience: 9,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
        bio: 'Primary care physician focusing on family health, annual physicals, chronic condition management, and wellness checks.',
        contact: '+1 (555) 890-1234',
        consultationFee: 70
      }
    ]);

    console.log('[Seed] Creating initial sample appointments...');
    // Tomorrow's date formatted as YYYY-MM-DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 5);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    await Appointment.create([
      {
        userId: samplePatient._id,
        doctorId: doctors[0]._id, // Dr. Elena Rostova
        appointmentDate: dateStr,
        appointmentTime: '09:00 AM',
        status: 'Confirmed',
        notes: 'Routine annual cardiac checkup'
      },
      {
        userId: samplePatient._id,
        doctorId: doctors[2]._id, // Dr. Aisha Patel
        appointmentDate: nextWeekStr,
        appointmentTime: '10:00 AM',
        status: 'Pending',
        notes: 'Child allergy consultation'
      }
    ]);

    console.log('----------------------------------------------------');
    console.log('✅ Seed completed successfully!');
    console.log('Admin Account:   admin@clinic.com / admin123');
    console.log('Patient Account: patient@clinic.com / patient123');
    console.log(`Seeded Doctors:  ${doctors.length}`);
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
