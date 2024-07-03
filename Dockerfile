FROM node:18
WORKDIR /user/src/app

COPY ./package.json ./

RUN npm install

COPY ./index.js ./ 

COPY . .

EXPOSE 8000

CMD ["node","index.js"]