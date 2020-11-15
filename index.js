var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');
var multer = require('multer');
const cron = require("node-cron");


//connect to MongoDB
// connect to db
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected correctly to server');
  //console.log(db)
});

// require routers
var storesRouter = require('./routes/storesRouter');
var storesDetailsRouter = require('./routes/storeDetailsRouter');

//Serve Backend
var app = express();
app.set('port', (process.env.PORT || 8080));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(cors());
app.use(function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.set('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token');
  next();
});

// set up static routes
//app.use(express.static(path.join(__dirname, 'public')));

// use routers
app.use('/stores', storesRouter);
app.use('/store', storesDetailsRouter);

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
  });