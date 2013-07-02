/**
 * Created with IntelliJ IDEA.
 * User: 薄成文
 * Date: 13-7-1
 * Time: 上午9:07
 * To change this template use File | Settings | File Templates.
 */

jQuery.comet = {
    running: true,
    channels: {},
    params: {
        channels : []
    },
    init : function(param) {
        this.subscribeUrl = param.subscribeUrl;
    },
    subscribe: function(channel, onMessage){
        var self = this;
        self.channels[channel] = onMessage;
        $.ajax({
            url: self.subscribeUrl,
            data: {channel : channel},
            dataType:'json',
            cache: false,
            timeout: 3000,
            success: function(data){
                console.log(data);
            }
        });
    },
    connect: function(url) {
        this.running = true;
        var self = this;
        console.log(url);
        (function poll(){

            console.log();
            if (!self.running) {
                return;
            }
            $.ajax({
                url: url,
//                data: param,
                dataType:'json',
                complete:setTimeout( poll, 1000),
                cache: false,
                timeout: 3000,
                success: function(data){
                    $.comet.onMessage(data);
                }
            });
        })();
    },
    onMessage: function(json) {
        console.log(json)
        if (json.channel && $.comet.channels[json.channel]) {
            var channel = $.comet.channels[json.channel];
            for (var i = 0; i < channel.length; i++) {
                var listener = channel[i];
                listener.onMessage(json.message);
            }
        }
    },
    stop: function() {
        running = false;
    }
}

