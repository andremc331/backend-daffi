import express from 'express';
import multer from 'multer';
import {Midia} from '../models/midiaModel';
import path from 'path';
import fs from 'fs';

const app = express.Router();

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: (arg0: null, arg1: string) => void) => {
    const uploadPath = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req: any, file: { originalname: any; }, cb: (arg0: null, arg1: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Rota para upload de mídia
app.post('/upload', upload.array('files'), async (req, res) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
  }

  try {
    const registros = await Promise.all(
      files.map(async (file) => {
        return await Midia.create({
          nome: file.originalname,
          tipo: file.mimetype,
          caminho: file.path,
          tamanho: file.size,
        });
      })
    );

    res.status(201).json({ message: 'Arquivos enviados com sucesso.', registros });
  } catch (err) {
    console.error('Erro ao salvar informações no banco de dados:', err);
    res.status(500).json({ message: 'Erro ao salvar informações no banco de dados.' });
  }
});

// Rota para listar mídias
app.get('/', async (req, res) => {
  try {
    const midias = await Midia.findAll();
    res.json(midias);
  } catch (err) {
    console.error('Erro ao buscar mídias:', err);
    res.status(500).json({ message: 'Erro ao buscar mídias.' });
  }
});

// Rota para exibir um arquivo específico
app.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const midia = await Midia.findByPk(id);

    if (!midia) {
      return res.status(404).json({ message: 'Mídia não encontrada.' });
    }

    res.sendFile(path.resolve(midia.caminho));
  } catch (err) {
    console.error('Erro ao buscar mídia:', err);
    res.status(500).json({ message: 'Erro ao buscar mídia.' });
  }
});

export default app;