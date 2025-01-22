import { Sequelize } from 'sequelize';
import { Orcamento } from '../models/orcamentoModel';
import { OrcamentoItem } from '../models/orcamentoitemModel';

// Carregar as variáveis de ambiente (considerando o uso de dotenv ou algo semelhante)
import dotenv from 'dotenv';
dotenv.config();

// Criação da instância do Sequelize para se conectar ao PostgreSQL
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'autorack.proxy.rlwy.net',
  port: 12644,
  username: 'postgres',
  password: 'BnMZXdCYyNmjhfudskDnvNNDTlZKekWy',
  database: 'railway',
  logging: false,
  dialectOptions: {
    connectTimeout: 10000,  // tempo limite de 10 segundos para conectar
  },
});

// Testar a conexão
sequelize.authenticate()
.then(() => {
  console.log('Conexão com o banco de dados estabelecida com sucesso!');
})
  .catch((err) => {
    console.error('Erro ao conectar com o banco de dados:', err);
  });

  sequelize.sync({ force: false })  // O parâmetro "force: false" garante que ele não apagará as tabelas existentes
  .then(() => {
    console.log('Modelos sincronizados com o banco de dados.');
  })
  .catch((err) => {
    console.error('Erro ao sincronizar modelos:', err);
  });  

export default sequelize;