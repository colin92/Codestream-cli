var GitHubApi = require('github');
var Q = require('q');

var github = new GitHubApi({
	version: "3.0.0"
});

var addRemoteToLocal = function (url, repo, repoName) {
	var deferred = Q.defer();
	repo.remote_add('codestream', url, function (err) {
		if (err) console.log("Error setting remote, Exiting CLIve:", err)
			deferred.resolve(repoName);
	})
	return deferred.promise;
}

module.exports = {
	addRemoteToLocal: addRemoteToLocal
}
