var watch = require('watch'); // need to edit watch main.js(handle double event)

var autoCommit = function (file, repo) {
	repo.add(file, function (err) {
		if (err) console.log("Error adding file to local repository", err);
		repo.commit("auto committed by Codestream", function (err) {
			if (err) console.log("Error commiting files", err);
			else console.log("New local commit created");
			repo.remote_push('origin', 'master', function (err) {
				if (err) console.log("Error pushing to remote", err);
				else console.log("Commit pushed to remote repository");
			});
		});
	});
}
//add comment
var fileWatcher = function (directory, repo) {
			//watch for modified or create files and auto add, commit, push to the remote
			watch.createMonitor(directory, {ignoreDotFiles: true, ignoreDirectoryPattern: /(node_modules)|(bower_components)/}, function (monitor) {
				console.log('files are now being watched');
				monitor.on('created', function (file, stat) {
					if (!stat.isDirectory()) {
						autoCommit(file, repo);
					}
				});

				monitor.on('changed', function (file, curr, prev) {
					autoCommit(file, repo);
				});

				monitor.on('removed', function (file, stat) {
					if (!stat.isDirectory()) {
						autoCommit(file, repo);
					}
				});
			});			
		}

module.exports = {
	fileWatcher: fileWatcher,
	autoCommit: autoCommit
}