FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh
CMD ["sh", "./entrypoint.sh"]
