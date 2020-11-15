var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var storeDetailsSchema = new Schema({
	ID: {
		type: Number,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true
    },
    url:{
        type: String,
        required:true
    },
    products:{
        type: Object,
        required:true
    },
    
});

var StoreDetails = mongoose.model('StoreDetails', storeDetailsSchema);

module.exports = StoreDetails;