const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

const MONGO_URI = 'mongodb+srv://shay:afirocks@cluster0.avuh6yo.mongodb.net/ludwig?retryWrites=true&w=majority';

app.use(express.json());
app.use(cors());

app.get('/', (req,res) => {
  res.send('send GET request');
});

app.post('/', (req, res) => {
  res.send('send POST request');
});

app.use('*', (req, res) => {
  res.sendStatus(404);
});

//Global error handling
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: {err: 'An error occurred'},
  };
  const errorObj = {...defaultErr, ...err}; //overide default with incoming err
  console.log('error log: ', errorObj.message);

  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT,()=> {
  console.log(`Server listening at port ${PORT}`);
});

module.exports = app;