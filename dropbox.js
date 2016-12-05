
var accessToken = process.env.DROPBOX_ACCESS_TOKEN;

var Dropbox = require('dropbox');
var dropbox = new Dropbox({ accessToken: accessToken });

generateName = function(name, ext, cb){
    var origName = name;
    name = name+"."+ext;

    dropbox.filesListFolder({path: ''})
        .then(function(response) {
            var files = response.entries.map(function(e){ 
                return e.name; 
            });

            for (var i = 1; (files.indexOf(name) != -1); i++){
                console.log(name+" already exists, appending");
                name = origName+"("+i+")."+ext;
            };

            cb(name);
        });
};

upload = function(name, ext, contents, cb){

    generateName(name, ext, function(newName){
        name = newName;
        console.log("Uploading: "+name);

        dropbox.filesUpload({ path: '/'+name, contents: contents })
            .then(function(response) {
                console.log(response);
                if (cb) {
                    cb();
                }
            })
            .catch(function(error) {
                console.error(error);
                if (cb) {
                    cb();
                }
            });

    });
};

module.exports = {
    upload: upload
};


