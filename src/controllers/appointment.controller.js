import Appointment from "../models/Appointment";
import Coach from "../models/Coach";
import User from "../models/User";
import moment from 'moment';
import {
  BadRequestError,
  UnauthorizedError,
  ValidationError,
} from "../utils/ApiError";

let appointmentController = {
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
  getAvailableAppointments: async (req, res, next) => {
    // gets all appointments that haven't been booked and aren't active or ended
    // Haven't taken into account future start times
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
  bookAppointment: async (req, res, next) => {

  },
  editAppointment: async (req, res, next) => {
    try {
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
      await Appointment.update(updates, {
        where: { id: req.params.id }
      });
      const updatedAppointment = await Appointment.findByPk(req.params.id);
      res.status(200).json(updatedAppointment);
    } catch (err) {
      next(err);
    }
  }
};

export default appointmentController;
