FROM node:16

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos de dependências para o diretório de trabalho
COPY ./package.json ./package-lock.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

# Instalar o ts-node globalmente
RUN npm install ts-node --save-dev

# Rodar o código TypeScript diretamente
CMD ["npx", "ts-node", "index.ts"]