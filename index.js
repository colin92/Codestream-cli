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
var fs = require('fs');
var Q = require('q');
var app = require('express')();

app.listen(4567);
app.post('/login', function (req, res, next) {
	res.send([{'name': 'Repo1', "githubUrl": "123happytownlane"}, {'name': 'Repo2', 'githubUrl': '12323Alaska'}]);
});
var currentDir = appRoot.path;
var repo = git(currentDir);
var github = new GitHubApi({
	version: "3.0.0"
});

var githubUsername, repositoryList, sessionCookie;

prompt.start();

prompts.userInfo()
	.then(function (results) {
		githubUsername = results.githubUsername;

		gitAuth(results.githubUsername, results.githubPassword);
		
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
		return request.post(options)
			.then(function (response) {
				repositoryList = response.body;
				sessionCookie = response.headers['set-cookie'][0];
				console.log(repositoryList);
				return repositoryList;
		})
	})
	.then(function (body) {
		return prompts.chooseRepo()
	})
	.then(function (results) {
		repositoryList.forEach(function (repository) {
			if (repository.name === results.repositoryName) {
				return 
			}
		})
	})
	// .then(function (response) {
	// 	console.log(response);
	// })

// prompt.get(promptSchema.user, function (err, result) {
// 	var githubUsername = result.githubUsername;
// 	var sessionCookie;
// 	//basic authentication with github
// 	github.authenticate({
// 		type: "basic",
// 		username: githubUsername,
// 		password: result.githubPassword
// 	});

// 	var options = {
// 		uri: 'http://192.168.1.121:3000/login',
// 		body: {
// 			username: githubUsername,
// 			password: result.codestreamPassword
// 		},
// 		json: true,
// 		resolveWithFullResponse: true
// 	};
// 	//login to codestream to get a list of repositories from the database
// 	request.post(options)
// 		.then(function (response) {
// 			var repositoryList = response.body;
// 			var sessionCookie = response.headers['set-cookie'][0];
// 			console.log(repositoryList);
// 			prompt.get(promptSchema.repo, function (err, result) {
// 				repositoryList.forEach(function (repository) {
// 					if (repository.name === result.repositoryName) {
// 						var newOptions = {
// 							uri: 'http://192.168.1.121:3000/repos/start',
// 							body: {
// 								repository: result.repositoryName
// 							},
// 							json: true,
// 							headers: {
// 								"Cookie": sessionCookie
// 							}
// 						}
// 						request.post(newOptions)
// 							.then(function (response) {
// 								console.log("Your lecture is available at http://codestream.co/" + response.repoId);
// 							}).then(gitAuto(repo, currentDir)).catch(console.error);
// 					}
// 				});

// 				if (result.repositoryName === 'new') {
// 					prompt.get(promptSchema.newRepo, function (err, result) {
// 						//create a new Github repository
// 						github.repos.create({
// 							name: result.newRepoName
// 						}, function (err, data) {
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