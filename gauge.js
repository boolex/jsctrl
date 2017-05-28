var YourControl = {};
    
YourControl.Gauge = function(element){

    var element = element;
	var context = element.getContext("2d");
	
	var isDrawn = false;
	var position = {};
	var size = {};
	var form = {};
	var arrow = {};
	var center = {};
	var radius;
	var pointF = {};
	var pointOnCurve = {};
	var innerScaleRadius ;
	var scale = {};
	
	var init = function(config){
		if(config != null){
			if(config.arrow != null){
				arrow.angle = config.arrow.angle ? config.arrow.angle : arrow.angle;
				arrow.width = config.arrow.width ? config.arrow.width : arrow.width;
				arrow.backgroundColor = config.arrow.backgroundColor ? config.arrow.backgroundColor : arrow.backgroundColor;
			}
			if(config.form != null){
				form.angleFrom = config.form.angleFrom ? config.form.angleFrom : form.angleFrom;
				form.angleTo = config.form.angleTo ? config.form.angleTo : form.angleTo ;
			}
			if(config.scale != null){
				scale.backgroundColor = config.scale.backgroundColor ? config.scale.backgroundColor : scale.backgroundColor;
			}
		}
		
		position.x = position.x ? position.x : 200;
		position.y = position.y ? position.y : 100;
		
		size.width = size.width ? size.width : 500; 
		size.height = size.height ? size.height : 320;
		
		form.angleFrom = form.angleFrom ? form.angleFrom : 30;
		form.angleTo = form.angleTo ? form.angleTo : 330 ;
		
		arrow.angle = arrow.angle ? arrow.angle: -42;
		arrow.length = arrow.length ? arrow.length: 300;
		arrow.backgroundColor = arrow.backgroundColor ? arrow.backgroundColor: "#0a0a0f";
		arrow.width = arrow.width ? arrow.width : 3;
		arrow.isArrowOnCurve = arrow.isArrowOnCurve ? arrow.isArrowOnCurve: false;
		
		scale.backgroundColor = scale.backgroundColor ? scale.backgroundColor : "#f0f0f5";
		center = {
			x: position.x + size.width / 2,
			y: position.y + size.height
		};
		radius = size.width / 2 ;

		pointF = {
			x : center.x  + Math.cos(Math.PI/180 * form.angleFrom) * (radius),
			y : center.y  + Math.sin(Math.PI/180 * form.angleFrom) * (size.height * 3 / 4 )
		}
		pointOnCurve = {
			x : center.x  + Math.cos(Math.PI/180 * arrow.angle) * (radius),
			y : center.y  + Math.sin(Math.PI/180 * arrow.angle) * (size.height * 3 / 4 )
		}
		if(!arrow.isArrowOnCurve)
		{
			var arrowLengthShift = arrow.length - radius;
				pointOnCurve = {
					x : center.x  + Math.cos(Math.PI/180 * arrow.angle) * (arrowLengthShift + radius),
					y : center.y  + Math.sin(Math.PI/180 * arrow.angle) * (arrowLengthShift + size.height * 3 / 4 )
				}
		}
		
		innerScaleRadius = radius - 40;
	}
	var drawScale = function(){
		context.beginPath();
		context.arc(center.x, center.y,radius,Math.PI/180 * form.angleFrom,Math.PI/180 * form.angleTo);
		context.lineWidth=4;
		context.stroke();
	}
	var drawArrow = function(context, center, destinationPoint){
		context.beginPath();
		context.strokeStyle=arrow.backgroundColor;
		context.lineWidth = arrow.width;
		context.moveTo(center.x, center.y);
		context.lineTo(destinationPoint.x, destinationPoint.y);
		context.stroke();
	};
	var drawText = function(context, point, angle, text){	
		 context.save();
		// top-left hand corner with our thumb and finger
		context.translate( point.x, point.y ); 
		context.rotate((angle+90) * Math.PI / 180  );
		context.font = "26px Arial";
		context.fillStyle = "#3d3d5c"; 
		context.textAlign = "center";
		context.fillText( text, 0, 0 );
		context.restore();
	};
	var drawNumbers = function(){
		for(var i = form.angleFrom; i <= form.angleTo; i+=30){
			var textShift = 20;
			var textPointOnCurve = {
				x : center.x  + Math.cos(Math.PI/180 * i) * (textShift + radius),
				y : center.y  + Math.sin(Math.PI/180 * i) * (textShift + size.height * 3 / 4 )
			}
			drawText(context, textPointOnCurve, i, i);
		}
	};
	var drawDegreeDash = function(context, angle, innerDashLength, outerDashLength){
		context.beginPath();
		context.lineWidth=1;
		var pointFrom = {
			x : center.x  + Math.cos(Math.PI/180 * angle) * (radius - innerDashLength),
			y : center.y  + Math.sin(Math.PI/180 * angle) * (size.height * 3 / 4 - innerDashLength)
		}
		var pointTo = {
			x : center.x  + Math.cos(Math.PI/180 * angle) * (radius + outerDashLength),
			y : center.y  + Math.sin(Math.PI/180 * angle) * (size.height * 3 / 4 + outerDashLength)
		}
		//context.beginPath();
		context.moveTo(pointFrom.x, pointFrom.y);
		context.lineTo(pointTo.x, pointTo.y);
		
		context.strokeStyle="#c00";
		context.stroke();
	};
	var drawDegreeDashes = function(){
		for(var i = form.angleFrom;i<=form.angleTo;i+=10){
			var outerLength = 20;
			var innerLength = 20;
			if(i % 30 == 0){
				outerLength = 18;
				innerLength= 30;
			}
			drawDegreeDash(context, i, innerLength, -10);
		}
	}
	var drawInnerScale = function(){
		context.beginPath();
		context.arc(center.x, center.y, innerScaleRadius ,Math.PI/180 * form.angleFrom,Math.PI/180 * form.angleTo);
		context.strokeStyle= "#000";
		context.lineWidth=5;
		//context.closePath();
		
		context.fillStyle = "#f2f7fc"; //red
		context.fill();
		context.stroke();
	}
	var drawScaleBackground = function(from, to, color, radius, width){
		context.beginPath();
		context.arc(center.x, center.y, radius ,Math.PI/180 * from ,Math.PI/180 * to);
		context.lineWidth = width;
		context.strokeStyle= color;
		context.stroke();
	}	
	var drawCenterCircle = function (){
		context.beginPath();
		context.arc(center.x, center.y, 5 ,Math.PI/180 * 0,Math.PI/180 * 360);
		context.lineWidth=10;
		context.strokeStyle= arrow.backgroundColor;
		context.stroke()
	}
	this.draw = function(config){
		if(isDrawn){
			context.clearRect(0, 0, element.width, element.height);
		}		
		
		init(config);		
		drawScale();	
		drawScaleBackground();	
		drawInnerScale();	
		
		drawCenterCircle();
		drawScaleBackground(form.angleFrom, form.angleTo, scale.backgroundColor, radius - 20, 40);
		drawScaleBackground(form.angleFrom, form.angleFrom + 100, '#00cc66', radius - 20, 40);
		drawNumbers();
		drawDegreeDashes();			
		drawArrow(context, center, pointOnCurve);
		isDrawn = true;
	}    
};