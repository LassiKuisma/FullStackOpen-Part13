const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'disabled', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.createTable('sessions', {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: 'users', key: 'id' },
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'disabled');
    await queryInterface.dropTable('sessions');
  },
};
