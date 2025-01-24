import fs from 'fs';
import Papa from 'papaparse';
import { Item } from '../models/itemModel'; // Ajuste o caminho ao modelo Sequelize

// Defina a interface para o CSV
interface CSVRow {
  codigo: string;
  nome: string;
  unidade: string;
  material: string; // Os valores vêm como string no CSV
  maoDeObra: string; // O mesmo para esses campos
  total: string;
}

export const importarCSV = async () => {
  try {
    // Lê o arquivo CSV de forma assíncrona
    const csvData = await fs.promises.readFile('./src/data/sintetico.csv', 'utf8');

    // Corrigir aspas malformadas (remover as aspas extras)
    const fixedCsvData = csvData.replace(/"\s*$/, ''); // Remove aspas extras no final

    // Parse o CSV com tipagem
    const parsed = Papa.parse<CSVRow>(fixedCsvData, {
      header: true,
      skipEmptyLines: true,
      quoteChar: '"',  // Especifica o delimitador de campos entre aspas
      dynamicTyping: true,  // Tenta converter os tipos de dados automaticamente
      delimiter: ',', // Especifica o delimitador (se não for vírgula)
      escapeChar: '\\',  // Adiciona um caractere de escape
      comments: '#',  // Ignora linhas que começam com #
    });

    if (parsed.errors.length > 0) {
      console.error('Erros encontrados durante o parsing do CSV:', parsed.errors);
      return;
    }

    // Percorra os dados
    for (const row of parsed.data) {
      // Validação mais robusta dos dados antes de salvar no banco
      if (
        row &&
        row.codigo &&
        row.nome &&
        row.unidade &&
        !isNaN(parseFloat(row.material)) &&
        !isNaN(parseFloat(row.maoDeObra)) &&
        !isNaN(parseFloat(row.total)) &&
        parseFloat(row.material) >= 0 &&  // Permite material igual a 0
        parseFloat(row.maoDeObra) >= 0 && // Permite mão de obra igual a 0
        parseFloat(row.total) >= 0 // Permite total igual a 0
      ) {
        try {
          await Item.create({
            codigo: row.codigo,
            nome: row.nome,
            unidade: row.unidade,
            material: parseFloat(row.material),
            maoDeObra: parseFloat(row.maoDeObra),
            total: parseFloat(row.total),
          });
        } catch (err) {
          if (err instanceof Error) {
            console.error('Erro ao salvar item:', err.message);
            // Caso deseje registrar o erro em um arquivo de log
            fs.appendFileSync('./src/data/error_log.txt', `Erro ao salvar item: ${JSON.stringify(row)} - ${err.message}\n`);
          } else {
            console.error('Erro desconhecido ao salvar item:', err);
          }
        }
      } else {
        console.warn('Dados inválidos encontrados e ignorados:', row);
        // Caso deseje registrar os dados inválidos
        fs.appendFileSync('./src/data/invalid_data_log.txt', `Dados inválidos: ${JSON.stringify(row)}\n`);
      }
    }

    // console.log('Dados importados para o banco!');
  } catch (err) {
    if (err instanceof Error) {
      console.error('Erro ao ler ou processar o arquivo CSV:', err.message);
    } else {
      console.error('Erro desconhecido ao ler ou processar o arquivo CSV:', err);
    }
  }
};

// importarCSV().catch(console.error);