FROM node:18-buster
WORKDIR /app
ENV PORT 3000
COPY . . 
RUN npm install
EXPOSE 3000
COPY .env .
CMD [ "npm", "run", "start" ]