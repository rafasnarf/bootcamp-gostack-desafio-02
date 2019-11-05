import Sequelize, { Model } from 'sequelize';

class Subscription extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        montlhyPrice: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    );
  }
}
export default Subscription;
