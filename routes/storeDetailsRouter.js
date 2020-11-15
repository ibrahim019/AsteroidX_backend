var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var StoreDetails = require('../models/storeDetails');


var storeDetailsRouter = express.Router();

storeDetailsRouter.route('/')
	.get(function (req, res, next) {
		StoreDetails.find(req.query, function (err, menuItems) {
			if (err) console.log('Something wrong with storeDetailsRouter');
			res.json(menuItems);
		});
	
    })


  
    
    module.exports = storeDetailsRouter;