var GitHubApi = require('github');
var Q = require('q');

var github = new GitHubApi({
	version: "3.0.0"
});

var createRepo = function (data, username, password) {
	var deferred = Q.defer();

	github.authenticate({
		type: 'basic',
		username: username,
		password: password
	})

	github.repos.create({
		name: data.newRepoName
	}, function (err, repoInfo) {
		deferred.resolve(repoInfo);
	})
	return deferred.promise;
}

var addHook = function (repoInfo, username, password) {
	var deferred = Q.defer();

	github.authenticate({
		type: 'basic',
		username: username,
		password: password
	})

	github.repos.createHook({
		user: username,
		repo: repoInfo.name,
		name: 'web',
		config: {
			url: 'http://593d2949.ngrok.com/api/cli/repos/' + repoInfo.name + '/push',
			content_type: 'application/json',
			secret: 'codestream is awesome'
		}
	}, function (err, hookInfo) {
		deferred.resolve(hookInfo);
	})
	return deferred.promise;
}

var addRemoteToLocal = function (url, repo, repoId) {
	var deferred = Q.defer();
	repo.remote_add('codestream', url, function (err) {
		if (err) console.log(err)
			deferred.resolve(repoId);
	})
	return deferred.promise;
}

module.exports = {
	createRepo: createRepo,
	addHook: addHook,
	addRemoteToLocal: addRemoteToLocal
}