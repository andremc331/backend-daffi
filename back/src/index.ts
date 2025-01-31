import express from 'express';
import cors from 'cors';
import sequelize from './config/database';
import userRoutes from './routes/userRoutes';
import itemRoutes from './routes/itemRoutes';
import { importarCSV } from './scripts/ImportarCSV'; // Importe a função de importação do CSV
import orcamentoRoutes from './routes/orcamentoRoutes';
import { spawn } from 'child_process';
import pdfRoutes from './routes/pdfRoutes';
import './models';  // Aqui você chama o arquivo que importa e inicializa os modelos
import midiaRoutes from './routes/midiaRoutes';
import path from 'path';

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      process.env.CORS_ALLOWED_ORIGIN
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Origem permitida
    } else {
      callback(new Error('Not allowed by CORS'), false); // Origem não permitida
    }
  },
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
// Adicione uma resposta explícita para requisições OPTIONS

app.use(express.json()); // Middleware para fazer o parsing de JSON
// Definindo as rotas
// Middleware para servir arquivos estáticos da pasta de uploads
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
// Rotas
app.use('/midias', midiaRoutes);
app.use('/api/orcamentos', orcamentoRoutes);
app.use('/api/orcamento', orcamentoRoutes);  // Rota para orçamentos
app.use('/users', userRoutes);  // Rota para usuários
app.use('/api/itens', itemRoutes);  // Rota para itens
app.use('/gerar-pdf', pdfRoutes);

// Inicialização do banco de dados
sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados realizada com sucesso!');
  })
  .catch((err) => {
    console.error('Erro ao conectar com o banco de dados:', err);
  });

// Sincroniza os modelos e inicia o servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Banco de dados sincronizado');
    return importarCSV(); // Chama a função de importação do CSV após a sincronização
  })
  .then(() => {
    console.log('Importação do CSV concluída!');
  })
  .catch((err) => {
    console.error('Erro ao sincronizar banco de dados ou importar CSV', err);
  });

// Iniciando o servidor na porta 3001
const PORT = 3005;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando e acessível externamente em http://<seu-ip>:${PORT}`);
});