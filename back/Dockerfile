# Usar imagem base leve
FROM node:20-slim

# Definir diretório de trabalho
WORKDIR /app

# Copiar os arquivos de dependência
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o restante do código
COPY . .

# Rodar o projeto com ts-node
CMD ["npx", "ts-node", "src/index.ts"]