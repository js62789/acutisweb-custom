var Table = require('./Table');
var datastore = {};

var today = new Date();
var tomorrow = new Date();
tomorrow.setDate(today.getDate()+1);

datastore['user'] = new Table({
  records: [
    {
      id: 1,
      username: 'jsmith',
      email: 'js62789@gmail.com',
      password: 'test',
      first_name: 'Jeffrey',
      last_name: 'Smith',
      challenge: '9999',
      admin: true,
      active: true,
      created_at: today
    }
  ],
  defaults: {
    admin: false,
    active: true,
    challenge: function () {
      return new Date().getTime().toString(36);
    },
    created_at: function () {
      return new Date();
    }
  }
});

datastore['article'] = new Table({
  records: [
    {
      id: 1,
      author_id: 1,
      title: 'Blah blah blah',
      content: 'Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah.',
      publish: true,
      active: true,
      created_at: today,
      updated_at: today
    },
    {
      id: 2,
      author_id: 1,
      title: 'Yak yak yak',
      content: 'Yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak yak.',
      publish: true,
      active: true,
      created_at: today,
      updated_at: today
    }
  ],
  defaults: {
    active: true,
    created_at: function () {
      return new Date();
    }
  }
});

datastore['inquiry'] = new Table({
  defaults: {
    read: false,
    created_at: function () {
      return new Date();
    }
  }
});

module.exports = datastore;
