FROM node:20.15.0-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 4000

CMD ["npm", "run", "dev"]