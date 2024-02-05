import { Router } from "express";
import coachController from "../controllers/coach.controller";

const coachRoutes = Router();

// Gets all of a coaches appointments for viewing and updating.
// Will be filtered and sorted on the client.
coachRoutes.get('/:id/appointments', coachController.getAppointments)

export { coachRoutes };
