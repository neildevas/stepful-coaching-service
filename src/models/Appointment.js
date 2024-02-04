import Sequelize, { Model } from "sequelize";

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        student_satisfaction_rating: Sequelize.INTEGER,
        notes: Sequelize.STRING,
        start_time: Sequelize.DATE,
        end_time: Sequelize.DATE,
        status: Sequelize.ENUM('inactive', 'active', 'ended')
      },
      {
        sequelize,
        timestamps: true, //If it's false do not add the attributes (updatedAt, createdAt).
        paranoid: true, //If it's true, it does not allow deleting from the bank, but inserts column deletedAt. Timestamps need be true.
        underscored: true, //If it's true, does not add camelcase for automatically generated attributes, so if we define updatedAt it will be created as updated_at.
        tableName: 'appointments' //Define table name
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, {
      as: 'Student',
      foreignKey: "student_id",
    });
    this.belongsTo(models.Coach, {
      as: 'Coach',
      foreignKey: 'coach_id'
    })
  }
}

export default Appointment;
