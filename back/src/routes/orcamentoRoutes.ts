//orcamentoRoutes

import express from 'express';
import jwt from 'jsonwebtoken';  // Importa o pacote jwt
import { Orcamento } from '../models/orcamentoModel';
import { OrcamentoItem } from '../models/orcamentoitemModel';
import { DATEONLY } from 'sequelize';

// Definindo o tipo de dados do usuário no token
interface User {
  id: number;
  email: string; // ou outras propriedades que o seu token contiver
}

// Extendendo o tipo Request para incluir a propriedade 'user'
declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

const router = express.Router();

// Função de autenticação usando JWT diretamente
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extrai o token do header

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado, token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, 'secret') as User;  // Verifica e decodifica o token
    req.user = decoded;  // Adiciona as informações do usuário no objeto da requisição
    next();  // Chama a próxima função na cadeia de middlewares
  } catch (err) {
    console.error('Erro ao verificar o token:', err);
    res.status(400).json({ message: 'Token inválido' });
  }
};

// Definindo tipos para os parâmetros 'orcamento' e 'item'
interface OrcamentoItemType {
  nome: string,
  id: number;
  quantidade: number;
  materialTotal: number;
  maoDeObraTotal: number;
  total: number;
  data: Date;
}

interface OrcamentoRequestBody {
  orcamento: OrcamentoItemType[];
}

router.post('/', authenticate, async (req: express.Request, res: express.Response) => {
  const { orcamento, nome, data }: { orcamento: OrcamentoItemType[]; nome: string; data: Date } = req.body;  // Inclui o nome no corpo da requisição
  const userId = req.user.id;  // Obtém o userId do token JWT

  if (!nome.trim()) {
    return res.status(400).json({ message: 'O nome do orçamento é obrigatório!' });
  }

  try {
    // Calcula o total geral do orçamento
    const totalGeral = orcamento.reduce((total, item) => total + item.total, 0);

    // Cria o orçamento com o nome e o total geral
    const novoOrcamento = await Orcamento.create({
      nome,
      total: totalGeral,
      userId,
      data,
    });

    // Associa os itens do orçamento, incluindo o nome do item
    for (const item of orcamento) {
      await OrcamentoItem.create({
        orcamento_id: novoOrcamento.id,
        itemId: item.id,
        nome: item.nome,  // Inclui o nome do item na associação
        quantidade: item.quantidade,
        material: item.materialTotal,
        maoDeObra: item.maoDeObraTotal,
        total: item.total,
        data: item.data,
      });
    }
    
    res.status(201).json({ message: 'Orçamento salvo com sucesso!', orcamentoId: novoOrcamento.id });
  } catch (err) {
    console.error('Erro ao salvar orçamento:', err);
    res.status(500).json({ message: 'Erro ao salvar orçamento' });
  }
});

// Rota para listar todos os orçamentos de um usuário
router.get('/', authenticate, async (req: express.Request, res: express.Response) => {
  const userId = req.user.id;  // Obtém o userId do token JWT

  try {
    const orcamentos = await Orcamento.findAll({ where: { userId } });
    res.json(orcamentos);
  } catch (err) {
    console.error('Erro ao listar orçamentos:', err);
    res.status(500).json({ message: 'Erro ao listar orçamentos' });
  }
});

// Rota para obter um orçamento específico
router.get('/:id', async (req: express.Request, res: express.Response) => {
  const { id } = req.params;

  try {
    const orcamento = await Orcamento.findOne({
      where: { id },
      include: [
        {
          model: OrcamentoItem,
          as: 'itens',
          attributes: ['id', 'nome', 'quantidade', 'material', 'maoDeObra', 'total',],  // Garantir que o campo nome esteja incluído
        }
      ]
    });

    if (!orcamento) {
      return res.status(404).json({ message: 'Orçamento não encontrado' });
    }

    res.status(200).json(orcamento);
  } catch (err) {
    console.error('Erro ao buscar orçamento:', err);
    res.status(500).json({ message: 'Erro ao buscar orçamento' });
  }
});

// Rota para excluir um orçamento
router.delete('/:id', authenticate, async (req: express.Request, res: express.Response) => {
    const { id } = req.params;  // Obtém o ID do orçamento a ser excluído
    const userId = req.user.id;  // Obtém o userId do token JWT
  
    try {
      // Verifica se o orçamento existe e se pertence ao usuário
      const orcamento = await Orcamento.findOne({ where: { id, userId } });
      if (!orcamento) {
        return res.status(404).json({ message: 'Orçamento não encontrado ou não autorizado a excluí-lo' });
      }
  
      // Exclui o orçamento
      await Orcamento.destroy({ where: { id } });
      res.status(200).json({ message: 'Orçamento excluído com sucesso' });
    } catch (err) {
      console.error('Erro ao excluir orçamento:', err);
      res.status(500).json({ message: 'Erro ao excluir orçamento' });
    }
  });
// Exportando o roteador para ser utilizado no app principal
export default router;