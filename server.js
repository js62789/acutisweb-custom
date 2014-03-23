var path = require('path'),
  http = require('http'),
  express = require('express'),
  config = require('./config');

var app = express(),
  env = app.settings.env,
  server = http.createServer(app),
  lessMiddleware = require('less-middleware'),
  MemoryStore = express.session.MemoryStore;

var notFoundPage = function () {
  return function (req, res, next) {
    res.status(404);

    if (req.accepts('html')) {
      res.render('error', {
        title: 'Acutis Web Solutions, LLC',
        session: req.session,
        env: env,
        host: req.host,
        error: {
          title: '404 Not Found',
          message: 'The page you are looking for can not be found.'
        }
      });
    } else if (req.accepts('json')) {
      res.send({error: 'Not Found'});
    } else {
      res.type('txt').send('Not found');
    }
  }
};

app.configure('development', function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.cookieParser());
  app.use(express.session({
    store: new MemoryStore(),
    secret: 'supersecret',
    key: app.settings.env + '_sid'
  }));
  app.use(lessMiddleware({
    dest: '/css',
    src: '/less',
    prefix: '/css',
    root: path.join(__dirname, 'public'),
    compress: 'auto',
    autoprefix: ["last 7 versions", "> 10%"],
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '/public')));
  app.use(notFoundPage());
  app.use(express.errorHandler());
});

app.configure('production', function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.cookieParser());
  app.use(express.session({
    store: new MemoryStore(),
    secret: 'supersecret',
    key: env + '_sid'
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '/public')));
  app.use(notFoundPage());
  app.use(express.errorHandler());
});

require('./routes')(app);

app.listen(config.port, function () {
  console.log('Server is running on port ' + config.port + ' in ' + env);
});
