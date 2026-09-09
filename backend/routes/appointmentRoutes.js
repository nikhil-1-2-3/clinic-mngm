import express from 'express';
import {
  bookAppointment,
  getMyBookings,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment
} from '../controllers/appointmentController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, bookAppointment);
router.get('/my-bookings', protect, getMyBookings);
router.get('/', protect, adminOnly, getAllAppointments);
router.put('/:id', protect, updateAppointmentStatus);
router.delete('/:id', protect, cancelAppointment);

export default router;
