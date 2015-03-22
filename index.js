#! /usr/bin/env node

var fs = require("fs");
var path = require("path");
var git = require('gift');
var dir = require("node-dir");
var watch = require('watch');
var currentDir = process.cwd();
var repo = git(currentDir);

var autoCommit = function (file) {
	repo.add(file, function (err) {
		if (err) console.log(err);
		repo.commit("auto committed by Codestream", function (err) {
				if (err) console.log(err);
			repo.remote_push('origin', 'codestream', function (err) {
				if (err) console.log(err);
			});
		});
	});
}

watch.createMonitor(currentDir, {ignoreDotFiles: true, ignoreDirectoryPattern: /(node_modules)|(bower_components)/}, function (monitor) {
	if (repo == "undefined") {
		git.init(currentDir, function (err, repo) {
			console.log("Initializing local repository " + repo);
		});
	}

	monitor.on('created', function (file, stat) {
		console.log(file);
	});

	monitor.on('changed', function (file, curr, prev) {
		autoCommit(file);
	});

});

//add comment
//module.exports = {
	// var filewatcher = function () {
	// 	if (repo == "undefined") {
	// 		console.log("No Git repository initialized");
	// 		git.init(currentDir, function (err, repo) {
	// 			console.log(repo, " has been created");
	// 		});
	// 		return;
	// 	}
	// 	dir.files(currentDir, function (err, files) {
	// 		if (err) throw err;
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
	// 	});
	// }

	// filewatcher();
//}