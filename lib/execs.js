var exec = require('child_process').exec;
var Q = require('q');
var fs = require('fs');
var chalk = require('chalk');
var appRoot = require('app-root-path');

var path = appRoot.path + '/node_modules/CLIve/Codestream-Sublime'

var installSublimePlugin = function () {
	var deferred = Q.defer();
		exec('ls ~/Library/Application\\ Support/Sublime\\ Text\\ 3', function (error, stdout, stderr) {
			if (error) {
				console.log(chalk.magenta("Please install Sublime Text 3 to continue"));
				process.kill();
			}
			else {
				exec('cp -R ' + path + ' ~/Library/Application\\ Support/Sublime\\ Text\\ 3/Packages', function (error, stdout, stderr) {
					if (error) console.log(error);
					else {
						console.log(chalk.green("Codestream Sublime Plugin installed successfully"))
						deferred.resolve();
					}
				});
			}
		})
	return deferred.promise;
}

module.exports = {
	installSublimePlugin: installSublimePlugin
}