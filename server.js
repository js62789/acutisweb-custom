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

// var MysqlAdapter = require('./lib/adapters/MysqlAdapter');
// var mysqlAdapter = new MysqlAdapter(config.mysql);

var MemoryAdapter = require('./lib/adapters/MemoryAdapter');
var memoryAdapter = new MemoryAdapter();

var UserCollection = require('./lib/collections/UserCollection');
var users = new UserCollection({adapter: memoryAdapter});

var ArticleCollection = require('./lib/collections/ArticleCollection');
var articles = new ArticleCollection({adapter: memoryAdapter});

var InquiryCollection = require('./lib/collections/InquiryCollection');
var inquiries = new InquiryCollection({adapter: memoryAdapter});

var requireAdmin = function (req, res, next) {
  var session = req.session;
  if (session.user && session.user.admin) {
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

app.post('/inquiry', function (req, res) {
  inquiries.create(req.body, function (err, id) {
    res.render('inquiry', {
      title: 'Acutis Web Solutions, LLC',
      session: req.session,
      env: app.settings.env,
      host: req.host
    });
  });
});

app.get('/blog', function (req, res, next) {
  articles.find({limit: 10, where: {publish: true, active: true}}, function (err, articles){
    if (err) {
      next(err);
      return;
    }

    res.render('blog', {
      title: 'Acutis Web Solutions, LLC',
      session: req.session,
      env: app.settings.env,
      host: req.host,
      articles: articles
    });
  });
});

app.get('/blog/article/:article_id', function (req, res, next) {
  articles.findOne({where: {id: Number(req.params.article_id), publish: true, active: true}}, function (err, article){
    if (err) {
      next(err);
      return;
    }

    if (article) {
      res.render('article', {
        title: 'Acutis Web Solutions, LLC',
        session: req.session,
        env: app.settings.env,
        host: req.host,
        article: article
      });
    } else {
      next('Something went wrong');
    }
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

app.post('/admin/login', function (req, res, next) {
  var body = req.body;
  users.findOne({where: {username: body.username, password: body.password}}, function (err, user) {
    if (err) {
      next(err);
      return;
    }

    if (user) {
      req.session.user = user;
    }

    res.redirect('/admin');
  });
});

app.get('/admin/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/admin');
});

app.get('/admin/users', requireAdmin, function (req, res) {
  users.find({}, function (err, users) {
    if (err) {
      next(err);
      return;
    }

    res.render('admin/users', {
      title: 'Acutis Web Solutions, LLC',
      session: req.session,
      env: app.settings.env,
      host: req.host,
      users: users
    });
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

app.post('/admin/user', requireAdmin, function (req, res, next) {
  var body = req.body;
  if (body.id) {
    if (!user.admin) user.admin = false;
    users.update({where: {id: Number(body.id)}}, body, function (err) {
      if (err) {
        next(err);
        return;
      }

      res.redirect('/admin/user/' + body.id);
    });
  } else {
    users.create(body, function (err, id) {
      if (err) {
        next(err);
        return;
      }
      
      res.redirect('/admin/users');
    });
  }
});

app.get('/admin/user/:user_id', requireAdmin, function (req, res, next) {
  users.findOne({where: {id: Number(req.params.user_id)}}, function (err, user) {
    if (err) {
      next(err);
      return;
    }

    if (user) {
      res.render('admin/user', {
        title: 'Acutis Web Solutions, LLC',
        session: req.session,
        env: app.settings.env,
        host: req.host,
        user: user
      });
    } else {
      next('Something went wrong');
    }
  });
});

app.get('/admin/inquiries', requireAdmin, function (req, res) {
  inquiries.find({}, function (err, inquiries) {
    if (err) {
      next(err);
      return;
    }

    res.render('admin/inquiries', {
      title: 'Acutis Web Solutions, LLC',
      session: req.session,
      env: app.settings.env,
      host: req.host,
      inquiries: inquiries
    });
  });
});

app.get('/admin/inquiry', requireAdmin, function (req, res) {
  res.render('admin/inquiry', {
    title: 'Acutis Web Solutions, LLC',
    session: req.session,
    env: app.settings.env,
    host: req.host
  });
});

app.get('/admin/inquiry/:inquiry_id', requireAdmin, function (req, res, next) {
  inquiries.update({where: {id: Number(req.params.inquiry_id)}}, {read: true}, function (err) {
    if (err) {
      next(err);
      return;
    }
    
    inquiries.findOne({where: {id: Number(req.params.inquiry_id)}}, function (err, inquiry) {
      if (err) {
        next(err);
        return;
      }

      if (inquiry) {
        res.render('admin/inquiry', {
          title: 'Acutis Web Solutions, LLC',
          session: req.session,
          env: app.settings.env,
          host: req.host,
          inquiry: inquiry
        });
      } else {
        next('Something went wrong');
      }
    });
  });
});

app.get('/admin/articles', requireAdmin, function (req, res) {
  articles.find({}, function (err, articles) {
    if (err) {
      next(err);
      return;
    }

    res.render('admin/articles', {
      title: 'Acutis Web Solutions, LLC',
      session: req.session,
      env: app.settings.env,
      host: req.host,
      articles: articles
    });
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

app.post('/admin/article', requireAdmin, function (req, res, next) {
  var body = req.body;
  if (body.id) {
    if (!body.publish) body.publish = false;

    articles.update({where: {id: Number(body.id)}}, body, function (err) {
      if (err) {
        next(err);
        return;
      }
      
      res.redirect('/admin/article/' + body.id);
    });
  } else {
    articles.create(body, function (err, id) {
      if (err) {
        next(err);
        return;
      }
      
      res.redirect('/admin/articles');
    });
  }
});

app.get('/admin/article/:article_id', requireAdmin, function (req, res, next) {
  articles.findOne({where: {id: Number(req.params.article_id)}}, function (err, article) {
    if (err) {
      next(err);
      return;
    }

    if (article) {
      res.render('admin/article', {
        title: 'Acutis Web Solutions, LLC',
        session: req.session,
        env: app.settings.env,
        host: req.host,
        article: article
      });
    } else {
      next('Something went wrong');
    }
  });
});

app.listen(config.port, function () {
  console.log('Server is running on port ' + config.port);
});
