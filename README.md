# gl-uploader
(no releases yet; currently in planning stage)

Processes uploads and returns an object with file details, allowing you to process uploads as regular params.

##Goal
Allow processing multiple multi-file uploads automatically based on pre-set configuration, specifically to facilitate

* checking file type before upload
* storing files in multiple, dynamic paths
* preventing failed uploads from cluttering the file storage
* uploading files to multiple locations
* supporting dynamic root directories

###Global config
	tmp
	allowedTypes
	size for each type
	timeout
	bases
	createIfNotExist

###Input Params
Each file to be uploaded requires the following params:

	bases
	location
	name
	maxSizePerFile
	timeout
	allowedTypes
	createIfNotExist

###Output
Post upload, the file param is replaced by an array of objects containing:

	fileType
	fileName
	fileLocations






