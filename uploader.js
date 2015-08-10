var path = require('path');
var fs = require('fs');
var fileTypes = require('filetypes');

var Uploader = function(options) {
	options || (options = {});
	return initialize.call(this, options);
};

var initialize = function(options){
	this.temp = options.temp || '/';
	if (options.locations) {
		if (Object.prototype.toString.call(options.locations) === '[object Array]')
			this.locations = options.locations;
		else if (typeof options.locations === 'string')
			this.locations = [options.locations];
	}
	else this.locations = ['/tmp/'];
	return this;
};

var getFileType = function getFileType (ext){
	if (fileTypes && fileTypes[ext]) return fileTypes[ext];
	return 'unrecognized';
};

var multiUpload = function multiUpload (req, fname, tmp, base, location, uP, next){
	req.file(fname).upload({ dirname: tmp }, function (err, uploadedFiles) {
		if (err) next(err);
		if (!uploadedFiles || uploadedFiles.length === 0) return next();
		var fNames = [];
		var uObs = [];
		var ctr = 0;
		uploadedFiles = uploadedFiles.splice(0, 5);
		uploadedFiles.forEach(function(u){
			var source = u.fd;
			var dest = path.resolve(base, location, path.basename(u.fd));
			fNames.push(path.join(location, path.basename(u.fd)));
			var writeStream = fs.createWriteStream(dest);

			fs.createReadStream(source).pipe(writeStream).on('finish', function(){
				ctr ++;
				var uploadParams = {
					owner: uP.owner,
					name: path.basename(u.fd),
					size: path.basename(u.size),
					type: getFileType(path.extname(u.fd).substring(1)),
					target: location
	 			};
	 			uObs.push(uploadParams);
				if (ctr === uploadedFiles.length) {
						next(err, uObs);
				}
			});
		});
	});
};
var processFiles = function processFiles (req, files, tmp, base, location, uP, next) {
	if (!files) return next(null, []);
	var result = {};
	var ctr = 0;
	files.forEach(function(f){
		multiUpload(req, f, tmp, base, location, uP, function(err, uploads){
			if (!err && uploads && uploads.length) result[f] = uploads;
			ctr++;
			if (ctr === files.length) return next(null, result);
		});
	});
};

Uploader.prototype.getFileType = getFileType;
Uploader.prototype.multiUpload = multiUpload;
Uploader.prototype.processFiles = processFiles;

exports = module.exports = Uploader;
