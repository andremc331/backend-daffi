import express from 'express';
import { Op } from 'sequelize'; // Importação do operador para condições no Sequelize
import { Item } from '../models/itemModel'; // Caminho para o modelo Item

const app = express.Router();

// Rota para buscar itens com base no termo de pesquisa
app.get('/', async (req, res) => {
  const termo = req.query.termo as string; // Obtém o termo da query string
  try {
    const itens = termo
      ? await Item.findAll({
          where: {
            nome: {
              [Op.iLike]: `%${termo}%`, // Busca insensível a maiúsculas/minúsculas
            },
          },
        })
      : await Item.findAll(); // Se não houver termo, retorna todos os itens
    res.json(itens);
  } catch (err) {
    console.error('Erro ao buscar itens:', err);
    res.status(500).json({ message: 'Erro ao buscar itens' });
  }
});

// Rota para buscar um item específico pelo ID
app.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Busca o item pelo ID
    const item = await Item.findByPk(id); // Usando `findByPk` para encontrar pelo ID primário

    if (!item) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    // Retorna apenas o nome do item
    res.json({ nome: item.nome });
  } catch (err) {
    console.error('Erro ao buscar item:', err);
    res.status(500).json({ message: 'Erro ao buscar item' });
  }
});

export default app;