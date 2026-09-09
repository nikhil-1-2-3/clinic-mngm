import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor ID is required']
    },
    appointmentDate: {
      type: String,
      required: [true, 'Appointment date is required']
    },
    appointmentTime: {
      type: String,
      required: [true, 'Appointment time is required']
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Confirmed'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

// Compound index to quickly find existing appointments for doctor on specific date/time
appointmentSchema.index({ doctorId: 1, appointmentDate: 1, appointmentTime: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
