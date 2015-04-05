var request = require('request-promise');
var prompts = require('./prompts');
var Q = require('q');
var url = process.argv[2] || 'codestream.co';

var loginUser = function (username, password, key) {
	var deferred = Q.defer();
	var options = {
		uri: 'http://' + url + '/api/cli/login',
		body: {
			username: username,
			password: password,
			key: key
		},
		json: true,
		resolveWithFullResponse: true
	}
	request.post(options, function (err, response, body) {
		if (err) deferred.reject(err);
		deferred.resolve(response);
	});
	return deferred.promise;
}

var getRepos = function (userId, cookie) {
	var deferred = Q.defer();
	var options = {
		uri: 'http://' + url + '/api/cli/repos/user/' +userId,
		headers: {
			'Cookie': cookie
		}
	}
	request.get(options, function (err, response, body) {
		if (err) deferred.reject(err);
		deferred.resolve(JSON.parse(body));
	})
	return deferred.promise;
}


var getRepo = function (repoName, cookie) {
	var deferred = Q.defer();
	var options = {
		uri: 'http://' + url + '/api/cli/repos/' + repoName,
		headers: {
			'Cookie': cookie
		}
	}
	request.get(options, function (err, response, body) {
		if(err) deferred.reject(err);	
		deferred.resolve(body);
	})
	return deferred.promise;
}

var createRepo = function (repoName, username, password, key, cookie) {
	var deferred = Q.defer();
	var options = {
		uri: 'http://' + url + '/api/cli/repos/create',
		body: {
			repository: repoName,
			username: username,
			password: password,
			key: key
		},
		json: true,
		headers: {
			'Cookie': cookie
		}
	}
	request.post(options, function (err, response, body) {
		if (err) deferred.reject(err);		
		deferred.resolve(body);
	});
	return deferred.promise;
}

var cloneRepo = function (repoId, username, password, key, cookie) {
	var deferred = Q.defer();
	var options = {
		uri: 'http://' + url + '/api/cli/repos/clone',
		body: {
			id: repoId,
			username: username,
			password: password,
			key: key
		},
		json: true,
		headers: {
			'Cookie': cookie
		}
	}
	request.post(options, function (err, response, body) {
		if (err) deferred.reject(err);
		deferred.resolve(body);
	})
	return deferred.promise;
}

module.exports = {
	loginUser: loginUser,
	getRepos: getRepos,
	getRepo: getRepo,
	createRepo: createRepo,
	cloneRepo: cloneRepo
}