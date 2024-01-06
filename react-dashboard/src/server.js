const express = require('express');
const path = require('path');
const cors = require('cors');

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cors());

app.get('/',(req,res) => {

});

//Global error handling
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: {err: 'An error occurred'},
  };
  const errorObj = {...defaultErr, ...err};
  console.log('error log:', errorObj.message);

  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT,()=> {
  console.log(`Server listening at port ${PORT}`);
});

module.exports = app;