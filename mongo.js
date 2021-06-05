//mongodb+srv://cryofrain:<password>@cluster0.dx2ub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log(
		'Please provide the password as an argument: node mongo.js <password>'
	);
	process.exit(1);
}

const password = process.argv[2];

const url = process.env.MONGODB_URI || '';

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model(
	'Person',
	personSchema
);

if (process.argv.length > 3) {
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4],
	});

	person.save().then(() => {
		console.log('person saved!');
		mongoose.connection.close();
	});
}

if (process.argv.length === 3) {
	Person.find({}).then(result => {
		result.forEach(person => {
			console.log(
				`${person.name} ${person.number}`
			);
		});
		mongoose.connection.close();
	});
}
