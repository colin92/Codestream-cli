var promptSchema = require('./prompt-schema');
var prompt = require('prompt');
var Q = require('q');
var chalk = require('chalk');

var userInfo = function () {
	return Q.nfcall(prompt.get, promptSchema.user)
}

var chooseRepo = function (repoArray) {
	var deferred = Q.defer();
		prompt.get(promptSchema.repo, function (err, result) {
			if (err) console.log(chalk.red("Exiting CLIve: ", err));
			if (result.repositoryResponse === 'new') {
				deferred.resolve('new');
			}
			else if (repoArray[result.repositoryResponse-1]) {
				deferred.resolve(repoArray[result.repositoryResponse-1])
			}
			else { 
				console.log("Invalid Response")
				process.kill();
			}
		})
		return deferred.promise;
}

var newRepo = function () {
	return Q.nfcall(prompt.get, promptSchema.newRepo)
}

module.exports = {
	userInfo: userInfo,
	chooseRepo: chooseRepo,
	newRepo: newRepo
}