import mongoose from 'mongoose';
import net from 'net';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

const isLocalMongoRunning = (host = '127.0.0.1', port = 27017, timeoutMs = 200) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isConnected = false;

    socket.setTimeout(timeoutMs);
    socket.on('connect', () => {
      isConnected = true;
      socket.destroy();
    });
    socket.on('timeout', () => socket.destroy());
    socket.on('error', () => socket.destroy());
    socket.on('close', () => resolve(isConnected));

    socket.connect(port, host);
  });
};

const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Database] Empty database detected. Auto-seeding default demo accounts...');

      await User.create({
        name: 'Clinic Administrator',
        email: 'admin@clinic.com',
        password: 'admin123',
        role: 'admin'
      });

      await User.create({
        name: 'Sarah Jenkins',
        email: 'patient@clinic.com',
        password: 'patient123',
        role: 'user'
      });

      await Doctor.insertMany([
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
      console.log('✅ Auto-seed completed successfully!');
    }
  } catch (err) {
    console.warn('[Auto-seed Notice]', err.message);
  }
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clinic_booking';

  if (mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost')) {
    const isPortOpen = await isLocalMongoRunning('127.0.0.1', 27017, 200);
    if (isPortOpen) {
      try {
        const conn = await mongoose.connect(mongoUri);
        console.log(`[Database] Connected to Local MongoDB: ${conn.connection.host}`);
        await autoSeedIfEmpty();
        return conn;
      } catch (err) {
        console.warn(`[Database] Local MongoDB connection failed: ${err.message}`);
      }
    }
  } else {
    try {
      const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      console.log(`[Database] Connected to External MongoDB: ${conn.connection.host}`);
      await autoSeedIfEmpty();
      return conn;
    } catch (err) {
      console.warn(`[Database] External MongoDB connection failed: ${err.message}`);
    }
  }

  // Fast Fallback: Embedded In-Memory MongoDB Server
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const conn = await mongoose.connect(uri);
    console.log(`[Database] Embedded In-Memory MongoDB Connected: ${uri}`);
    await autoSeedIfEmpty();
    return conn;
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
