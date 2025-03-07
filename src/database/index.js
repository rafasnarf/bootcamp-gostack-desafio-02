import Sequelize from 'sequelize';

import User from '../app/models/User';
import Student from '../app/models/Student';
import Subscription from '../app/models/Subscription';
import Registration from '../app/models/Registration';
import Checkin from '../app/models/Checkin';
import HelpOrders from '../app/models/HelpOrders';

import databaseConfig from '../config/database';

const models = [User, Student, Subscription, Registration, Checkin, HelpOrders];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
