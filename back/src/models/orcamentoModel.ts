//orcamentoModel.ts

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';  // Importe o sequelize corretamente
import { OrcamentoItem } from './orcamentoitemModel';  // A importação do OrcamentoItem

export interface OrcamentoAttributes {
  id: number;
  nome: string;
  total: number;
  userId: number;
  data: Date;
}

export interface OrcamentoCreationAttributes {
  total: number;
  nome: string;
  userId: number;
  data: Date;
}

export class Orcamento extends Model<OrcamentoAttributes, OrcamentoCreationAttributes> implements OrcamentoAttributes {
  public id!: number;
  public nome!: string;
  public total!: number;
  public userId!: number;
  public data!: Date;
}

Orcamento.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',  // Nome correto da tabela de usuários no banco de dados
        key: 'id',       // Chave primária da tabela de usuários
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Orcamento',
    tableName: 'orcamentos',  // Nome correto da tabela
    timestamps: true,  // Habilita campos automáticos createdAt e updatedAt
  }
);
