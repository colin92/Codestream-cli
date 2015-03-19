#! /usr/bin/env node

var fs = require("fs");
var path = require("path");
var git = require('gift');
var dir = require("node-dir");
var currentDir = process.cwd();
console.log(currentDir);
var repo = git(currentDir);
//console.log(repo);
module.exports = {
	filewatcher: function () {
		console.log("is running");
		if (repo == "undefined") {
			//console.log('repo is undefined');
			throw new Error("No Git repository initialized");
			return;
		}
		dir.files(currentDir, function (err, files) {
			//console.log("files", files);
			if (err) throw err;
			files.forEach(function (file) {
				if (!file.match(/node_modules/) && !file.match(/.git/)) {
					fs.watchFile(file, function (curr, prev) {
						 repo.add(file, function (err) {
						 	 repo.commit("File Updated", function (err) {
								repo.remote_push("origin", "master", function (err) {
									if (err) console.log(err);
								});
						 	 });
						 });
					});
				}
			});
		});
	}
}