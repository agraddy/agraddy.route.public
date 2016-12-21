var each = require('agraddy.async.each');
var events = require('events');
var file = require('agraddy.route.file');
var fs = require('fs');
var path = require('path');
var util = require('util');

var mod = function(routes, plugins) {
	var emitter = new events.EventEmitter();
	var public_dir = path.join(process.cwd(), 'public');

	function getFiles(dir, cb) {
		var output = [];
		fs.readdir(dir, function(err, files) {
			each(files, function(file, cb2) {
				fs.stat(path.join(dir, file) , function(err, stats) {
					if(stats && stats.isFile()) {
						output.push(path.join(dir, file));
						cb2();
					} else if(stats && stats.isDirectory()) {
						// Recursive getFiles
						getFiles(path.join(dir, file), function(err, files) {
							output = output.concat(files);
							cb2();
						});
					} else {
						cb2();
					}
				});
			}, function(err) {
				cb(null, output);
			});
		});
	}

	getFiles(public_dir, function(err, files) {
		files.forEach(function(item) {
			var len = process.cwd().length;
			var filename_with_public = item.slice(len + 1);
			var filename_without_public = item.slice(len + 7);
			file(routes, filename_without_public, filename_with_public, plugins);
		});

		emitter.emit('loaded');
	});

	return emitter;
}

module.exports = mod;
