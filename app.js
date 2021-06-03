const express = require('express');
const morgan = require('morgan')
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 3001;
let persons = [
	{
		name: 'Arto Hellas',
		number: '040-123456',
		id: 1,
	},
	{
		name: 'Ada Lovelace',
		number: '39-44-5323523',
		id: 2,
	},
	{
		name: 'Dan Abramov',
		number: '12-43-234345',
		id: 3,
	},
	{
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
		id: 4,
	},
];

const randomId = () => {
	return Math.floor(Math.random() * 100000);
};

app.use(express.json());
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


morgan.token('body', (req) => JSON.stringify(req.body))

app.get('/info', (request, response) => {
	const message = `<div>Phonebook has info for ${persons.length} people </div>${new Date()}`;
	response.send(message);
});

app.get('/api/persons', (request, response) => {
	response.json(persons);
});

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter(person => person.id !== id);

	response.status(204).end();
});

app.post('/api/persons/', (request, response) => {
	if (!request.body.name || !request.body.number) {
		return response.status(400).json({error: 'name or number was empty'});
	}
	const exist = persons.find(person => person.name.toLowerCase() === request.body.name.toLowerCase());
	if (exist) {
		return response.status(400).json({error: 'name bust be unique'});
	}
	const newUser = {
		name: request.body.name,
		number: request.body.number,
		id: randomId(),
	};
	persons = persons.concat(newUser);
	return response.json(newUser);
});

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find(person => person.id === id);
	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
	response.json(persons);
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({error: 'unknown endpoint'});
};

app.use(unknownEndpoint);

app.listen(PORT, () => {
	console.log('server running');
});
