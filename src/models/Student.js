import { Model } from "sequelize";

class Student extends Model {
  static init(sequelize) {
    super.init(
      {}, // do I need userId and id here?
      {
        sequelize,
        timestamps: true,
        paranoid: true, //If it's true, it does not allow deleting from the bank, but inserts column deletedAt. Timestamps need be true.
        underscored: true, //If it's true, does not add camelcase for automatically generated attributes, so if we define updatedAt it will be created as updated_at.
        tableName: 'students' //Define table name
      }
    )
  }

  static associate(models) {
    this.belongsTo(models.User, {
      as: 'User',
      foreignKey: "user_id",
    });
    this.hasMany(models.Appointment, { foreignKey: 'student_id' });
  }
}

export default Student;
