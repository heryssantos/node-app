var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var dbUrl = 'mongodb+srv://root:myrootpass@cluster0-dovuy.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(dbUrl, (err) => {
	console.log('mongodb connected', err);
});

app.get('/messages', (req, res) => {
	Message.find({}, (err, messages)=> {
		res.send(messages);
	})
});

app.post('/messages', (req, res) => {
	var message = new Message(req.body);
	message.save((err) => {
		if (err)
			sendStatus(500);
		console.log(req.body.name);
		if( req.body.name != 'Supertest62289189a322a00956557815fbd3b80d')
			io.emit('message', req.body);
		res.sendStatus(200);
	});
});

io.on('connection', () => {
	console.log('a user is connected');
});

var Message = mongoose.model('Message',{ name: String, message: String});

module.exports = app;