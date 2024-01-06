const express = require('express');
const path = require('path');
const cors = require('cors');

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cors());

app.get('/',(req,res) => {

});


app.listen(PORT,()=> {
  console.log(`Server listening at port ${PORT}`);
});

module.exports = app;