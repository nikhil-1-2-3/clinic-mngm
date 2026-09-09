import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true
    },
    experience: {
      type: Number,
      required: [true, 'Experience in years is required'],
      min: 0
    },
    availableDays: {
      type: [String],
      required: [true, 'Available days are required'],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    availableSlots: {
      type: [String],
      required: [true, 'Available slots are required'],
      default: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
    },
    bio: {
      type: String,
      default: 'Experienced healthcare specialist dedicated to patient wellness and comprehensive care.'
    },
    contact: {
      type: String,
      default: '+1 (555) 234-5678'
    },
    consultationFee: {
      type: Number,
      default: 75
    }
  },
  { timestamps: true }
);

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
