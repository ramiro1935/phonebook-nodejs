const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI;
console.log('connection to ', url);

mongoose
	.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => {
		console.log('connected to Mongodb');
	})
	.catch(error => {
		console.log('error connecting to MongoDB', error.message);
	});

const person = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true,
		unique: true,
	},
	number: {
		type: String,
		required: true,
		minLength: 8,
	},
});

person.plugin(uniqueValidator);

person.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Person', person);
