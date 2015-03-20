//var fs = require("fs");
var path = require("path");
var git = require('gift');
var dir = require("node-dir");
var chokidar = require('chokidar');

var currentDir = process.cwd();
var repo = git(currentDir);

var watcher = chokidar.watch(currentDir, {ignored: /[\/\\]\./, persistent: true});

watcher.on('change', function(path) {console.log('File', path, 'has changed');})
watcher.on('addDir', function(path) {console.log('File added');})