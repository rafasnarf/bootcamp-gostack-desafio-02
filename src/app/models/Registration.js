import Sequelize, { Model } from 'sequelize';

class Registrations extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        totalprice: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, {
      foreignKey: 'student_id',
      as: 'student',
    });
    this.belongsTo(models.Subscription, {
      foreignKey: 'subscription_id',
      as: 'subscription',
    });
  }
}

export default Registrations;
