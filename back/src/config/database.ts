import { Sequelize } from 'sequelize';
import { Orcamento } from '../models/orcamentoModel';
import { OrcamentoItem } from '../models/orcamentoitemModel';

// Carregar as variáveis de ambiente (considerando o uso de dotenv ou algo semelhante)
import dotenv from 'dotenv';
dotenv.config();

// // Criação da instância do Sequelize para se conectar ao PostgreSQL
// const sequelize = new Sequelize({
//   dialect: 'postgres',
//   host: 'autorack.proxy.rlwy.net',
//   port: 12644,
//   username: 'postgres',
//   password: 'BnMZXdCYyNmjhfudskDnvNNDTlZKekWy',
//   database: 'railway',
//   logging: false,
//   dialectOptions: {
//     connectTimeout: 10000,  // tempo limite de 10 segundos para conectar
//   },
// });

// Criação da instância do Sequelize para se conectar ao PostgreSQL
const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT as any,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  dialectOptions: {
    connectTimeout: 10000,
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

// Função para encerrar o processo de forma limpa
const shutdown = (signal: string) => {
  return (err?: Error) => {
    console.log(`${signal} recebido...`);
    if (err) console.error(err.stack || err);

    // Aguardar um tempo para garantir que o processo seja fechado corretamente
    setTimeout(() => {
      console.log('Esperando 5 segundos, encerrando...');
      process.exit(err ? 1 : 0); // Encerra o processo com código 0 (sucesso) ou 1 (erro)
    }, 5000).unref(); // Desreferencia o temporizador para não bloquear o encerramento
  };
};
/////
// Adicionar tratamento para SIGTERM (geralmente enviado quando o container é desligado)
process.on('SIGTERM', shutdown('SIGTERM'));
// Adicionar tratamento para SIGINT (interrupção via Ctrl+C)
process.on('SIGINT', shutdown('SIGINT'));
// Adicionar tratamento para exceções não capturadas
process.on('uncaughtException', shutdown('uncaughtException'));

export default sequelize;