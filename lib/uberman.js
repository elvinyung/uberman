'use strict';

// package requires
var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    _ = require('lodash'),
    string = require('string');

// module requires
var endpoint = require('./endpoint'),
    middleware = require('./middleware');


var uberman = function (configs) {
    var app = express();

    // setup middleware
    middleware._setupLogger();

    // apply middleware
    app.use(middleware.uuidAssign);
    app.use(middleware.jsonParser);
    app.use(middleware.logger);

    // apply options here
    configs = configs || {};
    app.configs = {};
    app.configs.version = configs.version || 0;
    app.configs.root = configs.root || path.join('/api', 'v{version}'.replace('{version}', app.configs.version));
    app.configs.name = configs.name || 'app';
    app.configs.sslKey = configs.sslKey || '';
    app.configs.sslCert = configs.sslCert || '';

    // init endpoint object
    app.endpoints = {};

    // connect to mongoDB
    mongoose.connect((app.configs.mongoURI || ('mongodb://localhost/' + (app.configs.appName || ''))), app.configs.mongo);

    return {
        listen: function (port) {
            port = port || 443;
            app.listen(port);
        },
        addEndpoint: function (name, schema, options) {
            options = options || {};
            var endpointObj = endpoint.create.call(app, name, schema);
            app.endpoints[endpointObj.name] = endpointObj;
        }
    };
};

uberman.Types = _.assign(mongoose.Schema.Types,{
    foreignKey: function (resource) {
        
    }
});

module.exports = uberman;