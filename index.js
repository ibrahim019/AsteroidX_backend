var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');
var multer = require('multer');
const cron = require("node-cron");
var Stores = require('./models/stores');
const axios = require('axios');

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

cron.schedule('0 12 * * * ', function() {
  console.log('running a task every minute');
  var resultStores=[];
  var storeProjection = {

    url: false,
    _id: false,
    __v: false,
    vendorTime:false
};
  Stores.find({},storeProjection, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      result.forEach((re)=>{
        resultStores.push(re.name)
        axios.get(re.name + "/products.json").then(resp => {


          var products = resp.data.products
          var vendors = []
          products.forEach((data, index) => {

              var a = vendors.findIndex(x => x.name == data.vendor)
              if (a == -1) {
                  var totV = 0.00
                  var n = 0
                  products[index].variants.forEach((variant, index) => {

                      totV = totV + parseFloat(variant.price)
                      n = n + 1

                  })

                  vendors.push({ "name": data.vendor, "nProducts": 1, "avg": +(totV / n).toFixed(2) })

              } else {
                  var totV = 0.00
                  var n = 0
                  products[index].variants.forEach((variant, index) => {

                      totV = +totV + parseFloat(variant.price)
                      n = n + 1

                  })
                  var avg = totV / n
                  vendors[a].avg = +((vendors[a].avg + avg) / 2).toFixed(2)
                  vendors[a].nProducts = vendors[a].nProducts + 1
              }

          })

          var vendorAll = {
              "VendorA": vendors,
              time: Date.now()

          }

          var doc = {
              "name": re.name,
              "url": re.name,
              "vendorTime": [vendorAll]
          }
          var query = { url: re.name }
          var update = { $push: { "vendorTime": vendorAll } }
          var options = {};
          Stores.findOneAndUpdate(query, update, options, function (error, result) {
              if (!error) {
                  // If the document doesn't exist
             
                  // Save the document

                  if (!error) {
                      // Do something with the document
                  } else {
                      throw error;
                  }

              } else { res.json(result); }

          });

      });
      })
      console.log(resultStores)
    }
  });
});


app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
  });