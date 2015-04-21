var expect = require('chai').expect;


// lib/exec.js functions
var nodeExec = require('../lib/execs.js');
var fs = require('fs');
var path = require('path');


//var exec = require('child_process').exec;
//var Q = require('q');
//var fs = require('fs');
//var chalk = require('chalk');
//
//var path = __dirname + '/../Codestream-Sublime'
//
//var installSublimePlugin = function () {
//	var deferred = Q.defer();
//		exec('ls ~/Library/Application\\ Support/Sublime\\ Text\\ 3', function (error, stdout, stderr) {
//			if (error) {
//				console.log(chalk.magenta("Please install Sublime Text 3 to continue"));
//				process.kill();
//			}
//			else {
//				exec('cp -R ' + path + ' ~/Library/Application\\ Support/Sublime\\ Text\\ 3/Packages', function (error, stdout, stderr) {
//					if (error) console.log(error);
//					else {
//						console.log(chalk.green("Codestream Sublime Plugin installed successfully"))
//						deferred.resolve();
//					}
//				});
//			}
//		})
//	return deferred.promise;
//}

//// Insert repoId of current session into settings file
//var updatePluginSettings = function(repoId) {
//  var deferred = Q.defer();
//  var filePath = process.env['HOME'] + '/Library/Application\\ Support/Sublime\\ Text\\ 3/Packages/Codestream-Sublime/codestream.sublime-settings';
//  fs.readFile(filePath, 'utf8', function(err, data) {
//
//    console.log(chalk.magenta('data'), data);
//    console.log(chalk.red('err:'), err);
//
//    deferred.reject(err);
//    
//    var settings = JSON.parse(data);
//    console.log(chalk.blue('parsed data:'), settings.repo_id);
//    settings.repo_id = repoId;
//    fs.writeFile(filePath, JSON.stringify(settings), 'utf8', function(err, result) {
//      console.log(chalk.green('result:'), result);
//      console.log(chalk.red('err:'), err);
//      
//      if(err) deferred.reject(err);
//      else deferred.resolve();
//    });
//    
//  });
//  return deferred.promise;
//};
//
//module.exports = {
//	installSublimePlugin: installSublimePlugin,
//	updatePluginSettings: updatePluginSettings
//}

describe('execs functions', function() {
  var pluginPath = process.env['HOME']  
                   + '/Library/Application\ Support/Sublime\ Text\ 3/';
  var exec = require('child_process').exec;

  describe('installSublimePlugin', function() {
    before(function(done) {
      exec('rm -rf ' + pluginPath + 'Packages/Codestream-Sublime', function(stdOut,stdErr) {
        console.log('stdOut', stdOut);
        console.log('stdErr', stdErr);
        if(!stdErr) console.log('plugin successfully removed'); 
        done();
      });
    });

    it('should install the plugin in the correct folder', function(done) {
      fs.stat(pluginPath, function(err, stat) {
        console.log('first circle of callback hell <');
        expect(stat).to.exist;
        nodeExec.installSublimePlugin().then(function() {
          console.log('second circle of callback hell <<');
          done();
        });
      });
      
    
    });
    it('', function() {
    
    });
  });
  describe('updatePluginSettings', function() {
    it('', function() {
    
    });
    it('', function() {
    
    });
  });
});
