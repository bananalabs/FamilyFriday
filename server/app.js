var path = require('path');
var feathers = require('feathers');
var rest = require('feathers-rest');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var service = require('feathers-sequelize');

const sequelize = new Sequelize('sequelize', '', '', {
  dialect: 'sqlite',
  storage: path.join(__dirname, 'db.sqlite'),
  logging: true
});

const Employee = sequelize.define('employee', {
  name: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true
});

Employee.sync()
.then(() => {
  Employee.bulkCreate([
    {name: 'Happy'},
    {name: 'Dopey'},
    {name: 'Grumpy'},
    {name: 'Sneezy'},
    {name: 'Bashful'},
    {name: 'Sleepy'},
    {name: 'Doc'},
    {name: 'Snow'},
    {name: 'Alice'}
  ]);
  // Create a feathers instance.
  var app = feathers()
    // Enable REST services
    .configure(rest())
    // Turn on JSON parser for REST services
    .use(bodyParser.json())
    .use(function _f(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    })
    // Turn on URL-encoded parser for REST services
    .use(bodyParser.urlencoded({ extended: true }));

  // Create an in-memory Feathers service with a default page size of 2 items
  // and a maximum size of 4
  app.use('/employees', service({
    Model: Employee
  }));

  // A basic error handler, just like Express
  app.use(function (error, req, res, next) {
    console.log(error);
    res.json(error);
  });

  // Start the server
  app.listen(3030);

  console.log('Feathers sequelize service running on 127.0.0.1:3030');
})
