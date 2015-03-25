#! /usr/bin/env node

var git = require('gift');
var GitHubApi = require('github');
var Promise = require('bluebird');
var watch = require('watch');
var http = require('http');
var request = require('request-promise');
var prompt = require('prompt');
var querystring = require('querystring');
var express = require('express');
var app = express();

app.listen(3000);
app.post('/login', function (req, res, next) {
	console.log(req.body);
	res.send([{'name': 'Repo1', "githubUrl": "123happytownlane"}, {'name': 'Repo2', 'githubUrl': '12323Alaska'}]);
});

app.post('repos/create', function (req, res, next) {
	console.log(req.body);
	res.send()
})

var currentDir = process.cwd();
var repo = git(currentDir);

var github = new GitHubApi({
	version: "3.0.0"
});

//schemas for prompts
var userSchema = {
	properties: {
		githubUsername: {
			pattern: /^[a-zA-Z\s\-0-9]+$/,
			description: "Enter your Github username".cyan,
			required: true
		},
		githubPassword: {
			hidden: true,
			description: "Enter your Github password".cyan,
			required: true
		},
		codestreamPassword: {
			hidden: true,
			description: "Enter your Codestream password".cyan,
			required: true
		}
	}
};

var repoSchema = {
	properties: {
		repositoryName: {
			description: "If your repository is included in the list above, type in the name of that repository, else type 'new'\n".green
		}
	}
};

var newRepoSchema = {
	properties: {
		newRepoName: {
			description: "Enter the name of your new remote repository".cyan
		}
	}
}

prompt.start();

prompt.get(userSchema, function (err, result) {

	//basic authentication with github
	github.authenticate({
		type: "basic",
		username: result.githubUsername,
		password: result.githubPassword
	});

	var options = {
		uri: 'http://localhost:3000/login',
		body: JSON.stringify({
			username: result.githubUsername,
			password: result.codestreamPassword
		}),
		json: true
	};

	request.post(options)
		.then(function (response) {
			repositoryList = response;
			console.log(repositoryList);
			prompt.get(repoSchema, function (err, result) {
				repositoryList.forEach(function (repository) {
					if (repository.name === result.repositoryName) {

						var newOptions = {
							uri: 'http://localhost:3000/repos/start',
							body: JSON.stringify({
								repo: result.repositoryName
							}),
							json: true
						}
						request.post(newOptions)
							.then(function (response) {
								console.log(response);
							}).catch(console.error);
					}
				});
				if (result.repositoryName === 'new') {
					prompt.get(newRepoSchema, function (err, result) {
						github.repos.create({
							name: result.newRepoName
						}, function (err, data) {
							repo.remote_add(data.name, data.ssh_url, function (err) {
								if (err) console.log(err);
							});
						});
					});
				}
			});
		}).catch(console.error);
});

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
//Watches files for changes and pushes to Github
// watch.createMonitor(currentDir, {ignoreDotFiles: true, ignoreDirectoryPattern: /(node_modules)|(bower_components)/}, function (monitor) {

// 	monitor.on('created', function (file, stat) {
// 		autoCommit(file);
// 	});

// 	monitor.on('changed', function (file, curr, prev) {
// 		autoCommit(file);
// 	});
// 	if (repo == "undefined") {
// 		git.init(currentDir, function (err, repo) {
// 			console.log("Initializing local repository " + repo);
// 		});
// 	}

// });