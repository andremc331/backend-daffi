import bcrypt from 'bcrypt';
import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user: any) => {
      user.password = await bcrypt.hash(user.password, 10);
    },
  },
});

// Método estático para comparar senhas

export { User };