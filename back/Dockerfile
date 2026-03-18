FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p uploads/images uploads/videos uploads/subtitles

EXPOSE 3000

CMD ["node", "index.js"]
