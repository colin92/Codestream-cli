#!/usr/bin/env node

var git = require('gift');
var GitHubApi = require('github');
var Promise = require('bluebird');
var watch = require('watch');
var http = require('http');
var request = require('request-promise');
var prompt = require('prompt');
var querystring = require('querystring');
var appRoot = require('app-root-path');
var express = require('express');

var app = express();
//test server for requests that will eventually be made to codestream server
app.listen(3000);
app.post('/login', function (req, res, next) {
	res.send([{'name': 'Repo1', "githubUrl": "123happytownlane"}, {'name': 'Repo2', 'githubUrl': '12323Alaska'}]);
});

app.post('/repos/create', function (req, res, next) {
	res.send("hello");
});

var currentDir = appRoot.path;
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

	var githubUsername = result.githubUsername;
	//basic authentication with github
	github.authenticate({
		type: "basic",
		username: githubUsername,
		password: result.githubPassword
	});

	var options = {
		uri: 'http://localhost:3000/login',
		body: JSON.stringify({
			username: githubUsername,
			password: result.codestreamPassword
		}),
		json: true
	};
	//login to codestream to get a list of repositories from the database
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
						//create a new Github repository
						github.repos.create({
							name: result.newRepoName
						}, function (err, data) {
								var createRepoOptions = {
									uri: 'http://localhost:3000/repos/create',
									body: JSON.stringify({
										repo: data.name,
										githubUrl: data.clone_url //this might have to change
									}),
									json: true
								}
								request.post(createRepoOptions)
								.then(function (response) {
									//add a webhook to the new repository for codestream
									github.repos.createHook({
										user: githubUsername,
										repo: data.name,
										name: 'web',
										config: {
											url: 'http://codestream.co/repos/'
										}
									}, function (err, result) {
										//add the repository as a remote to your local repository
											repo.remote_add('origin', data.ssh_url, function (err) {
												if (err) console.log(err);
											});
										})
								}).catch(console.error);
							});
					});
				}
			});
		}).then(function () {
			//watch for modified or create files and auto add, commit, push to the remote
			watch.createMonitor(currentDir, {ignoreDotFiles: true, ignoreDirectoryPattern: /(node_modules)|(bower_components)/}, function (monitor) {

				monitor.on('created', function (file, stat) {
					autoCommit(file);
				});

				monitor.on('changed', function (file, curr, prev) {
					autoCommit(file);
				});
			});			
		}).catch(console.error);
});

var autoCommit = function (file) {
	repo.add(file, function (err) {
		if (err) console.log(err);
		repo.commit("auto committed by Codestream", function (err) {
			if (err) console.log(err);
			console.log("New local commit created");
			repo.remote_push('origin', 'master', function (err) {
				if (err) console.log(err);
				console.log("Commit push to remote repository");
			});
		});
	});
}
				// if (repo == "undefined") {
				// 	git.init(currentDir, function (err, repo) {
				// 		console.log("Initializing local repository " + repo);
				// 	});
				// }