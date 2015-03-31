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
var repoRequests = require('./repo-requests');
var gitCommands = require('./git-create-repo');
var fs = require('fs');
var Q = require('q');

var currentDir = appRoot.path;
var repo = git(currentDir);
var github = new GitHubApi({
	version: "3.0.0"
});

var githubUsername, githubPassword, sessionCookie, repositoryList, newRepoInfo; 

prompt.start();

prompts.userInfo()
	.then(function (results) {
		githubUsername = results.githubUsername;
		githubPassword = results.githubPassword
		return repoRequests.loginUser(githubUsername, results.codestreamPassword);
	})
	.then(function (response) {
		sessionCookie = response.headers['set-cookie'][0];
		return repoRequests.getRepos(response.body.user._id, sessionCookie);
	})
	.then(function (repos) {
		var repoString = repos.map(function (val, idx) {
      			return (idx+1) + '. ' + val;
    		}).join(', ');
		console.log("Available Repos: ", repoString);
		return prompts.chooseRepo(repos);
	})
	.then(function (response) {
		if (response === 'new') {
			//create a new repository
			prompts.newRepo()
				.then(function (response) {
					return repoRequests.createRepo(response.newRepoName, githubUsername, githubPassword, sessionCookie);
				})
				.then(function (response) {
					return gitCommands.addRemoteToLocal(response.url, repo, response.repoId);
				})
				.then(function (repoId) {
					repo.sync('codestream', 'master', function (err) {
						if (err) console.log(err);
						console.log("Your lecture can be found at http://codestream.co/" + repoId);
						gitAuto.fileWatcher(currentDir, repo);
					})
				})
				.catch(function (err) {
					console.error(err);
				})
				.done();
		}
		else {

		} 	
	}).catch(function (err) {
		console.error(err);
	})
	.done();