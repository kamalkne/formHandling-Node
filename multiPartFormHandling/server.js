var http = require('http');
var url = require('url');
var formidable = require('formidable');

http.createServer(function(req, res) {
	if(req.url == '/') {
		switch (req.method) {
			case 'GET':
				show();
				break;
			case 'POST':
				upload(req, res);
				break;
			default:
				invalidRequest(res);
		}
	}
});

var show = function() {
	var html = "<html><head></head><body><form method='put' action='/' enctype='multipart/form-data'>" +
				"<input type='file' name='fileUpload' />" +
				"<input type='submit' value='Upload' />" +
				"</form></body><html>";
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Content-Length', Buffer.byteLength(html));
	res.end(html);
};

var upload = function(req, res) {
	if(!isFormData(req)){
		res.statusCode = 400;
		res.setHeader('Content-Type', 'text/plain');
		res.end('Bad Request: Expecting Multipart Data');
		return;
	}
	
	var form = 	new formidable.IncomingForm();
	
	form.on('field', function(field, value) {
		console.log(field);
		console.log(value);
	});
	
	form.on('file', function(name, file) {
		console.log(name);
		console.log(file);
	});
	
	form.on('end', function() {
		res.end('Upload Complete.')
	});
	
	form.parse(req);
	
	// form.parse(req, function(err, fields, files) {
		// console.log(fields);
		// console.log(files);
		// res.end('Upload Complete.');
	// });
};

var isFormData = function(req) {
	var multiCheck = req.headers['content-type'] || '';
	return 0 == multiCheck.indexOf('multipart/form-data');
};