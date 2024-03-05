const PORT = 80;

var express = require('express');
var app = express();
// Statically serve src, allowing cors
app.use(express.static('src'));
// Statically serve node_modules/paper/dist
app.use('/paper/dist', express.static('node_modules/paper/dist'));



app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});