var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var Stores = require('../models/stores');
var request = require("request");
const axios = require('axios');

var storesRouter = express.Router();

storesRouter.route('/')
    .post(function (req, res, next) {

        axios.get(req.body.url + "/products.json").then(resp => {

             
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
                "name": req.body.url,
                "url": req.body.url,
                "vendorTime": [vendorAll]
            }
            var query = { url: req.body.url }
            var update = { $push: { "vendorTime": vendorAll } }
            var options = {};
            Stores.findOneAndUpdate(query, update, options, function (error, result) {
                if (!error) {
                    // If the document doesn't exist
                    if (!result) {
                        // Create it


                        Stores.create(doc, function (err, store) {
                            console.log(err)
                            if (err) console.log('Something wrong with storeDetailsRouter');
                            console.log('store item created!');
                            res.json(store);
                        })
                    }
                    // Save the document

                    if (!error) {
                        // Do something with the document
                    } else {
                        throw error;
                    }

                } else { res.json(result); }

            });

        })
        .catch(err => {
            console.log(err)
            if (err.response) {
             
              console.log(err.response)
            } else if (err.request) {
                console.log(err.request)
            } else {
              // anything else
            }
        });

    })

    .get(function (req, res, next) {
        var storeProjection = {
            vendorTime: false,
            url: false,
            _id: false,
            __v: false
        };
        Stores.find({}, storeProjection, function (err, storesResult) {
            if (err) console.log('Something wrong with stores');

            res.json(storesResult);
        });

    });
storesRouter.route('/dashboard')
    .post(function (req, res, next) {
        var storeProjection = {

            url: false,
            _id: false,
            __v: false
        };
        Stores.find({ url: req.body.url }, storeProjection, function (err, storesResult) {
            console.log(req.body.url)
            if (err) console.log('Something wrong with stores');
            
            res.json(storesResult);
        });

    });

    storesRouter.route('/delete')
    .post(function (req, res, next) {
        console.log(req.body)
        var storeProjection = {

            url: false,
            _id: false,
            __v: false
        };
        Stores.findOneAndDelete({  url: req.body.url }, function (err, docs) {
            if(err){ console.log(err);}
            else{
                console.log("Deleted entry : ", docs); 
                res.json(200);
            }
           
          });

    });


module.exports = storesRouter;