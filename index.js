#!/usr/bin/env node
var git = require('gift');
var GitHubApi = require('github');
var http = require('http');
var request = require('request-promise');
var prompt = require('prompt');
var appRoot = require('app-root-path');
var promptSchema = require('./prompt-schema');
var gitAuto = require('./filewatcher');
var prompts = require('./prompts');
var gitAuth = require('./git-auth');
var repoMatch = require('./repo-requests');
var gitCommands = require('./git-create-repo');
var fs = require('fs');
var Q = require('q');
var app = require('express')();

app.listen(4567);
app.post('/login', function (req, res, next) {
	res.send([{'name': 'Repo1', "githubUrl": "123happytownlane"}, {'name': 'Repo2', 'githubUrl': '12323Alaska'}]);
});

app.post('/repos/start', function (req, res, next) {
	res.send({hello: "hello"});
});

var currentDir = appRoot.path;
var repo = git(currentDir);
var github = new GitHubApi({
	version: "3.0.0"
});

var githubUsername, githubPassword, repositoryList, newRepoUrl; 
var sessionCookie = "hello";

prompt.start();

prompts.userInfo()
	.then(function (results) {
		githubUsername = results.githubUsername;
		githubPassword = results.githubPassword
		
		return options = {
			uri: 'http://localhost:4567/login',
			body: {
				username: githubUsername,
				password: results.codestreamPassword
			},
			json: true,
			resolveWithFullResponse: true
		}
	})
	.then(function (options) {
		var deferred = Q.defer();

		request.post(options, function (err, response, body) {
			deferred.resolve(body);
		});
		return deferred.promise;
	})
	.then(function (repos) {
		console.log(repos);
		repositoryList = repos;
		return prompts.chooseRepo();
	})
	.then(function (results) {
		return repoMatch(repositoryList, results);
	})
	.then(function (response) {
		//To create a new repository
		if (response.newRepoName) {
			return gitCommands.createRepo(response, githubUsername, githubPassword);
		}
		//start watching files if a repo was matched
		else {
			console.log("Your lecture is starting at ")
			gitAuto(repo, currentDir);
		}
	})
	.then(function (repoInfo) {
		newRepoUrl = repoInfo.ssh_url;
		return gitCommands.addHook(repoInfo, githubUsername, githubPassword);
	})
	.then(function (hookInfo) {
		return gitCommands.addRemoteToLocal(newRepoUrl, repo);
	})
	.then(function () {
		console.log('hello');
	})
	.catch(console.error);

// 									//add a webhook to the new repository for codestream
// 									github.repos.createHook({
// 										user: githubUsername,
// 										repo: data.name,
// 										name: 'web',
// 										config: {
// 											url: 'http://192.168.1.121:3000/payload',
// 											content_type: 'application/json'
// 											//url: 'http://codestream.co/repos/'
// 										}
// 									}, function (err, result) {
// 										//add the repository as a remote to your local repository
// 											repo.remote_add('origin', data.ssh_url, function (err) {
// 												if (err) console.log(err);
// 												fs.writeFileSync('hello.txt', "hello");
// 												repo.add('hello.txt', function (err) {
// 													if (err) console.log(err)
// 														repo.commit("autocommitted by Codestream", function (err) {
// 															repo.remote_push('origin', 'master', function (err) {
// 																var createRepoOptions = {
// 																uri: 'http://192.168.1.121:3000/repos/create',
// 																body: {
// 																	repository: data.name,
// 																	githubUrl: data.clone_url,
// 																	username: githubUsername //this might have to change
// 																},
// 																json: true,
// 																headers: {
// 																	"Cookie": sessionCookie
// 																}
// 															}
// 																request.post(createRepoOptions)
// 																.then(function (response) {
// 																	console.log("Your lecture can be found at http://codestream.co/" + response.repoId);
// 																}).then(gitAuto(repo, currentDir)).catch(console.error);
// 															})
// 														})
// 												})
// 											});
// 										})
								
// 							});
// 					});
// 				} else {
// 					console.log("Unknown Repository, exiting CLIve".red);
// 					process.kill();
// 					}
// 			});
// 		}).catch(console.error);
// });