// models/index.ts
import { Orcamento } from './orcamentoModel';
import { OrcamentoItem } from './orcamentoitemModel';
import sequelize from '../config/database'; // Aqui importa a instância do sequelize

// Definir as associações entre os modelos
Orcamento.hasMany(OrcamentoItem, { foreignKey: 'orcamento_id', as: 'itens' });
OrcamentoItem.belongsTo(Orcamento, { foreignKey: 'orcamento_id' });

// Sincronizar os modelos com o banco de dados
sequelize.sync({ force: false })
  .then(() => {
    console.log('Modelos sincronizados com o banco de dados.');
  })
  .catch((err) => {
    console.error('Erro ao sincronizar modelos:', err);
  });

export { Orcamento, OrcamentoItem };