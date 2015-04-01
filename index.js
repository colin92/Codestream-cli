var git = require('gift');
var GitHubApi = require('github');
var request = require('request-promise');
var prompt = require('prompt');
var appRoot = require('app-root-path');
var promptSchema = require('./lib/prompt-schema');
var gitAuto = require('./lib/filewatcher');
var prompts = require('./lib/prompts');
var requests = require('./lib/requests');
var gitCommands = require('./lib/git-create-repo');
var nodeExec = require('./lib/execs');
var exec = require('child_process').exec;
var chalk = require('chalk');

var currentDir = appRoot.path;
var repo = git(currentDir);
var github = new GitHubApi({
	version: "3.0.0"
});

console.log(chalk.red(currentDir));

var githubUsername, githubPassword, sessionCookie;
prompt.start();

//Copies Codestream Sublime Text Plugin
nodeExec.installSublimePlugin()
.then(function () {
	return prompts.userInfo()
	})
	.then(function (results) {
		githubUsername = results.githubUsername;
		githubPassword = results.githubPassword
		return requests.loginUser(githubUsername, results.codestreamPassword);
	})
	.then(function (response) {
		sessionCookie = response.headers['set-cookie'][0];
		return requests.getRepos(response.body.user._id, sessionCookie);
	})
	.then(function (repos) {
		var repoString = repos.map(function (val, idx) {
      			return (idx+1) + '. ' + val;
    		}).join(', ');
		console.log(chalk.yellow("Available Repos: ", repoString));
		return prompts.chooseRepo(repos);
	})
	.then(function (response) {
		if (response === 'new') {
			//create a new repository
			prompts.newRepo()
				.then(function (response) {
					return requests.createRepo(response.newRepoName, githubUsername, githubPassword, sessionCookie);
				})
				.then(function (response) {
					return gitCommands.addRemoteToLocal(response.url, repo, response.repoId);
				})
				.then(function (repoId) {
					//pull dummy file to sync with remote repository
					exec('git pull codestream master', function (error, stdout, stderr) {
						if (error) console.error(error);
						else {
							console.log(chalk.green("Your lecture can be found at http://codestream.co/" + repoId));
							gitAuto.fileWatcher(currentDir, repo); 
						}
					})
				})
				.catch(function (err) {
					console.log(chalk.red("Exiting CLIve:", err));
				})
				.done();
		}
		else {
			requests.getRepo(response, sessionCookie)
				.then(function (repoId) {
					console.log(chalk.green("Your lecture can be found at http://codestream.co/" + repoId));
					gitAuto.fileWatcher(currentDir, repo);
				})
				.catch(function (err) {
					console.log(chalk.red("Exiting CLIve:", err));
				})
				.done();
		} 	
	}).catch(function (err) {
		console.log(chalk.red("Exiting CLIve:", err));
})
.done();