var express = require('express');
var cors = require('cors')
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors())

const clientRoutes = require('./routers/client.js')
app.use(clientRoutes);

const entityRoutes = require('./routers/entity.js')
app.use(entityRoutes);

const companyRoutes = require('./routers/company.js')
app.use(companyRoutes);

//const incotermRoutes = require('./routers/incoterm.js')
//app.use(incotermRoutes);

const bankRoutes = require('./routers/bank.js')
app.use(bankRoutes);

const paymentTermRoutes = require('./routers/paymentTerm.js')
app.use(paymentTermRoutes);

const affiliatedRoutes = require('./routers/affiliated.js')
app.use(affiliatedRoutes);

const supplierTermRoutes = require('./routers/supplier.js')
app.use(supplierTermRoutes);

var intPostStartUp = function intPostStartUp() {
    // bind error middleware
    app.use(_ErrorMiddleware.ErrorMiddleware);
  };
  
  exports.intPostStartUp = intPostStartUp;

  app.get('/', function (req, res) {
    res.send('hello world')
  })
  
// set port
app.listen(3020, function() {
    console.log('Node app is running on port 3020');
});
module.exports = app;