var http = require("http");
var https = require("https");

exports.getJSON = function(options, onResult) {
    var req = https.request(options, function(res){
        var output = '';

        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
    	console.log('error:' + err.message);
        //res.send('error: ' + err.message);
    });

    req.end();
};