import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MidiaAttributes {
  id: number;
  nome: string;
  tipo: string;
  caminho: string; // Caminho para o arquivo armazenado
  tamanho: number;
}

interface MidiaCreationAttributes extends Optional<MidiaAttributes, 'id'> {}

class Midia extends Model<MidiaAttributes, MidiaCreationAttributes> implements MidiaAttributes {
  public id!: number;
  public nome!: string;
  public tipo!: string;
  public caminho!: string;
  public tamanho!: number;
}

Midia.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    caminho: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tamanho: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Midia',
    tableName: 'midias',
    timestamps: false,
  }
);

// Sincroniza o modelo com o banco de dados
Midia.sync({ alter: true }).then(() => {
  console.log('Tabela "Midias" criada ou alterada com sucesso!');
});

export { Midia };