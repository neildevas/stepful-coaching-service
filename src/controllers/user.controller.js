import * as Yup from "yup";
import Address from "../models/Address";
import User from "../models/User";
import {
  BadRequestError,
  UnauthorizedError,
  ValidationError,
} from "../utils/ApiError";
import Student from "../models/Student";
import Coach from "../models/Coach";

//Yup is a JavaScript schema builder for value parsing and validation.

let userController = {
  add: async (req, res, next) => {
    try {
      // TODO - should take in the signup type to determine whether they are signing up as a student or coach
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().required().min(6),
        type: Yup.string().required().oneOf(['student', 'coach'])
      });
      console.log('REQ.BODY', req.body);
      if (!(await schema.isValid(req.body))) throw new ValidationError();
      const { email } = req.body;

      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) throw new BadRequestError();

      // TODO - would be better to put this in a transaction in case an operation fails.
      let user = await User.create(req.body);
      let studentProfile = null;
      let coachProfile = null;
      if (req.body.type === 'student') {
        studentProfile = await Student.create({ user_id: user.id });
        // create a student
      } else if (req.body.type === 'coach') {
        coachProfile = await Coach.create({ user_id: user.id });
      }
      const toInclude = studentProfile ? [{ model: Student, as: 'Student' }] : [{ model: Coach, as: 'Coach' }];
      user = await User.findOne({
        where: { id: user.id },
        include: toInclude,
      });
      user.userType = studentProfile ? 'student' : 'coach' // used on the UI to distinguish between student and coach
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  addAddress: async (req, res, next) => {
    try {
      const { body, userId } = req;

      const schema = Yup.object().shape({
        city: Yup.string().required(),
        state: Yup.string().required(),
        neighborhood: Yup.string().required(),
        country: Yup.string().required(),
      });

      if (!(await schema.isValid(body.address))) throw new ValidationError();

      const user = await User.findByPk(userId);

      let address = await Address.findOne({
        where: { ...body.address },
      });

      if (!address) {
        address = await Address.create(body.address);
      }

      await user.addAddress(address);

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const users = await User.findAll({
        include: [{
          model: Student,
          as: 'Student'
        }, {
          model: Coach,
          as: 'Coach'
        }]
      });
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },

  find: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, { include: [{ model: Coach, as: 'Coach' }, { model: Student, as: 'Student'}] });

      if (!user) throw new BadRequestError();

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        oldPassword: Yup.string().min(6),
        password: Yup.string()
          .min(6)
          .when("oldPassword", (oldPassword, field) => {
            if (oldPassword) {
              return field.required();
            } else {
              return field;
            }
          }),
        confirmPassword: Yup.string().when("password", (password, field) => {
          if (password) {
            return field.required().oneOf([Yup.ref("password")]);
          } else {
            return field;
          }
        }),
      });

      if (!(await schema.isValid(req.body))) throw new ValidationError();

      const { email, oldPassword } = req.body;

      const user = await User.findByPk(req.userId);

      if (email) {
        const userExists = await User.findOne({
          where: { email },
        });

        if (userExists) throw new BadRequestError();
      }

      if (oldPassword && !(await user.checkPassword(oldPassword)))
        throw new UnauthorizedError();

      const newUser = await user.update(req.body);

      return res.status(200).json(newUser);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) throw new BadRequestError();

      user.destroy();

      return res.status(200).json({ msg: "Deleted" });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
