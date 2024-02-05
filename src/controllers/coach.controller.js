import Appointment from "../models/Appointment";
import Student from "../models/Student";
import User from "../models/User";

const coachController = {
  getAppointments: async (req, res, next) => {
    try {
      const appointments = await Appointment.findAll({
        where: {
          coach_id: req.params.id,
        },
        include: [{
          model: Student,
          as: 'Student',
          include: [{
            model: User,
            as: 'User',
            attributes: ['id', 'name', 'email']
          }]
        }]
      });
      res.status(200).json(appointments);
    } catch (err) {
      next(err);
    }
  }
};

export default coachController;
