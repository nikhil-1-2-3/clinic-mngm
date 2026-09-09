import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

// @desc    Get all doctors (with optional search/specialization filter)
// @route   GET /api/doctors
// @access  Public
export const getDoctors = async (req, res) => {
  try {
    const { specialization, search } = req.query;
    let query = {};

    if (specialization) {
      query.specialization = { $regex: new RegExp(specialization, 'i') };
    }

    if (search) {
      query.$or = [
        { name: { $regex: new RegExp(search, 'i') } },
        { specialization: { $regex: new RegExp(search, 'i') } },
        { bio: { $regex: new RegExp(search, 'i') } }
      ];
    }

    const doctors = await Doctor.find(query).sort({ createdAt: -1 });
    return res.json(doctors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    return res.json(doctor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new doctor
// @route   POST /api/doctors
// @access  Private/Admin
export const createDoctor = async (req, res) => {
  try {
    const { name, specialization, experience, availableDays, availableSlots, bio, contact, consultationFee } = req.body;

    if (!name || !specialization || experience === undefined) {
      return res.status(400).json({ message: 'Please provide name, specialization, and experience' });
    }

    const doctor = await Doctor.create({
      name,
      specialization,
      experience,
      availableDays: availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableSlots: availableSlots || ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
      bio: bio || 'Experienced healthcare specialist dedicated to patient wellness and comprehensive care.',
      contact: contact || '+1 (555) 234-5678',
      consultationFee: consultationFee || 75
    });

    return res.status(201).json(doctor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor details
// @route   PUT /api/doctors/:id
// @access  Private/Admin
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const { name, specialization, experience, availableDays, availableSlots, bio, contact, consultationFee } = req.body;

    if (name !== undefined) doctor.name = name;
    if (specialization !== undefined) doctor.specialization = specialization;
    if (experience !== undefined) doctor.experience = experience;
    if (availableDays !== undefined) doctor.availableDays = availableDays;
    if (availableSlots !== undefined) doctor.availableSlots = availableSlots;
    if (bio !== undefined) doctor.bio = bio;
    if (contact !== undefined) doctor.contact = contact;
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;

    const updatedDoctor = await doctor.save();
    return res.json(updatedDoctor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Delete associated appointments
    await Appointment.deleteMany({ doctorId: doctor._id });
    await Doctor.findByIdAndDelete(req.params.id);

    return res.json({ message: 'Doctor and associated appointments removed successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
