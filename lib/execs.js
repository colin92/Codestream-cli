var exec = require('child_process').exec;
var Q = require('q');
var fs = require('fs');
var chalk = require('chalk');

var installSublimePlugin = function () {
	var deferred = Q.defer();
		exec('ls ~/Library/Application\\ Support/Sublime\\ Text\\ 3', function (error, stdout, stderr) {
			if (error) {
				console.log(chalk.magenta("Please install Sublime Text 3 to continue"));
				process.kill();
			}
			else {
				exec('cp -R ../Codestream-Sublime ~/Library/Application\\ Support/Sublime\\ Text\\ 3/Packages', function (error, stdout, stderr) {
					if (error) console.log(error);
					deferred.resolve();
				});
			}
		})
	return deferred.promise;
}

module.exports = {
	installSublimePlugin: installSublimePlugin
}