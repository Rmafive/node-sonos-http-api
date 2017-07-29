const keypress = require('keypress');
const logger = require('sonos-discovery/lib/helpers/logger');
const http = require('http');

var paths = {
	'f1': "/Robert's%20Bedroom/state",
	'f2': "/Robert's%20Bedroom/playpause",
	'f3': "/Robert's%20Bedroom/favorite/The%20Walk",
	'f4': "/Robert's%20Bedroom/volume/+1",
	'f5': "/Robert's%20Bedroom/favorite/Blogged%2050",
	'f6': "/Robert's%20Bedroom/previous",
	'f7': "/Robert's%20Bedroom/next",
	'f8': "/Robert's%20Bedroom/volume/-1"
}

// determines current mute status for muting or unmuting
const muteUnmute = () => {
	var options = {
	  host: 'localhost',
	  port: 5005,
	  path: "/Robert's%20Bedroom/state"
	 };

	http.get(options, function(res){
		var body = '';
    res.on('data', function (chunk) {
    	body += chunk;
  	});

	  res.on('end', function () {
	  	var parsed = JSON.parse(body);
	  	parsed.mute ? callEndpoint("/Robert's%20Bedroom/unmute") : callEndpoint("/Robert's%20Bedroom/mute");
	  });
	});
}

callback = function(res) {
  logger.info('STATUS: ' + res.statusCode);
}

const callEndpoint = (type) => {
	logger.info(type);
	var options = {
	  host: 'localhost',
	  port: 5005,
	  path: type,
	  method: 'GET'
	};

	http.request(options, this.callback).end();
}

exports.keyPressCommands = () => {
	keypress(process.stdin);

	process.stdin.on('keypress', function (ch, key) {
		switch (key.name) {
			case 'f1':
				muteUnmute();
				break;
			case 'f2':
				callEndpoint(paths.f2);
				break;
			case 'f3':
				callEndpoint(paths.f3);
				break;
			case 'f4':
				callEndpoint(paths.f4);
				break;
			case 'f5':
				callEndpoint(paths.f5);
				break;
			case 'f6':
				callEndpoint(paths.f6);
				break;
			case 'f7':
				callEndpoint(paths.f7);
				break;
			case 'f8':
				callEndpoint(paths.f8);
				break;
		}

		if (key && key.ctrl && key.name == 'c') {
			process.exit();
		}
	});

	process.stdin.setRawMode(true);
	process.stdin.resume();
}
