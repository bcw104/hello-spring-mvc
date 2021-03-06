
if(!window.console) {
    window.console = {};
    window.console.log = function(str) {};
    window.console.dir = function(str) {};
}
//alert(console.debug)
alert(console.log)

$(document).ready(function() {
	
	var asyncHttpStatistics = {
		transportType: 'N/A',
		responseState: 'N/A',
		numberOfTotalMessages: 0,
		numberOfErrors: 0
	};

	function refresh() {

		//alert("Refreshing data tables...");

		$('#transportType').html(asyncHttpStatistics.transportType);
		$('#responseState').html(asyncHttpStatistics.responseState);
		$('#numberOfCallbackInvocations').html(asyncHttpStatistics.numberOfTotalMessages);
		$('#numberOfErrors').html(asyncHttpStatistics.numberOfErrors);

	}

	function onMessage(response) {
		asyncHttpStatistics.numberOfTotalMessages++;
		refresh();
		var message = response.responseBody;
		if(message) {
			$('#latestMessage').html(message);
/*			var result;
	
			try {
				result =  $.parseJSON(message);
				$('#latestMessage').html(result);
			} catch (e) {
				asyncHttpStatistics.numberOfErrors++;
				alert("An error ocurred while parsing the JSON Data: " + message.data + "; Error: " + e);
				return;
			}*/
		}

	}
    //$.comet.init();

    $.comet.connect("/rt/test");

	var socket = $.atmosphere;
	var subSocket;
	//var transport = 'websocket';
    var transport = 'long-polling';
	//var websocketUrl = "${fn:replace(r.requestURL, r.requestURI, '')}${r.contextPath}/websockets/";

	var request = {
		url: "/rt?code=001",
		contentType : "application/json",
		logLevel : 'debug',
		//shared : 'true',
		transport : transport ,
		fallbackTransport: 'long-polling',
		reconnectInterval: 2000,
		//callback: callback,
		onMessage: onMessage,
		onOpen: function(response) {
            console.debug('Atmosphere onOpen: Atmosphere connected using ' + response.transport);
			//alert('Atmosphere onOpen: Atmosphere connected using ' + response.transport);
			transport = response.transport;
			asyncHttpStatistics.transportType = response.transport;
			refresh();
	    },
		onReconnect: function (request, response) {
            console.debug("Atmosphere onReconnect: Reconnecting");
			//alert("Atmosphere onReconnect: Reconnecting");
	    },
		onClose: function(response) {
			//alert('Atmosphere onClose executed');
            console.debug('Atmosphere onClose executed');
		},

		onError: function(response) {
			alert('Atmosphere onError: Sorry, but there is some problem with your '
				+ 'socket or the server is down');
		}
	};

	//subSocket = socket.subscribe(request);
});