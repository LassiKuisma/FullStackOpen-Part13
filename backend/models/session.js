const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../util/db');

class Session extends Model {}

Session.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'users', key: 'id' },
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    modelName: 'session',
  }
);

module.exports = Session;
