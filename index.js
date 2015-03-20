#! /usr/bin/env node

var fs = require("fs");
var path = require("path");
var git = require('gift');
var dir = require("node-dir");
var http = require('http');

var currentDir = process.cwd();
var repo = git(currentDir);
http.get('www.github.com/repos/Rmoore424/filewatcher/hooks', function (res) {
	console.log("got Response");
}).on('error', function (e) {
	console.log('Got Error' + e.message);
});
//module.exports = {
	var filewatcher = function () {
		if (repo == "undefined") {
			console.log("No Git repository initialized");
			return;
		}
		dir.files(currentDir, function (err, files) {
			if (err) throw err;
			// files.forEach(function (file) {
			// 	if (!file.match(/node_modules/) && !file.match(/.git/)) {
			// 		fs.watchFile(file, function (curr, prev) {
			// 			 repo.add(file, function (err) {
			// 			 	 repo.commit("auto commited by filewatcher", function (err) {
			// 					repo.remote_push("origin", "live2code", function (err) {
			// 						if (err) console.log(err);

			// 					});
			// 			 	 });
			// 			 });
			// 		});
			// 	}
			// });
		});
	}

	filewatcher();
//}