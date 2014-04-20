var helper = require("../libs/routeHelper");
var keys = require("../config/configuration").keys;
var NodeCache = require( "node-cache" );
var request = require("request");
var _= require("underscore");
var cache = new NodeCache();
var DATA_CACHE_KEY = "cache_data";

/*
 * GET home page.
 */

exports.index = function(req, res){
  	res.render('index', { title: 'Movie Finder' });
};

var getLocation = function(location, callback) {
    if(!location) return;
	var apiKey = keys.google_map_key2;
	//var geourl = encodeURIComponent("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&sensor=true&key=" + apiKey);
	var options = {
		host: 'maps.googleapis.com',
	    path: "/maps/api/geocode/json?address=" + encodeURIComponent(location) + "&sensor=true&key=" + apiKey,
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json'
	    }
	};
	helper.getJSON(options, function(statusCode, jsonObj){
 		  if(callback) callback(statusCode, jsonObj);
    });
};

exports.test = function(req, res) {
    var address = "Epic Roasthouse (399 Embarcadero)";
    getLocation(address, function(statusCode, jsonObj){
         res.json(jsonObj);
    });
};

var retrieve = function(callback, field) {
    var options = {
        host: 'data.sfgov.org',
        path: '/api/views/yitu-d5am/rows.json',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var query = query || {};
    helper.getJSON(options, function(statusCode, jsonObj){
        var columns = jsonObj.meta.view.columns;
        var allData = [];

        _.each(jsonObj.data, function(d){
            var obj = {
                //actors : []
            };
            var actors = [];
            _.each(d, function(value, index){
                var column = columns[index];
                if(column.name.indexOf("Actor") != -1) {
                    if(value !== null) actors.push(value);
                } else {
                    obj[column.name] = value;
                }
            });
            obj.actors = actors.join(",");
            allData.push(obj);
        });
        allData = allData.sort(function(a, b) {
        	return a.position - b.position;
        });

        if(field) {
            allData = _.uniq(_.pluck(allData, field));
            cache.set(field, JSON.stringify(allData));
        } else {
            cache.set(DATA_CACHE_KEY, JSON.stringify(allData));
        }

        
        if(callback) {
			callback(allData);
        }
    });
};

exports.movies = function(req, res) {
    var cachedData = cache.get("Title");
    if(!_.isEmpty(cachedData)) {
        res.json(JSON.parse(cachedData["Title"]));
    } else {
        retrieve(function(d){
           res.json(d);
        }, "Title");
    }

};

exports.getData = function(req, res) {
	var start = req.query && req.query.start ? parseInt(req.query.start, 10) : undefined; //should start from 0
	var num = req.query && req.query.num ? parseInt(req.query.num, 10) : 10;
	var cachedData = cache.get(DATA_CACHE_KEY);
    var titleName = req.params.title;
	var handleData = function(data) {
		var length;
        if(titleName) {
            data = _.filter(data, function(each){
                return each["Title"].toLowerCase() === titleName.toLowerCase();
            });
        }
        length = data.length;
        if(start !== undefined) {
	 		data = data.slice(start, start + num);
	 	}

	 	return {data : data, length : length};
	};

	if(!_.isEmpty(cachedData)) {
		var cData = JSON.parse(cachedData[DATA_CACHE_KEY]);
		res.json(handleData(cData));

	} else {
        retrieve(function(d) {
            res.json(handleData(d));
        });
 	}

};