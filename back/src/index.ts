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

const allowedOrigins = [
  'https://main.d1txub5s9ryib1.amplifyapp.com', // Frontend hospedado no Amplify
  'https://backend-daffi.railway.app', // Backend hospedado no Railway
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // A origem é permitida
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permitir cookies e autenticação
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Headers permitidos
};

const app = express();
app.use(cors(corsOptions));

// Adicione uma resposta explícita para requisições OPTIONS
app.options('*', cors(corsOptions)); // Permite requisições preflight para qualquer rota

app.use(express.json()); // Middleware para fazer o parsing de JSON

// Definindo as rotas
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
const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando e acessível externamente em http://<seu-ip>:${PORT}`);
});