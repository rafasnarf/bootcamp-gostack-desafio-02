import Sequelize, { Model } from 'sequelize';

class Subscription extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        price: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Subscription;
