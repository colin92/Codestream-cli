var exec = require('child_process').exec;
var Q = require('q');
var fs = require('fs');
var chalk = require('chalk');

var path = __dirname + '/../Codestream-Sublime'

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

// Insert repoId of current session into settings file
var updatePluginSettings = function(repoId) {
  var deferred = Q.defer();
  var filePath = process.env['HOME'] + '/Library/Application\ Support/Sublime\ Text\ 3/Packages/Codestream-Sublime/codestream.sublime-settings';
  fs.readFile(filePath, 'utf8', function(err, data) {

    console.log(chalk.magenta('data'), data);
    console.log(chalk.red('err:'), err);

    deferred.reject(err);
    
    var settings = JSON.parse(data);
    console.log(chalk.blue('parsed data:'), repoId);
    settings.repo_id = repoId;
    var newSettings = JSON.stringify(settings);
    console.log(chalk.blue(newSettings));
    fs.writeFile(filePath, newSettings, 'utf8', function(err, result) {
      console.log(chalk.green('result:'), result);
      console.log(chalk.red('err:'), err);
      
      if(err) deferred.reject(err);
      else deferred.resolve();
    });
    
  });
  return deferred.promise;
};

module.exports = {
	installSublimePlugin: installSublimePlugin,
	updatePluginSettings: updatePluginSettings
}
