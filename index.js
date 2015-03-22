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
			repo.remote_push('origin', 'master', function (err) {
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