var path = require('path'),
  http = require('http'),
  express = require('express'),
  config = require('./config');

var app = express(),
  server = http.createServer(app),
  lessMiddleware = require('less-middleware'),
  MemoryStore = express.session.MemoryStore;

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
    compress: 'auto'
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '/public')));
  app.use(express.errorHandler());
});

app.get('/', function (req, res) {
  res.render('index', {
    title: 'Acutis Web Solutions, LLC'
  });
});

app.listen(config.port, function () {
  console.log('Server is running on port ' + config.port);
});
