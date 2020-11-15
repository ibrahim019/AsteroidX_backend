var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var storesSchema = new Schema({

    name: {
        type: String,
        //required: true,
        //unique: true
    },
    url: {
        type: String,
        //required:true
    },
    firstUpdate: {
        type: Boolean,
        //required:true
    },
    avgPrice: {
        type: Number
    },
    rawData: {
        type: Object
    },

    vendorTime: {
        type: Array,
        vendorAll:{
            type: Object,
            time:{
               type:Date
            }
        }
        

    },
    /*  products: {
         type: Array,
         product:{
             type:Object,
             id: {
                 type: Number
             },
             name:{
                 type: String
             },
             avgPrice:{
                 type: Number
             },
             variants:{
                 type: Array,
                 variant:{
                     type:Object,
                     title: {
                         type: String
                     },
                     price: {
                         type: String
                     }
                     
                 }
             }
         }
      
 
 
 
     } */
});

var Stores = mongoose.model('Stores', storesSchema);

module.exports = Stores;