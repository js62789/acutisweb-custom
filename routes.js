var mysql = require('mysql');
var crypto = require('crypto');
var config = require('./config');

var MysqlAdapter = require('./lib/adapters/MysqlAdapter');
var mysqlAdapter = new MysqlAdapter(mysql.createConnection(config.mysql));

var MemoryAdapter = require('./lib/adapters/MemoryAdapter');
var memoryAdapter = new MemoryAdapter();

var UserCollection = require('./lib/collections/UserCollection');
var users = new UserCollection({adapter: mysqlAdapter});

var ArticleCollection = require('./lib/collections/ArticleCollection');
var articles = new ArticleCollection({adapter: mysqlAdapter});

var InquiryCollection = require('./lib/collections/InquiryCollection');
var inquiries = new InquiryCollection({adapter: mysqlAdapter});

module.exports = function (app) {

  var env = app.settings.env;

  var requireAdmin = function (req, res, next) {
    var session = req.session;
    if (session.user && session.user.admin) {
      next();
    } else {
      res.render('admin/login', {
        title: 'Acutis Web Solutions',
        session: req.session,
        env: env,
        host: req.host
      });
    }
  };

  app.get('/', function (req, res) {
    res.render('index', {
      title: 'Acutis Web Solutions',
      session: req.session,
      env: env,
      host: req.host
    });
  });

  app.post('/inquiry', function (req, res) {
    var body = req.body;
    if (!body.name || !body.phone || !body.email || !body.description) {
      body.error = 'Please complete all fields before submitting your inquiry.';
      res.render('index', {
        title: 'Acutis Web Solutions',
        session: req.session,
        env: env,
        host: req.host,
        inquiry: body
      });
    } else {
      inquiries.create(req.body, function (err, id) {
        res.render('inquiry', {
          title: 'Acutis Web Solutions, LLC',
          session: req.session,
          env: env,
          host: req.host
        });
      });
    }
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
        env: env,
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
          env: env,
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
      env: env,
      host: req.host
    });
  });

  app.post('/admin/login', function (req, res, next) {
    var body = req.body;
    body.password = crypto.createHash('sha1').update(body.password + config.keys.auth_salt).digest('hex');
    console.log(config.keys.auth_salt, body.password);
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
        env: env,
        host: req.host,
        users: users
      });
    });
  });

  app.get('/admin/user', requireAdmin, function (req, res) {
    res.render('admin/user', {
      title: 'Acutis Web Solutions, LLC',
      session: req.session,
      env: env,
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
      body.password = crypto.createHash('sha1').update(body.password + config.keys.auth_salt).digest('hex');
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
          env: env,
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
        env: env,
        host: req.host,
        inquiries: inquiries
      });
    });
  });

  app.get('/admin/inquiry', requireAdmin, function (req, res) {
    res.render('admin/inquiry', {
      title: 'Acutis Web Solutions, LLC',
      session: req.session,
      env: env,
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
            env: env,
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
        env: env,
        host: req.host,
        articles: articles
      });
    });
  });

  app.get('/admin/article', requireAdmin, function (req, res) {
    res.render('admin/article', {
      title: 'Acutis Web Solutions, LLC',
      session: req.session,
      env: env,
      host: req.host
    });
  });

  app.post('/admin/article', requireAdmin, function (req, res, next) {
    var body = req.body;
    if (body.id) {
      body.publish = (body.publish === 'on') ? true : false;

      articles.update({where: {id: Number(body.id)}}, body, function (err) {
        if (err) {
          next(err);
          return;
        }
        
        res.redirect('/admin/article/' + body.id);
      });
    } else {
      body.author_id = req.session.user.id;

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
          env: env,
          host: req.host,
          article: article
        });
      } else {
        next('Something went wrong');
      }
    });
  });

};
