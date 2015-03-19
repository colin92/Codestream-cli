#! /usr/bin/env node

var fs = require("fs");
var path = require("path");
var git = require('gift');
var dir = require("node-dir");
var repo = git(__dirname);

dir.files(__dirname, function (err, files) {
	if (err) throw err;
	files.forEach(function (file) {
		if (!file.match(/node_modules/) && !file.match(/.git/)) {
			fs.watch(file, function (event, filename) {
				repo.add("--all", function (err) {
					repo.commit("File Updated", function (err) {
						repo.remotes(function (remotes) {
							console.log(remotes);
						});
					});
				});
			});
		}
	});
});
// var walk = function (dir, done) {
// 	var results = [];
// 	fs.readdir(dir, function (err, files) {
// 		if (err) return done(err);
// 		var pending = files.length;
// 		if (!pending) return done(null, results);
// 		files.forEach(function (file) {
// 			file = path.resolve(dir, file);
// 			fs.stat(file, function (err, stat) {
// 				if (stat && stat.isDirectory()) {
// 					walk(file, function (err, res) {
// 						results = results.concat(res);
// 						if (!--pending) done(null, results);
// 					});
// 				} else {
// 					results.push(file);
// 					if (!--pending) done(null, results);
// 				}
// 			});
// 		});
// 	});
// }

// var watchFilesAndCommit = function (err, results) {
// 	results.forEach(function (file) {
// 		fs.watch(file, function (event, filename) {
// 			console.log(event);
// 			repo.add('--all', function (err) {
// 				repo.commit('File Updated', function (err) {
// 					repo.commits(function (err, commits) {
// 						return commits;
// 					});
// 				});
// 			});
// 		});
// 	});
// };
//add comment
// walk(__dirname, watchFilesAndCommit);
//});