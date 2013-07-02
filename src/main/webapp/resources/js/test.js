/**
 * Created with JetBrains WebStorm.
 * User: bcw
 * Date: 13-4-20
 * Time: 下午8:56
 * To change this template use File | Settings | File Templates.
 */
var nodes = document.getElementById("svgFrame").contentWindow.document.getElementsByTagName("se:animation-visibility");
alert(nodes.length)
test = true
testText = "abcbca"
numberText = 23;

//var nodes = document.getElementsByTagName("se:animation-visibility")
//var colorAnimation = svgQuery.colorAnimation(nodes[0])
//alert(colorAnimation.script)
//colorAnimation.refresh()

//setTimeout(function(){colorAnimation.stopBlinking()}, 5000);
svgQuery.initColorAnimations()
svgQuery.initVisibilityAnimation()
svgQuery.initSimpleTextAnimation();
svgQuery.initNumberTextAnimation();
svgQuery.initScriptAction();

function loop() {
    test = !test;
    numberText = numberText + 1;
    for (var i = 0; i < svgQuery.visibilityAnimations.length; i++) {
        svgQuery.visibilityAnimations[i].refresh();
    }
    for (var i = 0; i < svgQuery.colorAnimations.length; i++) {
        svgQuery.colorAnimations[i].refresh();
    }
    for (var i = 0; i < svgQuery.simpleTextAnimations.length; i++) {
        svgQuery.simpleTextAnimations[i].refresh();
    }
    for (var i = 0; i < svgQuery.numberTextAnimations.length; i++) {
        svgQuery.numberTextAnimations[i].refresh();
    }
    setTimeout(loop, 1000);
}
loop();

//var draw = SVG('viewport')
//var rect = new SVG.Shape(document.getElementById('svg_1'));
//rect.fill('green')

//rect.attr('fill','green')
//var ellipse = draw.ellipse(100, 100).attr('cx', '20%').fill('#333')
//
//rect.x(0).y(0).animate(3000).move(200, 200).during(function(pos, morph) {
//    /* numeric values */
//    ellipse.size(morph(100, 200), morph(100, 50))
//
//    /* unit strings */
//    ellipse.attr('cx', morph('20%', '80%'))
//
//    /* hex color strings */
//    ellipse.fill(morph('#333', '#ff0066'))
//}).after(function(){
//        this.animate().attr({ fill: '#000' })
//    });


//var text = new SVG.Text();
//text.node = (document.getElementById('svg_2'));
//text = svgQuery(document.getElementById('svg_2')).textInstance()
//text.text('000')
