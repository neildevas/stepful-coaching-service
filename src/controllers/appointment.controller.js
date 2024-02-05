import Appointment from "../models/Appointment";
import Coach from "../models/Coach";
import User from "../models/User";
import moment from 'moment';
import {
  BadRequestError,
} from "../utils/ApiError";

let appointmentController = {
  // Used by a coach to create an appointment
  createAppointment: async (req, res, next) => {
    try {
      const { coach_id, start_time } = req.body;
      const appointment = await Appointment.create({
        coach_id,
        start_time: new Date(start_time),
        end_time: moment(start_time).add(2, 'hours').toDate(),
      });
      res.status(200).json(appointment);
    } catch (err) {
      next(err);
    }
  },
  // Used by student to view appts available to book
  getAvailableAppointments: async (req, res, next) => {
    // gets all appointments that haven't been booked and aren't active or ended
    // TODO - filter by start time
    try {
      const availableAppointments = await Appointment.findAll({
        where: {
          student_id: null,
          status: 'inactive',
        },
        include: [{
          model: Coach,
          as: 'Coach',
          include: [{
            model: User,
            as: 'User',
            attributes: ['name', 'email']
          }]
        }]
      });
      res.status(200).json(availableAppointments);
    } catch (err) {
      next(err);
    }

  },
  // Used by student to book an appointment
  bookAppointment: async (req, res, next) => {
    try {
      // Ideally we would ensure that this user has no overlapping appointments before booking him
      const { student_id } = req.body;
      if (!student_id) throw new BadRequestError('student_id required');
      // First ensure that the appointment is valid to be booked
      const appointment = await Appointment.findByPk(req.params.id);
      if (!appointment) throw new Error('Could not find appointment');
      if (appointment.status !== 'inactive' || appointment.student_id !== null) {
        throw new Error('You cannot book this appointment');
      }
      await appointment.update({ student_id });
      res.status(200).json(appointment);
    } catch (err) {
      next(err);
    }

  },
  // Used by coach to change status, write notes, add student rating
  editAppointment: async (req, res, next) => {
    try {
      // Ideally we'd do validation on the appointment to edit here
      const { status, notes, student_satisfaction_rating } = req.body;
      const updates = {};
      if (status) {
        if (status !== 'ended') {
          throw new BadRequestError('Cannot change to any status but ended');
        }
        updates.status = status;
      }
      if (notes) {
        updates.notes = notes;
      }
      if (student_satisfaction_rating) {
        if (student_satisfaction_rating <= 1 || student_satisfaction_rating > 5) {
          throw new BadRequestError('Student satisfaction rating must be between 1 and 5');
        }
        updates.student_satisfaction_rating = student_satisfaction_rating;
      }
      const appointment = await Appointment.findByPk(req.params.id);
      if (!appointment) throw new Error('Could not find appointment');
     await appointment.update(updates);
     res.status(200).json(appointment);
    } catch (err) {
      next(err);
    }
  }
};

export default appointmentController;
