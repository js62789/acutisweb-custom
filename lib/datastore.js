var Table = require('./Table');
var datastore = {};

var today = new Date();
var tomorrow = new Date();
tomorrow.setDate(today.getDate()+1);

datastore['user'] = new Table({
  records: [
    {
      id: 1,
      username: 'test',
      email: 'test@test.com',
      password: 'test',
      first_name: 'Test',
      last_name: 'Account',
      challenge: '9999',
      active: true
    },
    {
      id: 2,
      username: 'jsmith',
      email: 'jsmith@test.com',
      password: 'test',
      first_name: 'Jeff',
      last_name: 'Smith',
      challenge: '9999',
      active: true
    }
  ],
  defaults: {
    id: function () {
      return this.records[this.records.length-1].id + 1;
    },
    active: true,
    resetKey: '9999',
    created_at: function () {
      return new Date();
    }
  }
});

datastore['auth'] = new Table({
  records: [
    {
      id: 1,
      user_id: 1,
      oauth_prov: 'facebook',
      oauth_uid: 666666,
      created_at: today
    }
  ],
  defaults: {
    id: function () {
      return this.records[this.records.length-1].id + 1;
    },
    created_at: function () {
      return new Date();
    }
  }
})

datastore['donation'] = new Table({
  records: [
    {
      id: 1,
      user_id: 1,
      created_at: today,
      updated_at: today,
      organization_id: 1
    }
  ],
  defaults: {
    id: function () {
      return this.records[this.records.length-1].id + 1;
    },
    created_at: function () {
      return new Date();
    }
  }
});

datastore['organization'] = new Table({
  records: [
    {
      id: 1,
      name: 'Test Organization 1',
      created_at: today,
      updated_at: today,
      active: true
    },
    {
      id: 2,
      name: 'Test Organization 2',
      created_at: today,
      updated_at: today,
      active: true
    },
    {
      id: 3,
      name: 'Test Organization 3',
      created_at: today,
      updated_at: today,
      active: true
    },
    {
      id: 4,
      name: 'Test Organization 4',
      created_at: today,
      updated_at: today,
      active: true
    }
  ],
  defaults: {
    id: function () {
      return this.records[this.records.length-1].id + 1;
    },
    created_at: function () {
      return new Date();
    }
  }
});

datastore['ticket'] = new Table({
  records: [
    {
      donation_id: 1,
      prize_id: 20
    }
  ],
  defaults: {
    id: function () {
      return this.records[this.records.length-1].id + 1;
    },
    created_at: function () {
      return new Date();
    }
  }
});

datastore['prize'] = new Table({
  records: [
    {
      id: 1,
      product_id: 1,
      start_at: today,
      end_at: tomorrow,
      price: 20.00,
      created_at: today,
      updated_at: today,
      active: true
    },
    {
      id: 2,
      product_id: 1,
      start_at: today,
      end_at: tomorrow,
      price: 20.00,
      created_at: today,
      updated_at: today,
      active: true
    },
    {
      id: 3,
      product_id: 1,
      start_at: today,
      end_at: tomorrow,
      price: 20.00,
      created_at: today,
      updated_at: today,
      active: true
    },
    {
      id: 4,
      product_id: 1,
      start_at: today,
      end_at: tomorrow,
      price: 20.00,
      created_at: today,
      updated_at: today,
      active: true
    }
  ],
  defaults: {
    id: function () {
      return this.records[this.records.length-1].id + 1;
    },
    created_at: function () {
      return new Date();
    }
  }
});

datastore['product'] = new Table({
  records: [
    {
      id: 1,
      name: 'Apple iPad',
      img_sm: 'http://placehold.it/120x120',
      img_md: '',
      img_lg: '',
      created_at: today,
      updated_at: today,
      active: true
    }
  ],
  defaults: {
    id: function () {
      return this.records[this.records.length-1].id + 1;
    },
    created_at: function () {
      return new Date();
    }
  }
});

module.exports = datastore;
