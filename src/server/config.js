const path = require('path');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const multer = require('multer');
const express = require('express');

const routes = require('../routes/index');

module.exports = app => {
  // Settings
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, '../views'));
  app.engine(
    '.hbs',
    exphbs({
      defaultLayout: 'main',
      layoutsDir: path.join(app.get('views'), 'layouts'),
      partialsDir: path.join(app.get('views'), 'partials'),
      helpers: require('./helpers'),
      extname: '.hbs'
    })
  );
  app.set('view engine', '.hbs');
  app.use(
    multer({ dest: path.join(__dirname, '../public/upload/temp') }).single(
      'image'
    )
  );

  // Middlewares
  app.use(morgan('dev'));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Routes
  routes(app);

  // Static files
  app.use('/public', express.static(path.join(__dirname, '../public')));

  // Error handlers

  return app;
};
