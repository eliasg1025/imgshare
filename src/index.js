const express = require('express');
const config = require('./server/config');

require('./database');
const app = config(express());

app.listen(app.get('port'), () => {
  console.log(
    `El servirdor es corriendo en http://127.0.0.1:${app.get('port')}`
  );
});
