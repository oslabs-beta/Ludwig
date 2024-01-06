const express = require('express');
const path = require('path');

const PORT = 3000;
const app = express();

app.listen(PORT,()=> {
  console.log(`Server listening at port ${PORT}`);
});

module.exports = app;