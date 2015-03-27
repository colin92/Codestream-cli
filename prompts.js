var promptSchema = require('./prompt-schema');
var prompt = require('prompt');
var Q = require('q');

prompt.start();

var userInfo = function () {
	return Q.nfcall(prompt.get, promptSchema.user)
}

var chooseRepo = function () {
	return Q.nfcall(prompt.get, promptSchema.repo)
}

var createRepo = function () {
	return Q.nfcall(prompt.get, promptSchema.repo)
}

module.exports = {
	userInfo: userInfo,
	chooseRepo: chooseRepo,
	createRepo: createRepo
}