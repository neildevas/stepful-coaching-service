import Appointment from "../models/Appointment";
import Coach from "../models/Coach";
import User from "../models/User";

let studentController = {
  getAppointments: async (req, res, next) => {
    try {
      const appointments = await Appointment.findAll({
        where: { student_id: req.params.id },
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
      return res.status(200).json(appointments);
    } catch (err) {
      next(err);
    }
  }
}
export default studentController;
