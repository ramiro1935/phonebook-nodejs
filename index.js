require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/person');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('build'));
app.use(express.json());
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

morgan.token('body', req => JSON.stringify(req.body));

app.get('/info', (request, response) => {
	Person.find({}).then(result => {
		const message = `<div>Phonebook has info for ${result.length} people </div>${new Date()}`;
		response.send(message);
	});
});

app.get('/api/persons', (request, response) => {
	Person.find({}).then(result => {
		response.json(result);
	});
});

app.delete('/api/persons/:id', (request, response) => {
	Person.findByIdAndRemove(request.params.id).then(() => {
		response.status(204).end();
	});
});

app.post('/api/persons/', (request, response, next) => {
	const body = request.body;
	if (!body.name || !body.number) {
		return response.status(400).json({ error: 'name or number was empty' });
	}
	const newPerson = new Person({
		name: request.body.name,
		number: request.body.number,
	});

	newPerson
		.save()
		.then(() => {
			return response.json(newPerson);
		})
		.catch(err => next(err));
});

app.put('/api/persons/:id', (request, response, next) => {
	console.log(request.body, 'params', request.params.id);
	if (!request.body.name || !request.body.number) {
		return response.status(400).json({ error: 'name or number was empty' });
	}
	const newPerson = new Person({
		name: request.body.name,
		number: request.body.number,
		_id: request.params.id,
	});

	Person.findByIdAndUpdate(request.params.id, newPerson, { new: true })
		.then(updatedPerson => {
			response.json(updatedPerson);
		})
		.catch(error => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then(person => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch(err => next(err));
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
	console.log(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		return response.status(400).send({ error: error.message });
	}
	next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
	console.log('server running');
});
