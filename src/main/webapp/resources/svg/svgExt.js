/**
 * Created with JetBrains WebStorm.
 * User: bcw
 * Date: 13-4-20
 * Time: 下午8:29
 * To change this template use File | Settings | File Templates.
 */

(function(){




    this.$g = {
        /**
         * 末端模型
         * @param endCode 末端编号
         */
        endModel : function(endCode) {
            this.endCode = endCode;
            this.eval = function(str) {
                return eval(str);
            };

        },
        getEndModel: function(endCode) {
            return $g[endCode];
        },
        /**
         * 创建末端对象
         * @param endCode
         */
        createEndModel : function(endCode) {
            var end = $g[endCode] = new $g.endModel(endCode);
            return end;
        },
        /**
         * 更新末端变量列表
         * @param json
         */
        updateVar : function(json) {
            for (endCode in json) {
                var end = $g[endCode];
                if (end) {
                    var valueMap = json[endCode];
                    for (varName in valueMap) {
                        end[varName] = valueMap[varName];
                    }
                }
            }
        }
    };
    var defaultEndTagCode = "default";
    $g.createEndModel(defaultEndTagCode);

    svgQuery = function(node) {
        return svgQuery.fn.init(node);
    }

    svgQuery.se_ns = "http://svg-edit.googlecode.com";

    svgQuery.extend = function(fn) {
        for (key in fn) {
            svgQuery[key] = fn[key]
        }
    };

    svgQuery.textInstance = function(ele) {
        var text = new SVG.Text();
        text.node = ele;
        return text;
    }
    svgQuery.elementInstance = function(ele) {
        return new SVG.Element(ele);
    }
    svgQuery.shapeInstance = function(ele) {
        return new SVG.Shape(ele);
    };

    svgQuery.fn = svgQuery.prototype = {
        init: function(node, endModel) {
            this.endModel = endModel;
            this.node = node;
            if (!!this.node) {
                this.script = this.node.textContent;
            }
            return this;
        },
        attr: function(a, v){
            if (typeof a == 'object') {
                /* apply every attribute individually if an object is passed */
                for (v in a) this.attr(v, a[v])
            } else if (v === null) {//v=null
                /* remove value */
                this.node.removeAttribute(a)
            } else if (v == null) {//未提供v参数,返回属性性
                return this.node.getAttribute(a);
            } else {
                this.node.setAttribute(a, v)
            }
            return this;
        },
        textInstance :function() {// 生成SVG文本对象
            this.svgInstance = svgQuery.textInstance(this.node.parentNode);
            return this;
        },
        shapeInstance : function( ) {// 生成SVG形状对象(rect,ellipse,line...)
            this.svgInstance = svgQuery.shapeInstance(this.node.parentNode);
            return this;
        },
        elementInstance : function( ) {// 生成SVG元素对象
            this.svgInstance = svgQuery.elementInstance(this.node.parentNode);
            return this;
        }
    };
    svgQuery.fn.init.prototype = svgQuery.fn;
    svgQuery.fn.extend = function() {
        var modules, methods, key, i

        /* get list of modules */
        modules = [].slice.call(arguments)

        /* get object with extensions */
        methods = modules.pop()
        for (i = modules.length - 1; i >= 0; i--)
            if (modules[i])
                for (key in methods)
                    modules[i].prototype[key] = methods[key]
    };

    svgQuery.modules = [];

    /**
     * 初始化所有SVG动画,动作
     * @param groupEl 监控对象组
     * @param endModel 监控对象脚本context
     */
    svgQuery.initAll = function(groupEl, endModel) {
//        svgQuery.ColorAnimation.init(groupEl, endModel);
//        svgQuery.VisibilityAnimation.init(groupEl, endModel)
//        svgQuery.SimpleTextAnimation.init(groupEl, endModel);
//        svgQuery.NumberTextAnimation.init(groupEl, endModel);
//        svgQuery.ScriptAction.init(groupEl, endModel);
        for (var i = 0; i < svgQuery.modules.length; i++) {
            var module = svgQuery.modules[i];
            module.init(groupEl, endModel);
        }
    }

    svgQuery.refreshAll = function() {
//        svgQuery.VisibilityAnimation.refreshAll();
//        svgQuery.ColorAnimation.refreshAll();
//        svgQuery.SimpleTextAnimation.refreshAll();
//        svgQuery.NumberTextAnimation.refreshAll();
        for (var i = 0; i < svgQuery.modules.length; i++) {
            var module = svgQuery.modules[i];
            if (module.refreshAll) {
                module.refreshAll();
            }
        }
    }

    /** 颜色动画模块 **/
    svgQuery.colorAnimations = [];
    svgQuery.ColorAnimation = function(element, endModel) {
        svgQuery.fn.init.call(this, element, endModel)
        this.shapeInstance();
        this.blinking = this.attr("blinking") === 'true';
        this.newFill = this.attr("fill");
        this.newStroke = this.attr("stroke");
        this.oldFill = this.svgInstance.attr("fill");
        this.oldStroke = this.svgInstance.attr("stroke");
    }
    // Inherit from svgQuery.fn
    svgQuery.ColorAnimation.prototype = new svgQuery.fn.init;
    svgQuery.modules.push(svgQuery.ColorAnimation);
    svgQuery.ColorAnimation.init = function(groupEl, endModel) {// 解析所有颜色动画元素
        var nodes = groupEl.getElementsByTagNameNS(svgQuery.se_ns, "animation-color")
        for(var i = 0; i < nodes.length; i++) {
            svgQuery.colorAnimations.push(new svgQuery.ColorAnimation(nodes[i], endModel));
        }
    };
    svgQuery.ColorAnimation.refreshAll = function() {
        for (var i = 0; i < svgQuery.colorAnimations.length; i++) {
            svgQuery.colorAnimations[i].refresh();
        }
    }

    svgQuery.fn.extend(svgQuery.ColorAnimation,{
        refresh : function() {
            try {
                var state = this.endModel.eval(this.script);
                if (state !== this.state) {
                    if (typeof(this.state) != 'undefined' && this.blinking) {// 闪烁
                        this.state = state;
                        this.startBlinking();
                    } else {
                        this.state = state;
                        this.run();
                    }
                }
            } catch(err) {
            }
            return this;
        },
        run : function(){
            if (this.state) {
                this.svgInstance.attr("fill", this.newFill);
                this.svgInstance.attr("stroke", this.newStroke);
            } else {
                this.svgInstance.attr("fill", this.oldFill);
                this.svgInstance.attr("stroke", this.oldStroke);
            }
            return this;
        },
        startBlinking : function() {
            clearInterval(this.interval);// 停止以前的闪烁
            var self = this;
            self.intervalState = true;
            this.interval = setInterval(function(){
                if (self.intervalState) {
                    self.svgInstance.attr("fill", self.newFill);
                    self.svgInstance.attr("stroke", self.newStroke);
                } else {
                    self.svgInstance.attr("fill", self.oldFill);
                    self.svgInstance.attr("stroke", self.oldStroke);
                }
                self.intervalState = !self.intervalState;
            }, 500);
            return this;
        },
        stopBlinking : function() {
            clearInterval(this.interval);
            this.run();
            return this;
        }
    });

    /** 可见性动画模块 **/
    svgQuery.visibilityAnimations = [];
    svgQuery.VisibilityAnimation = function(element, endModel) {
        svgQuery.fn.init.call(this, element, endModel)
        this.elementInstance();
        this.blinking = this.attr("blinking") === 'true';
        this.hide = this.attr("hide") == 'true';
    }
    // Inherit from svgQuery.fn
    svgQuery.VisibilityAnimation.prototype = new svgQuery.fn.init
    svgQuery.modules.push(svgQuery.VisibilityAnimation);
    // 静态初始化方法
    svgQuery.VisibilityAnimation.init = function(groupEl, endModel) {
        var nodes = groupEl.getElementsByTagNameNS(svgQuery.se_ns,"animation-visibility")
        for(var i = 0; i < nodes.length; i++) {
            svgQuery.visibilityAnimations.push(new svgQuery.VisibilityAnimation(nodes[i], endModel));
        }
    };
    svgQuery.VisibilityAnimation.refreshAll = function() {
        for (var i = 0; i < svgQuery.visibilityAnimations.length; i++) {
            svgQuery.visibilityAnimations[i].refresh();
        }
    }

    svgQuery.fn.extend(svgQuery.VisibilityAnimation,{
        refresh : function() {
            try {
                var state = this.endModel.eval(this.script);
                if (state !== this.state) {
                    if (typeof(this.state) != 'undefined' && this.blinking) {// 闪烁
                        this.state = state;
                        this.startBlinking();
                    } else {
                        this.state = state;
                        this.run();
                    }
                }
            } catch(err) {
            }
        },
        run : function(){
            if (this.state == this.hide) {
                this.svgInstance.hide();
            } else {
                this.svgInstance.show();
            }
            return this;
        },
        startBlinking : function() {
            clearInterval(this.interval);
            var self = this;
            self.intervalState = true;
            this.interval = setInterval(function(){
                if (self.intervalState == self.hide) {
                    self.svgInstance.hide();
                } else {
                    self.svgInstance.show();
                }
                self.intervalState = !self.intervalState;
            }, 500);
            return this;
        },
        stopBlinking : function() {
            clearInterval(this.interval);
            this.run();
            return this;
        }
    });

    /** 普通文本模块 **/
    svgQuery.simpleTextAnimations = [];
    svgQuery.SimpleTextAnimation = function(element, endModel) {
        svgQuery.fn.init.call(this, element, endModel)
        this.textInstance();
    }
    // Inherit from svgQuery.fn
    svgQuery.SimpleTextAnimation.prototype = new svgQuery.fn.init;
    svgQuery.modules.push(svgQuery.SimpleTextAnimation);
    svgQuery.SimpleTextAnimation.init = function(groupEl, endModel) {
        var nodes = groupEl.getElementsByTagNameNS(svgQuery.se_ns, "animation-simple-text")
        for(var i = 0; i < nodes.length; i++) {
            svgQuery.simpleTextAnimations .push(new svgQuery.SimpleTextAnimation(nodes[i], endModel));
        }
    };
    svgQuery.SimpleTextAnimation.refreshAll = function() {
        for (var i = 0; i < svgQuery.simpleTextAnimations.length; i++) {
            svgQuery.simpleTextAnimations[i].refresh();
        }
    }

    svgQuery.fn.extend(svgQuery.SimpleTextAnimation,{
        refresh : function() {
            try {
                var text = this.endModel.eval(this.script);
                if (text !== this.text) {
                    this.text = text;
                    this.svgInstance.text(this.text);
                }
            } catch(err) {
            }
        }
    });

    /** 数值文本模块 **/
    svgQuery.numberTextAnimations = [];
    svgQuery.NumberTextAnimation = function(element, endModel) {
        svgQuery.fn.init.call(this, element, endModel)
        this.textInstance();
        this.pattern = Number(this.attr("pattern"));
    }

    // Inherit from svgQuery
    svgQuery.NumberTextAnimation.prototype = new svgQuery.fn.init;
    svgQuery.modules.push(svgQuery.NumberTextAnimation);
    svgQuery.NumberTextAnimation.init = function(groupEl, endModel) {
        var nodes = groupEl.getElementsByTagNameNS(svgQuery.se_ns, "animation-num-text")
        for(var i = 0; i < nodes.length; i++) {
            svgQuery.numberTextAnimations.push(new svgQuery.NumberTextAnimation(nodes[i], endModel));
        }
    };
    svgQuery.NumberTextAnimation.refreshAll = function() {
        for (var i = 0; i < svgQuery.numberTextAnimations.length; i++) {
            svgQuery.numberTextAnimations[i].refresh();
        }
    }
    svgQuery.fn.extend(svgQuery.NumberTextAnimation,{
        refresh : function() {
            try {
                var number = Number(this.endModel.eval(this.script));
                if (number !== this.number) {
                    this.number = number;
                    var text = number.toFixed(this.pattern);
                    this.svgInstance.text(text);
                }
            } catch(err) {
            }
        }
    });

    /** 脚本动作模块 **/
    svgQuery.scriptActions= [];
    svgQuery.ScriptAction = function(element, endModel) {
        svgQuery.fn.init.call(this, element, endModel)
        this.elementInstance();
        this.event = this.attr("event");
        var script = this.script;
        var self = this;
        try {
            if (!!this.script && !!this.event) {
                this.svgInstance.on(this.event, function(evt){
                    endModel._svgEvent = evt;
                    self.endModel.eval(script);
                });
            }
        } catch(err) {
        }
    }
    // Inherit from svgQuery.fn
    svgQuery.ScriptAction.prototype = new svgQuery.fn.init;
    svgQuery.modules.push(svgQuery.ScriptAction);
    svgQuery.ScriptAction.init = function(groupEl, endModel) {
        var nodes = groupEl.getElementsByTagNameNS(svgQuery.se_ns, "action-script")
        for(var i = 0; i < nodes.length; i++) {
            svgQuery.scriptActions.push(new svgQuery.ScriptAction(nodes[i], endModel));
        }
    };

    svgQuery.fn.extend(svgQuery.ScriptAction,{
        hello : function() {
            alert("hello")
            return this;
        }
    });

    svgQuery.extend({
        /**
         * 闪烁复归
         */
        stopBlinking : function() {
            for (var i = 0; i < svgQuery.colorAnimations.length; i++) {
                svgQuery.colorAnimations[i].stopBlinking();
            }
            for (var i = 0; i < svgQuery.visibilityAnimations.length; i++) {
                svgQuery.visibilityAnimations[i].stopBlinking();
            }
        }
    });
    var se_ns_Color = 'se:animation-color';
    var se_ns_Visibility = 'se:animation-visibility';
    var se_ns_simpleText = 'se:animation-simple-text';
    var se_ns_numText = 'se:animation-num-text';
    var se_ns_actionScript = 'se:action-script';

})(this);

//test = true
testText = "abcbca"
function init() {

    //svgDoc = document.getElementById("svgObject").contentDocument;

    svgDoc = document.getElementById("svgFrame").contentWindow.document;
    var children = svgDoc.documentElement.childNodes;
    for (var i = 0; i < children.length; i++) {
        var groupEl = children[i];
        if (groupEl.nodeName == 'g') {
            var endCode = groupEl.getAttribute("name");
            var endModel = $g.default;
            if (typeof(endCode) == 'string') {
                endModel = $g.createEndModel(endCode);
            }
            svgQuery.initAll(groupEl, endModel);
        }
    }

    /* 启动脚本 */

    var nodes = svgDoc.getElementsByTagNameNS(svgQuery.se_ns, "start-script")
    if (nodes.length > 0) {
        var startScript = nodes[0].textContent;
        //alert(startScript)
        startScript = "$g.codeTest.test = true; $g['codeTest']['numberText'] = 23;";
        eval(startScript);
    }

    var loopScript = false;
    nodes = svgDoc.getElementsByTagNameNS(svgQuery.se_ns, "loop-script")
    if (nodes.length > 0) {
        loopScript = nodes[0].textContent;
    }

//    $g.codeTest.test = true;
//    $g['codeTest']['numberText'] = 23;

    function loop() {
        /*循环脚本*/
        if (loopScript) {
            eval(loopScript);
        }
//        $g['codeTest']['numberText'] = $g['codeTest']['numberText'] + 1;
//        $g.codeTest.test = $g['codeTest']['numberText'] % 10 < 5;

        /* 动画脚本刷新 */
        svgQuery.refreshAll();

        setTimeout(loop, 1000);
    }
    //loop();

    // http long loop 更新数据
    function onMessage(response) {
        var message = response.responseBody;
        if(message) {
            var result;
            try {
                //alert(message)
                result =  $.parseJSON(message);
                //$('#latestMessage').html(result);
                $g.updateVar(result)
                /* 动画脚本刷新 */
                svgQuery.refreshAll();
            } catch (e) {
                alert("An error ocurred while parsing the JSON Data: " + message.data + "; Error: " + e);
                return;
            }
        }

    }
    $.comet().subscribe({
        url: "/rt/test?code=001",
        onMessage: function(json){
            console.log(json);
        }
    });

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
        reconnectInterval: 1000,
        //callback: callback,
        onMessage: onMessage,
        onOpen: function(response) {
            alert('Atmosphere onOpen: Atmosphere connected using ' + response.transport);
            //transport = response.transport;
        },
        onReconnect: function (request, response) {
            //alert("Atmosphere onReconnect: Reconnecting");
        },
        onClose: function(response) {
            alert('Atmosphere onClose executed');
        },

        onError: function(response) {
            alert('Atmosphere onError: Sorry, but there is some problem with your '
                + 'socket or the server is down');
        }
    };

    //subSocket = socket.subscribe(request);

}

