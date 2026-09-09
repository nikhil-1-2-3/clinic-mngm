import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, notes } = req.body;

    if (!doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ message: 'Please provide doctorId, appointmentDate, and appointmentTime' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if slot is already booked for this doctor on date & time (and not cancelled)
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate,
      appointmentTime,
      status: { $ne: 'Cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: `Dr. ${doctor.name} already has a booked appointment on ${appointmentDate} at ${appointmentTime}. Please select another time slot.`
      });
    }

    const appointment = await Appointment.create({
      userId: req.user._id,
      doctorId,
      appointmentDate,
      appointmentTime,
      notes: notes || '',
      status: 'Confirmed'
    });

    const populatedAppointment = await Appointment.findById(appointment._id).populate('doctorId', 'name specialization contact fee');

    return res.status(201).json(populatedAppointment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's appointments
// @route   GET /api/appointments/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .populate('doctorId', 'name specialization experience contact bio consultationFee')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments
// @access  Private/Admin
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('userId', 'name email')
      .populate('doctorId', 'name specialization experience')
      .sort({ createdAt: -1 });

    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify ownership or admin role
    if (appointment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to modify this appointment' });
    }

    if (status) {
      const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      }
      appointment.status = status;
    }

    if (notes !== undefined) {
      appointment.notes = notes;
    }

    const updatedAppointment = await appointment.save();
    const populated = await Appointment.findById(updatedAppointment._id)
      .populate('userId', 'name email')
      .populate('doctorId', 'name specialization');

    return res.json(populated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel an appointment
// @route   DELETE /api/appointments/:id
// @access  Private
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify ownership or admin role
    if (appointment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    return res.json({ message: 'Appointment cancelled successfully', appointmentId: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
