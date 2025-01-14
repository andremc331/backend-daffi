import { Sequelize } from 'sequelize';
import { Orcamento } from '../models/orcamentoModel';
import { OrcamentoItem } from '../models/orcamentoitemModel';

// Carregar as variáveis de ambiente (considerando o uso de dotenv ou algo semelhante)
import dotenv from 'dotenv';
dotenv.config();

// Criação da instância do Sequelize para se conectar ao PostgreSQL
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST, // Exemplo de uso de variável de ambiente
  port: 5432,
  username: process.env.DB_USER, // Exemplo de uso de variável de ambiente
  password: process.env.DB_PASSWORD, // Exemplo de uso de variável de ambiente
  database: process.env.DB_NAME, // Exemplo de uso de variável de ambiente
  logging: false,
  dialectOptions: {
    connectTimeout: 60000,  // tempo limite de 10 segundos para conectar
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