# Usa imagem oficial do Node.js v22
FROM node:22

# Define diretório de trabalho
WORKDIR /app

# Copia os ficheiros
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o resto da aplicação
COPY . .

# Expõe a porta
EXPOSE 3001

# Comando para iniciar a app
CMD ["npm", "run", "start"]
