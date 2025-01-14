import path from "path";
import { gerarPDF } from "../scripts/pythonExecutor";
import express from 'express';

const app = express.Router();

app.post('/', async (req, res) => { 
    const dados = req.body;
  
    try {
        // Chama o script Python para gerar o PDF
        const result: any = await gerarPDF(dados);
        
        // Se o script Python retornou o nome do arquivo gerado
        const filePath = result.trim();

        // Verifica se o arquivo foi gerado corretamente
        const fullFilePath = path.resolve(filePath);

        // Envia o PDF de volta para o cliente
        res.sendFile(fullFilePath, (err) => {
            if (err) {
                console.error('Erro ao enviar o arquivo:', err);
                return res.status(500).send('Erro ao gerar o relatório');
            }
        });
    } catch (error) {
        console.error('Erro ao gerar o PDF:', error);
        return res.status(500).send('Erro ao gerar o relatório');
    }
});

export default app;