module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('students', 'hasplan', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'hasplan');
  },
};
