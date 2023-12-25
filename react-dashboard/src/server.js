const express = require('express');
const cors = require('cors');


const app = express();
const port = 3695;

app.use(express.json());
app.use(cors());

//get request to database 
//app.get()

//catch unknown routes
app.use((req,res) => res.status(404).send('Page not found'));

//global error handling
app.use((err, req, res, next) => {
  console.log('ERROR HERE: ', err);
  const defaultErr = {
    log: 'Express error hander caught unknown middleware error',
    status: 500,
    message: {err: 'An error occurred'}
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});
