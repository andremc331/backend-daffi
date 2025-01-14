//orcamentoitemModel.ts

import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { Orcamento } from './orcamentoModel'; 

const OrcamentoItem = sequelize.define('OrcamentoItem', {
  nome: {
    type: DataTypes.STRING,
    allowNull: true, // Adicione o campo nome
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  material: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  maoDeObra: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'orcamento_items',  // Ajuste no nome da tabela
});


export { OrcamentoItem };