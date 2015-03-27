var GitHubApi = require('github');
var github = new GitHubApi({
	version: '3.0.0'
});

var gitAuth = function(username, password) {
	github.authenticate({
		type: "basic",
		username: username,
		password: password
	});
};

module.exports = gitAuth;