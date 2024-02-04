import { Router } from "express";
import appointmentController from "../controllers/appointment.controller";

const appointmentRoutes = Router();

// Gets all available coach appointments, used by students
appointmentRoutes.get("/available", appointmentController.getAvailableAppointments);

// Book an appointment, used by students
appointmentRoutes.put('/:id/book', appointmentController.bookAppointment);

// Allows a coach to create an appointment
appointmentRoutes.post('/', appointmentController.createAppointment);

// Allows a coach to end an appointment, add notes, and add a student rating
appointmentRoutes.put('/:id', appointmentController.editAppointment)

export { appointmentRoutes };
