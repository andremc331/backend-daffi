import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Interface para definir os atributos do modelo Item
interface ItemAttributes {
  id: number;
  codigo: string;
  nome: string;
  unidade: string;
  material: number;
  maoDeObra: number;
  total: number;
}

// Interface para definir os atributos opcionais (usado na criação)
interface ItemCreationAttributes extends Optional<ItemAttributes, 'id'> {}

class Item extends Model<ItemAttributes, ItemCreationAttributes> implements ItemAttributes {
  public id!: number;
  public codigo!: string;
  public nome!: string;
  public unidade!: string;
  public material!: number;
  public maoDeObra!: number;
  public total!: number;

  // Outras propriedades podem ser adicionadas aqui, se necessário
}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unidade: {
      type: DataTypes.STRING,
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
  },
  {
    sequelize, // Passa a instância do Sequelize
    modelName: 'Item', // Nome do modelo
    tableName: 'itens', // Nome da tabela no banco de dados
    timestamps: false, // Se você não estiver usando colunas createdAt/updatedAt
  }
);

// Sincronizar o modelo com o banco de dados
Item.sync({ alter: true }).then(() => {
  console.log('Tabela "Itens" criada ou alterada com sucesso!');
});

export { Item };