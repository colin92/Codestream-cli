#! /usr/bin/env node

var fs = require("fs");
var path = require("path");

//var Git = require("nodegit");
var git = require('gift');

var repo = git(__dirname);

// var pathToRepo = path.resolve(_dirname, './.git');

// Git.Repository.open(pathToRepo)
// 	.then(function (repo) {
// 		return repo.openIndex();
// 	})
// 	.then()

// var getMostRecentCommit = function(repository) {
// 	return repository.getBranchCommit("master");
// };

// var getCommitMessage = function(commit) {
// 	return commit.message();
// }

var walk = function (dir, done) {
	var results = [];
	fs.readdir(dir, function (err, files) {
		if (err) return done(err);
		var pending = files.length;
		if (!pending) return done(null, results);
		files.forEach(function (file) {
			file = path.resolve(dir, file);
			fs.stat(file, function (err, stat) {
				if (stat && stat.isDirectory()) {
					walk(file, function (err, res) {
						results = results.concat(res);
						if (!--pending) done(null, results);
					});
				} else {
					results.push(file);
					if (!--pending) done(null, results);
				}
			});
		});
	});
}

walk(__dirname, function (err, results) {
	results.forEach(function (file) {
		fs.watch(file, function (event, filename) {
			repo.add('--all', function (err) {
				repo.commit('File Updated', function (err) {
					repo.commits(function (err, commits) {
						return commits;
					});
				});
			});
		});
	});
});
//add comment
//module.exports = currentFile;
		// files.forEach(function (file) {
		// 	console.log(file);
		// 	fs.watchFile(file, function (err, data) {
		// 		fs.readFile(file, {encoding: 'utf-8'}, function (err, data) {
		// 			// currentFile = file;
		// 			console.log(data);
		// 			//addcomment
		// 		});
		// 	});
		// });