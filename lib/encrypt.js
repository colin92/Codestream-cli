var crypto = require('crypto');

var encode = function (pass, key) {
	var cipher = crypto.createCipher('aes-256-cbc', key); //
	cipher.update(pass, 'utf8', 'base64');
	return cipher.final('base64');
}

module.exports = {
	encode: encode
}