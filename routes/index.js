var helper = require("../libs/routeHelper");
var keys = require("../config/configuration").keys;
var NodeCache = require( "node-cache" );
var async = require("async");
var request = require("request");
var _= require("underscore");
var cache = new NodeCache();
var CACHE_KEY = "data_cache_movie";

var GEOLOCATION_OK = "OK";

/*
 * GET home page.
 */

exports.index = function(req, res){
  	res.render('index', { title: 'Express' });
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
exports.getData = function(req, res) {

	var options = {
	    host: 'data.sfgov.org',
	    path: '/api/views/yitu-d5am/rows.json',
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json'
	    }
	};
	var resData;
	var start = req.query && req.query.start ? parseInt(req.query.start, 10) : undefined; //should start from 0
	var num = req.query && req.query.num ? parseInt(req.query.num, 10) : 10;
	var cachedData = cache.get(CACHE_KEY);
    var titleName = req.params.title;
	var handleData = function(data) {
        if(titleName) {
            data = _.filter(data, function(each){
                return each["Title"].toLowerCase() === titleName.toLowerCase();
            });
        }

        if(start !== undefined) {
	 		data = data.slice(start, start + num);
	 	}

	 	return data;
	};

	if(!_.isEmpty(cachedData)) {
		resData = JSON.parse(cachedData[CACHE_KEY]);
		res.json(handleData(resData));
	} else {
 		helper.getJSON(options, function(statusCode, jsonObj){
 			var columns = jsonObj.meta.view.columns;
 			var allData = [];

 			cache.set(CACHE_KEY, JSON.stringify(jsonObj));
 			_.each(jsonObj.data, function(d){
 				var obj = {
 					actors : []
 				};
 				_.each(d, function(value, index){
 					var column = columns[index];
 					if(column.name.indexOf("Actor") != -1) {
 						if(value !== null) obj.actors.push(value);
 					} else {
	 					obj[column.name] = value;
	 				}
 				});
 				allData.push(obj);
 			});
 			resData = allData;
 			cache.set(CACHE_KEY, JSON.stringify(resData));
//            var arr = resData.slice(0,2);
//            async.map(arr, function(eachMovieObj, cb){
////               getLocation(eachMovieObj["Locations"], function(code, jsonObj){
////                    //var copy = _.extend({}, eachMovieObj);
////                    if(jsonObj.status === GEOLOCATION_OK && jsonObj.results.length > 0){
////                        var locationObj = jsonObj.results[0].geometry && jsonObj.results[0].geometry ? jsonObj.results[0].geometry.location : {};
////                        if(!_.isEmpty(locationObj)) {
////                            eachMovieObj.geometry = locationObj;
////                        }
////                        //cb(null, 3);
////                    }
////                   //console.log(eachMovieObj);
////                   cb(null, eachMovieObj);
////
////               });
//                var apiKey = keys.google_map_key2;
//                var geourl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(eachMovieObj["Locations"]) + "&sensor=true&key=" + apiKey;
//               //cb(null, eachMovieObj);
//                request(geourl, function(err, res, body){
//                    if(err) {
//                        cb(err);
//                    } else {
//                        var jsonObj = JSON.parse(body);
//                        if(jsonObj.status === GEOLOCATION_OK && jsonObj.results.length > 0){
//                            var locationObj = jsonObj.results[0].geometry && jsonObj.results[0].geometry ? jsonObj.results[0].geometry.location : {};
//                            if(!_.isEmpty(locationObj)) {
//                                eachMovieObj.geometry = locationObj;
//                            }
//                            cb(null, eachMovieObj);
//                        }
//                    }
//                });
//
//            }, function(err, results){
//                if(err != null) {
//                } else {
//                    console.log(results);
//
//                }
//            });

	 		res.json(handleData(resData));
	 	});

 	}

};