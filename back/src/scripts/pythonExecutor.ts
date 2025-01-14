import { spawn } from 'child_process';

export async function gerarPDF(dados: any) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['src/python/app.py', JSON.stringify(dados)]);

        pythonProcess.stdout.on('data', (data) => resolve(data.toString().trim()));
        pythonProcess.stderr.on('data', (data) => {
            console.error('Erro no script Python:', data.toString());
            reject(data.toString());
        });
    });
}