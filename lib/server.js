const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
const app = express();
const todoList = require("./todoList");
const db = require('./db');

/**
 * Body parser middleware
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/*
* Static routes
*/
app.use(express.static(path.resolve('./public')));


/*
* Default route
*/
app.get('/',  (req, res) => {
	res.sendFile(path.resolve('./public/index.html'));
});


//Serve the axios library to the frontend
app.get('/axios', (req, res) => {
	res.sendFile(path.resolve('./node_modules/axios/dist/axios.min.js'))
});


/*
 * API routes
 */
app.get('/api/task', (req, res) => {
	todoList.getList((err, rows) => {
		if (err) {
			console.error('Error', err)
			res.send({error: "Error fetching the tasks list"});
			return;
		}
		res.send(rows);
	});
});

app.put('/api/task/:id/toggle', (req, res) => {
	const id = req.params.id;
	if (!id) {
		res.send({error: 'Missing id'});
		return;
	}
	todoList.toggleTask(id, (err, row) => {
		if (err) {
			console.error('Error', err)
			res.send({error: JSON.stringify(`Error toggling task ${id}`)});
			return;
		}
		res.send(row);
	});
});

app.delete('/api/task/:id', (req, res) => {
	const id = req.params.id;
	if (!id) {
		res.send({error: 'Missing id'});
		return;
	}
	todoList.deleteTask(id, (err, row) => {
		if (err) {
			console.error('Error', err)
			res.send({error: JSON.stringify(`Error deleting task ${id}`)});
			return;
		}
		res.send(row);
	});
});

app.post('/api/task', (req, res) => {
	const { name , description } = req.body;
	if (!name) {
		console.log('ERROR', name, description)
		res.send({error: 'Missing name'});
		return;
	}
	todoList.addTask(name, description, (err, row) => {
		if (err) {
			console.error('Error', err)
			res.send({error: JSON.stringify(`Error Adding task`)});
			return;
		}
		res.send(row);
	});
});

/*
* Start server
*/
const start = (port = 3000) => {
  app.listen(port, () => {
    console.log(`http://localhost:${port}`)
  });

  app.on('close', function() {
	db.close();
	console.log(' Stopping ...');
  });
};

exports.start = start;

