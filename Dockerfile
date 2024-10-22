# Imagem node Alpine 20.3
FROM node:20.3-alpine

# Define o diretório de trabalho
WORKDIR /home/node/app

# Copia os arquivos package.json e package-lock.json para o diretório de trabalho
# COPY package*.json ./

# Instala as dependências do projeto
# RUN npm install

# Copia os arquivos da aplicação para o diretório de trabalho
COPY . .

# Expõe a porta em que a aplicação roda
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["sh", "-c", "npm run start:dev"]