'use strict';

var gutil = require('gulp-util'),
    through = require('through2');

module.exports = function () {
    return through.obj(function (chunk, encoding, callback) {

        if (chunk.isNull()) {
            callback(null, chunk);
            return;
        }

        if (chunk.isStream()) {
            callback(new gutil.PluginError('gulp-mini-package-json', 'Streaming not supported'));
            return;
        }

        try {

            var data = JSON.parse(chunk.contents.toString());

            var miniData = {
                name: data.name,
                author: data.author,
                version: data.version,
                description: data.description,
                main: './index.js',
                keywords: data.keywords,
                repository: data.repository,
                license: data.license,
                homepage: data.homepage,
                peerDependencies: {
                    'react': data.dependencies['react'],
                    'prop-types': data.dependencies['prop-types'],
                    'react-addons-transition-group': data.dependencies['react-addons-transition-group'],
                    'react-dom': data.dependencies['react-dom'],
                    'react-transition-group': data.dependencies['react-transition-group']
                },
                dependencies: {
                    'lodash': data.dependencies['lodash'],
                    'string.prototype.at': data.dependencies['string.prototype.at']
                }
            };

            chunk.contents = new Buffer(JSON.stringify(miniData, null, 2));

            this.push(chunk);

        } catch (err) {
            this.emit('error', err);
        }

        callback();

    });
};
