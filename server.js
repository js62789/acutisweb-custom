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
    compress: 'auto',
    autoprefix: ["last 7 versions", "> 10%"],
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '/public')));
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
    key: app.settings.env + '_sid'
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '/public')));
  app.use(express.errorHandler());
});

var requireAdmin = function (req, res, next) {
  if (req.session.user && req.session.user.admin) {
    next();
  } else {
    res.render('admin/login', {
      title: 'Acutis Web Solutions, LLC',
      session: req.session,
      env: app.settings.env,
      host: req.host
    });
  }
};

app.get('/', function (req, res) {
  res.render('index', {
    title: 'Acutis Web Solutions, LLC',
    session: req.session,
    env: app.settings.env,
    host: req.host
  });
});

app.get('/blog', function (req, res) {
  res.render('blog', {
    title: 'Acutis Web Solutions, LLC',
    session: req.session,
    env: app.settings.env,
    host: req.host
  });
});

app.get('/blog/article/:article_id', function (req, res) {
  res.render('article', {
    title: 'Acutis Web Solutions, LLC',
    session: req.session,
    env: app.settings.env,
    host: req.host
  });
});

app.get('/admin', requireAdmin, function (req, res) {
  res.render('admin/index', {
    title: 'Acutis Web Solutions, LLC',
    session: req.session,
    env: app.settings.env,
    host: req.host
  });
});

app.post('/admin/login', function (req, res) {
  req.session.user = {};
  req.session.user.admin = true;
  res.redirect('/admin');
});

app.get('/admin/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});

app.get('/admin/users', requireAdmin, function (req, res) {
  res.render('admin/users', {
    title: 'Acutis Web Solutions, LLC',
    session: req.session,
    env: app.settings.env,
    host: req.host
  });
});

app.get('/admin/user', requireAdmin, function (req, res) {
  res.render('admin/user', {
    title: 'Acutis Web Solutions, LLC',
    session: req.session,
    env: app.settings.env,
    host: req.host
  });
});

app.get('/admin/user/:user_id', requireAdmin, function (req, res) {
  res.render('admin/user', {
    title: 'Acutis Web Solutions, LLC',
    session: req.session,
    env: app.settings.env,
    host: req.host
  });
});

app.get('/admin/articles', requireAdmin, function (req, res) {
  res.render('admin/articles', {
    title: 'Acutis Web Solutions, LLC',
    session: req.session,
    env: app.settings.env,
    host: req.host
  });
});

app.get('/admin/article', requireAdmin, function (req, res) {
  res.render('admin/article', {
    title: 'Acutis Web Solutions, LLC',
    session: req.session,
    env: app.settings.env,
    host: req.host
  });
});

app.get('/admin/article/:article_id', requireAdmin, function (req, res) {
  res.render('admin/article', {
    title: 'Acutis Web Solutions, LLC',
    session: req.session,
    env: app.settings.env,
    host: req.host
  });
});

app.listen(config.port, function () {
  console.log('Server is running on port ' + config.port);
});
