import { Router } from "express";
import studentController from "../controllers/student.controller";

const studentRoutes = Router();

// gets all appointments. Will be sorted on the client. No action available to user other than to view
studentRoutes.get("/:id/appointments", studentController.getAppointments);

export { studentRoutes };
