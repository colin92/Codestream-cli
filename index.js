#! /usr/bin/env node

var fs = require("fs");
var path = require("path");
var git = require('gift');
var dir = require("node-dir");
var repo = git(__dirname);

module.exports = {
	filewatcher: function () {
		if (repo == "undefined") {
			throw new Error("No Git repository initialized");
			return;
		}
		dir.files(__dirname, function (err, files) {
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