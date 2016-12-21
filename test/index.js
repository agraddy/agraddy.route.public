var tap = require('agraddy.test.tap')(__filename);
var response = require('agraddy.test.res');

var pub = require('../');

process.chdir('test');

(function() {
	var routes = {};
	var res = response();
	var res2 = response();

	routes.get = {};

	pub(routes.get, 'public').on('loaded', function() {
		res.on('finish', function() {
			tap.assert.equal(res._body, 'about\n', 'Should serve the about.txt file.');
		});

		routes.get['/about.txt']({}, res);


		res2.on('finish', function() {
			tap.assert.equal(res2._body, 'second\n', 'Should serve the sub/second.css file.');
		});

		routes.get['/sub/second.css']({}, res2);
	});
})();

(function() {
	var routes = {};
	var res = response();

	routes.get = {};

	function header(req, res, lug, cb) {
		res.setHeader('X-Test', 'test');
		cb();
	}

	pub(routes.get, 'public', [header]).on('loaded', function() {
		res.on('finish', function() {
			tap.assert.deepEqual(res._headers[0], {"X-Test": "test"}, 'Should get header from luggage plugin.');
			tap.assert.equal(res._body, 'second\n', 'Should get file contents.');
		});

		routes.get['/sub/second.css']({}, res);
	});
})();

(function() {
	var routes = {};
	var res = response();

	routes.get = {};

	function header(req, res, lug, cb) {
		res.setHeader('X-Test', 'test');
		cb();
	}

	pub(routes.get, 'doesnotexist').on('loaded', function() {
		tap.assert.deepEqual(routes.get, {}, 'Should not add any routes when the directory does not exist.');
	});
})();




