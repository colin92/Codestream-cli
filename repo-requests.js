var request = require('request-promise');
var prompts = require('./prompts');
var Q = require('q');

var loginUser = function (username, password) {
	var deffered = Q.defer();
	var options = {
		uri: 'http://localhost:1337/api/cli/login',
		body: {
			username: username,
			password: password
		},
		json: true,
		resolveWithFullResponse: true
	}
	request.post(options, function (err, response, body) {
		deferred.resolve(response);
	});
	return deferred.promise;
}

var repoMatch = function (repositoryArr, data, cookie) {
	var options;
	var match = false;
	repositoryArr.forEach(function (repository) {
		if (repository.name === data.repositoryName) {
			match = true;
			options = {
				uri: 'http://localhost:1337/api/cli/repos/start',
				body: {
					repository: data.repositoryName
				},
				json: true,
				headers: {
					"Cookie": cookie
				}
			}
		}
	});
	if (data.repositoryName === "new") {
		return prompts.createRepo();
	}
	if (match === true) {
		var deferred = Q.defer();
			request.post(options, function (err, response, body) {
				deferred.resolve(body);
			});
		return deferred.promise;
	}
	else if (match === false) {
		console.log("Invalid Repository Name");
		process.kill();
	}

}

var sendRepo = function (repoInfo, username, cookie) {
	var deferred = Q.defer();
	var options = {
		uri: 'http://localhost:1337/api/cli/repos/create',
		body: {
			repository: repoInfo.name,
			githubUrl: repoInfo.ssh_url,
			username: username
		},
		json: true,
		headers: {
			"Cookie": cookie
		}
	}
	request.post(options, function (err, response, body) {
		deferred.resolve(body);
	})
	return deferred.promise;
}

module.exports = {
	repoMatch: repoMatch,
	sendRepo: sendRepo
}