<h1 align="center">Bangkit Capstone Project 2024</h1>
<br>
<p align='center'>
  <a href="https://expressjs.com/">
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />        
  </a>&nbsp;&nbsp;
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  </a>&nbsp;&nbsp;
  <a href="https://knexjs.org/">
    <img src="https://img.shields.io/badge/Knex.js-263B63?style=for-the-badge&logo=knex&logoColor=white" />
  </a>&nbsp;&nbsp;
  <a href="https://www.mysql.com/">
    <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  </a>&nbsp;&nbsp;
  <a href="https://www.tensorflow.org/js">
    <img src="https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" />
  </a>&nbsp;&nbsp;
</p>
<br>

## Bangkit Capstone Project 2024
Bangkit Capstone Team ID : C241-PS201 <br>
Here is our repository for Bangkit 2024 Capstone project - Cloud Computing

## Introduction
These are the source code for the cloud API that are being used by the application as the backend server that will give back responses for the application.

## Library

- Built with Express.JS
  
- Migration and Seeders using KnexJS
  
- Tensorflow JS for running the model in node.js environment

## Installation

- Clone this repo using any method (https, ssh, gh, cli)
``` cp.env.local .env ```

- Install all required packages via npm ``` npm install  ```
OR
- Install the apps via dockerfile 
- Install knex js ``` npm install -g knex ```
- Set up Database and Cloudstorage Bucket configuration inside .env file.
- Insert the model URL into the .env file ```MODEL_URL```
- Run the migration and seeder
```
knex migrate:latest
```
and
```
knex seed:run
```

## Starting The Local Server
- For Development you can use either
```
npm run start
```
OR for development
``` 
npm run dev
 ```

## License
Bangkit Academy Capstone Team C241-PS201 <br>
(LICENSE) © Rafi Arian Yusuf @Syifa Mumtaz
