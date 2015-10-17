var http = require('http');
var url = require('url');
var qs = require('querystring');

var items = [];

http.createServer(function(req, res) {
	if(req.url == '/') {
		switch (req.method) {
			case 'GET':
				show(res);
			break;
			case 'POST':
				add(req, res);
			break;
			case 'DELETE':
				deleteNode(req, res);
			break;
			case 'PUT':
				put();
			break;
			default:
				badRequest(res);
		}
	} else {
		notFound(res);
	}
}).listen(3005);

var show = function(res) {
	var html = "<html><head><title>Form Handling</title></head><body>" +
				"<ul>" +
				items.forEach(function(item, i){
				"<li>" +
					item +
				"</li>"
				}) +
				"</ul>" +
				"<form method='post' action='/'>" + 
				"<input type='textbox' name='item' />" +
				"<input type='submit' value='Add Item' />"+
				"</form>" +
				"<form method='delete' action='/'>" + 
				"<input type='textbox' name='item' />" +
				"<input type='submit' value='Delete Item' />"+
				"</form>" +
				"</body></html>";
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Content-Length', Buffer.byteLength(html));
	res.end(html);
};

var add = function(req, res) {
	var body = '';
	req.setEncoding('utf8');
	req.on('data', function(chunk) {
		body += chunk;
	});
	req.on('end', function() {
		items.push(qs.parse(body).item);
		show(res);
	});
};

var notFound = function(res) {
	res.statusCode = 404;
	res.setHeader('content-Type', 'text/plain');
	res.end('Not Found');
};

var badRequest = function(res) {
	res.statusCode = 400;
	res.setHeader('content-Type', 'text/plain');
	res.end('Bad Request');
};

var deleteNode = function(req, res) {
	var toBeDeletedData = '';
	req.setEncoding('utf8');
	req.on('data', function(chunk) {
		toBeDeletedData += chunk;
	});
	req.on('end', function() {
		var deleteItem = qs.parse(toBeDeletedData).item;
		if(!items.exists(deleteItem))
			res.end("Item Not Found.");
		items.splice(deleteItem, 1);
		show(res);
		res.end("Item Deleted Successfully.");
	});
};