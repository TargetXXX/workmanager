FROM node:18.17.1

WORKDIR /src

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]