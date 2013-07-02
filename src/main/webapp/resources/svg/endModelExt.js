/**
 * 扩展$g.endModel对象, 依赖于svgExt.js
 * Created with IntelliJ IDEA.
 * User: 薄成文
 * Date: 13-6-14
 * Time: 下午5:01
 * To change this template use File | Settings | File Templates.
 */

(function(){
    /**
     * 显示实时曲线
     */
    $g.endModel.prototype.showRealtimeLineChart = function() {
        if (arguments.length > 0) {
            var tagVarArray = arguments;
        }
        //$('#containerBtn').click();
        var self = this;
        if (this.chartInterval != undefined) {
            clearInterval(this.chartInterval);
        }
        $("#facebox").overlay().load();
        $('#facebox').highcharts({
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function() {

                        // set up the updating of the chart each second
                        var series = this.series[0];
                        var series2 = this.series[1];
                        self.chartInterval = setInterval(function() {
                            var x = (new Date()).getTime(), // current time
                                y = Math.random();
                            series.addPoint([x, y], true, true);
                            series2.addPoint([x, Math.random()], true, true);
                        }, 2000);
                        //clearInterval(interval);
                        // todo: 隐藏窗口后取消实时数据
                    }
                }
            },
            title: {
                text: '实时曲线图'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Value'
                }
            },
            tooltip: {
//                valueSuffix: ' m/s',
                formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            plotOptions: {
                spline: {
                    lineWidth: 4,
//                    states: {
//                        hover: {
//                            lineWidth: 5
//                        }
//                    },
                    marker: {
                        enabled: false
                    },
                    pointInterval: 2000 // 1s
                }
            },
            series: [{
                name: 'Hestavollane',
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.random()
                        });
                    }
                    return data;
                })()
            }, {
                name: 'Voll',
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.random()
                        });
                    }
                    return data;
                })()
            }]
            ,
            navigation: {
                menuItemStyle: {
                    fontSize: '10px'
                }
            }
        });
    };

    /**
     * 显示历史曲线
     */
    $g.endModel.prototype.showHistoryLineChart = function() {
        if (arguments.length > 0) {
            var tagVarArray = arguments;
        }

        $("#facebox").overlay().load();
        $('#facebox').highcharts({
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10
            },
            title: {
                text: '历史曲线图'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Value'
                }
            },
            tooltip: {
//                valueSuffix: ' m/s',
                formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            plotOptions: {
                spline: {
                    lineWidth: 4,
//                    states: {
//                        hover: {
//                            lineWidth: 5
//                        }
//                    },
                    marker: {
                        enabled: false
                    }
                }
            },
            series: [{
                name: 'Hestavollane',
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.random()
                        });
                    }
                    return data;
                })()
            }, {
                name: 'Voll',
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.random()
                        });
                    }
                    return data;
                })()
            }]
            ,
            navigation: {
                menuItemStyle: {
                    fontSize: '10px'
                }
            }
        });
    };

    /**
     * 显示快捷菜单
     */
    $g.endModel.prototype.showMenu = function() {
        if (arguments.length <= 0) {
            return;
        }
        var self = this;
        var x = self._svgEvent.clientX;
        var y = self._svgEvent.clientY;
//        var x = 10;//self._svgEvent.screenX;
//        var y = 10;//self._svgEvent.screenY;
        var ul = $('<ul class="u-menu u-menu-gp u-menu-show">').css("top", y).css("left", x);
        for (var i = 0; i < arguments.length; i++) {
            var item = arguments[i];
            if (typeof(item) != "object") {
                continue;
            }

            var text = item.text;
            var script = item.script;
            var li = $('<li><a href="#">'+text+'</a></li>').appendTo(ul).click(function(){
                self.eval(script);
                ul.remove();
            });
        }
        // TODO:弹出菜单编辑功能
        ul.appendTo($("body"));

        // Hide bindings
        var doc = $(svgDoc);
        setTimeout( function() { // Delay for Mozilla
            doc.click(function() {
                doc.unbind('click');
                ul.fadeOut(75);
                ul.remove();
                return false;
            });
        }, 0);
    }

})();
