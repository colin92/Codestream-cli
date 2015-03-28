var request = require('request-promise');
var prompts = require('./prompts');
var Q = require('q');

var repoMatch = function (repositoryArr, data) {
	var options;
	var match = false;
	repositoryArr.forEach(function (repository) {
		if (repository.name === data.repositoryName) {
			match = true;
			options = {
				uri: 'http://localhost:4567/repos/start',
				body: {
					repository: data.repositoryName
				},
				json: true,
				// headers: {
				// 	"Cookie": sessionCookie
				// }
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
module.exports = repoMatch;